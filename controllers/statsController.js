const User = require('../models/user');

exports.getAdminStats = async (req, res) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });
    if (user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized: Only admin can access stats' });
    }

    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;

        const pipeline = [
            {
                $lookup: {
                    from: "propertyrequests",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "requests",
                },
            },
            {
                $unwind: {
                    path: "$requests",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ads",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "ads",
                },
            },
            {
                $unwind: {
                    path: "$ads",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name", },
                    role: { $first: "$role", },
                    requestsCount: {
                        $sum: { $cond: ["$requests", 1, 0], },
                    },
                    totalRequestsAmount: {
                        $sum: { $ifNull: ["$requests.price", 0], },
                    },
                    adsCount: {
                        $sum: { $cond: ["$ads", 1, 0], },
                    },
                    totalAdsAmount: {
                        $sum: { $ifNull: ["$ads.price", 0], },
                    },
                },
            },
            {
                $facet: {
                    metadata: [{ $count: "total", },],
                    data: [{ $skip: skip }, { $limit: limit },],
                },
            },
        ];

        const stats = await User.aggregate(pipeline);
        const total = stats[0].metadata[0] ? stats[0].metadata[0].total : 0;

        const response = {
            data: stats[0].data,
            page: page,
            limit: limit,
            total: total,
            hasNextPage: page * limit < total,
            hasPreviousPage: page > 1
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
