const Ad = require('../models/ad');
const jwt = require('jsonwebtoken');

exports.createAd = async (req, res) => {
  try {
    const { propertyType, area, price, city, district, description } = req.body;

    // Verify JWT token, get user ID, and check role (implement middleware)
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (decoded.role !== 'AGENT') {
      return res.status(401).json({ message: 'Unauthorized: Only agents can create ads' });
    }

    // Create new ad
    const ad = new Ad({
      propertyType,
      area,
      price,
      city,
      district,
      description,
      createdBy: userId,
    });

    await ad.save();

    res.status(201).json({ message: 'Ad created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
