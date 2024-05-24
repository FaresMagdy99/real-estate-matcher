const Ad = require('../models/ad');
const User = require('../models/user');

exports.createAd = async (req, res) => {
  try {
    const { propertyType, area, price, city, district, description } = req.body;

    const userId = req.userId;


    const user = await User.findOne({ _id: userId })
    // console.log(user);
    if (user.role !== 'AGENT') {
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
