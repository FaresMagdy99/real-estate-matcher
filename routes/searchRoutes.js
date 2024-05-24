// routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const PropertyRequest = require('../models/propertyRequest');
const Ad = require('../models/ad');
const auth = require('../utils/JWTAuth')

router.get('/propertyRequests', auth, async (req, res) => {

    try {

        const { propertyType, city, district, minPrice = 0, maxPrice = Infinity, areaMin = 0, areaMax = Infinity} = req.query;

        const filters = {
            ...(propertyType && { propertyType }),
            ...(city && { city }),
            ...(district && { district }),
            ...(minPrice && maxPrice && { price: { $gte: minPrice, $lte: maxPrice } }),
            ...(areaMin && areaMax && { area: { $gte: areaMin, $lte: areaMax } }),
        };

        const requests = await PropertyRequest.find(filters).sort({ refreshedAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/ads', auth, async (req, res) => {
    try {

        const { propertyType, city, district, minPrice = 0, maxPrice = Infinity, areaMin = 0, areaMax = Infinity } = req.query;

        const filters = {
            ...(propertyType && { propertyType }),
            ...(city && { city }),
            ...(district && { district }),
            ...(minPrice && maxPrice && { price: { $gte: minPrice, $lte: maxPrice } }),
            ...(areaMin && areaMax && { area: { $gte: areaMin, $lte: areaMax } }),
        };

        const requests = await Ad.find(filters).sort({ refreshedAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
