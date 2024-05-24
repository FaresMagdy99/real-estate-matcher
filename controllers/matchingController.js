const PropertyRequest = require('../models/propertyRequest');
const Ad = require('../models/ad');

exports.getMatchingRequests = async (req, res) => {
  try {
    const adId = req.params.adId;
    const limit = parseInt(req.query.limit) || 10; 
    const page = parseInt(req.query.page) || 1;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    const priceTolerance = 0.1; // 10% tolerance

    const minPrice = ad.price * (1 - priceTolerance);
    const maxPrice = ad.price * (1 + priceTolerance);

    // Aggregation pipeline to find matching requests
    const pipeline = [
      { $match: { district: ad.district } },
      {
        $match: {
          price: { $gte: minPrice, $lte: maxPrice },
        },
      },
      { $sort: { refreshedAt: -1 } }, // descending
      // Sort stage can only use the index when it is the first stage
      // Or the first stage AFTER a first match https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/#-sort-operator-and-memory:~:text=The%20%24sort%20operator%20can%20take%20advantage%20of%20an%20index%20if%20it%27s%20used%20in%20the%20first%20stage%20of%20a%20pipeline%20or%20if%20it%27s%20only%20preceeded%20by%20a%20%24match%20stage.
      { $skip: limit * (page - 1) }, // Pagination: skip based on page and limit
      { $limit: limit },
    ];

    const requests = await PropertyRequest.aggregate(pipeline);
    const totalRequests = await PropertyRequest.countDocuments({ district: ad.district }); //???? askk

    if (totalRequests == 0) return res.status(200).json({ message: 'No matching requests' });

    res.status(200).json({
      requests,
      totalRequests,
      currentPage: page,
      totalPages: Math.ceil(totalRequests / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
