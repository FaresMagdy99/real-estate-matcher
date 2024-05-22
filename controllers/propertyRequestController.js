const PropertyRequest = require('../models/propertyRequest');
const jwt = require('jsonwebtoken');

exports.createRequest = async (req, res) => {
  try {
    const { propertyType, area, price, city, district, description } = req.body;

    // Verify JWT token and get user ID (implement middleware for verification)
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Create new property request
    const request = new PropertyRequest({
      propertyType,
      area,
      price,
      city,
      district,
      description,
      createdBy: userId,
    });

    await request.save();

    res.status(201).json({ message: 'Property request created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
