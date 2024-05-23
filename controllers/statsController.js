const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.getAdminStats = async (req, res) => {

    // Verify JWT token, get user ID, and check role (implement middleware)
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findOne({ _id: userId })
    // console.log(user);
    if (user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized: Only admin can access stats' });
    }

    try {
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
                    '_id': {
                        'id': '$_id',
                        'role': '$role'
                    },
                    'name': {
                        '$first': '$name'
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
            }, {
                '$group': {
                    '_id': null,
                    'data': {
                        '$push': '$$ROOT'
                    }
                }
            }
        ];

        const stats = await User.aggregate(pipeline);

        if (!stats.length) {
            return res.json({ data: [], message: 'No user statistics found' });
        }

        res.json(stats[0]); // Return the first element containing the data array
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
