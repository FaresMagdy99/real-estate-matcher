const Ad = require('../models/ad');
const User = require('../models/user');
const Joi = require('joi');

const adSchema = Joi.object({
  propertyType: Joi.string().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').required(),
  area: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  description: Joi.string().optional()
});

exports.createAd = async (req, res) => {
  try {
    const body = await adSchema.validateAsync(req.body);

    const { propertyType, area, price, city, district, description } = body;

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

    if (err.isJoi) {
      return res.status(400).json({ message: err.details[0].message });
    }

    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
