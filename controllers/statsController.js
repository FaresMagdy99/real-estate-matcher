const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.getAdminStats = async (req, res) => {
    // Verify JWT token, get user ID, and check role (implement middleware)
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId });
    if (user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized: Only admin can access stats' });
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const pipeline = [
            {
                '$lookup': {
                    'from': 'propertyrequests',
                    'localField': '_id',
                    'foreignField': 'createdBy',
                    'as': 'requests'
                }
            }, {
                '$lookup': {
                    'from': 'ads',
                    'localField': '_id',
                    'foreignField': 'createdBy',
                    'as': 'ads'
                }
            }, {
                '$unwind': {
                    'path': '$requests',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$unwind': {
                    'path': '$ads',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$group': {
                    '_id': '$_id',
                    'name': {
                        '$first': '$name'
                    },
                    'role': {
                        '$first': '$role'
                    },
                    'requestsCount': {
                        '$sum': {
                            '$cond': [
                                {
                                    '$not': [
                                        '$requests'
                                    ]
                                }, 0, 1
                            ]
                        }
                    },
                    'totalRequestsAmount': {
                        '$sum': '$requests.price'
                    },
                    'adsCount': {
                        '$sum': {
                            '$cond': [
                                {
                                    '$not': [
                                        '$ads'
                                    ]
                                }, 0, 1
                            ]
                        }
                    },
                    'totalAdsAmount': {
                        '$sum': '$ads.price'
                    }
                }
            },
            {
                '$facet': {
                    'metadata': [{ '$count': 'total' }],
                    'data': [{ '$skip': skip }, { '$limit': limit }]
                }
            }
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
