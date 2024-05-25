const PropertyRequest = require('../models/propertyRequest');
const Ad = require('../models/ad');
const Joi = require('joi');

const requestParamsSchema = Joi.object({
  limit: Joi.number().integer().min(1).optional(),
  page: Joi.number().integer().min(1).optional()
});

exports.getMatchingRequests = async (req, res) => {
  try {
    await requestParamsSchema.validateAsync(req.query);

    const adId = req.params.adId;
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    const priceTolerance = 0.1; // 10% tolerance

    const minPrice = ad.price * (1 - priceTolerance);
    const maxPrice = ad.price * (1 + priceTolerance);

    const pipeline = [
      {
        $match: {
          district: ad.district,
          price: { $gte: minPrice, $lte: maxPrice }
        }
      },
      {
        $facet: {
          requests: [
            { $sort: { refreshedAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit }
          ],
          totalRequests: [
            { $count: "count" }
          ]
        }
      }
    ];

    const result = await PropertyRequest.aggregate(pipeline);
    const requests = result[0].requests;
    const totalRequests = result[0].totalRequests[0] ? result[0].totalRequests[0].count : 0;


    if (totalRequests == 0) return res.status(200).json({ message: 'No matching requests' });

    res.status(200).json({
      requests,
      totalRequests,
      currentPage: page,
      totalPages: Math.ceil(totalRequests / limit),
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.details[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
