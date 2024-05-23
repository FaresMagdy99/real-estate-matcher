const User = require('../models/user');


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
          $lookup: {
            from: 'PropertyRequest', // Join with PropertyRequest collection
            localField: '_id', // Local field in User collection (usually _id)
            foreignField: 'createdBy', // Foreign field referencing User in PropertyRequest
            as: 'requests',
          },
        },
        {
          $lookup: {
            from: 'Ad', // Join with Ad collection
            localField: '_id', // Local field in User collection (usually _id)
            foreignField: 'createdBy', // Foreign field referencing User in Ad collection
            as: 'ads',
          },
        },
        {
          $unwind: '$requests', // Unwind request documents for aggregation
        },
        {
          $unwind: '$ads', // Unwind ad documents for aggregation
        },
        {
          $group: {
            _id: {
              id: '$_id', // Group by user ID
              role: '$role', // Group by user role
            },
            name: { $first: '$name' }, // Get first name from user document
            requestsCount: { $sum: 1 }, // Count number of requests
            totalRequestsAmount: { $sum: '$requests.price' }, // Sum request prices
            adsCount: { $sum: 1 }, // Count number of ads
            totalAdsAmount: { $sum: '$ads.price' }, // Sum ad prices
          },
        },
        {
          $group: {
            _id: null, // Group all documents into one
            data: { $push: '$$ROOT' }, // Push user stats objects into an array
          },
        },
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
  