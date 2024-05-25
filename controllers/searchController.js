const PropertyRequest = require('../models/propertyRequest');
const Ad = require('../models/ad');
const joi = require('joi');

const schema = joi.object({
    propertyType: joi.string().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').optional(),
    city: joi.string().optional(),
    district: joi.string().optional(),
    minPrice: joi.number().min(0).optional().default(0),
    maxPrice: joi.number().min(0).optional().default(Infinity),
    areaMin: joi.number().min(0).optional().default(0),
    areaMax: joi.number().min(0).optional().default(Infinity),
});

exports.propertyRequestsFilter = async (req, res, next) => {

    try {
        const params = await schema.validateAsync(req.query);

        const { propertyType, city, district, minPrice, maxPrice, areaMin, areaMax } = params;
        // const { propertyType, city, district, minPrice = 0, maxPrice = Infinity, areaMin = 0, areaMax = Infinity } = req.query;

        const filters = {
            ...(propertyType && { propertyType }),
            ...(city && { city }),
            ...(district && { district }),
            ...{ price: { $gte: minPrice, $lte: maxPrice } },
            ...{ area: { $gte: areaMin, $lte: areaMax } },
        };

        const requests = await PropertyRequest.find(filters).sort({ refreshedAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        if (err.isJoi) {
            return res.status(400).json({ error: err.details[0].message });
        }
        next(err);
    }
};

exports.adsFilter = async (req, res) => {
    try {
        const params = await schema.validateAsync(req.query);

        const { propertyType, city, district, minPrice, maxPrice, areaMin, areaMax } = params;

        const filters = {
            ...(propertyType && { propertyType }),
            ...(city && { city }),
            ...(district && { district }),
            ...{ price: { $gte: minPrice, $lte: maxPrice } },
            ...{ area: { $gte: areaMin, $lte: areaMax } },
        };

        const requests = await Ad.find(filters).sort({ refreshedAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        console.error(err);

        if (err.isJoi) {
            return res.status(400).json({ error: err.details[0].message });
        }
        next(err);
    }
};