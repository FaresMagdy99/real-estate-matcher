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

    // Calculate price range based on ad price and tolerance
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
      { $skip: limit * (page - 1) }, // Pagination: skip based on page and limit
      { $limit: limit },
    ];

    const requests = await PropertyRequest.aggregate(pipeline);
    const totalRequests = await PropertyRequest.countDocuments({ district: ad.district });

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
