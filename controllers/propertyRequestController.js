const PropertyRequest = require('../models/propertyRequest');
const User = require('../models/user');
const Joi = require('joi');

const propertyRequestSchema = Joi.object({
  propertyType: Joi.string().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').required(),
  area: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  description: Joi.string().optional()
});

exports.createRequest = async (req, res) => {
  try {
    const body = await propertyRequestSchema.validateAsync(req.body);

    const { propertyType, area, price, city, district, description } = body;

    const userId = req.userId;

    const user = await User.findOne({ _id: userId })
    // console.log(user);
    if (user.role !== 'CLIENT') {
      return res.status(401).json({ message: 'Unauthorized: Only CLIENTs can create Property Requests' });
    }

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
    if (err.isJoi) {
      return res.status(400).json({ message: err.details[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateRequestSchema = Joi.object({
  description: Joi.string().optional(),
  area: Joi.number().positive().optional(),
  price: Joi.number().positive().optional()
});

exports.updateRequest = async (req, res) => {
  try {
    const body = await updateRequestSchema.validateAsync(req.body);

    const { requestId } = req.params;
    const { description, area, price } = body;

    const userId = req.userId;

    const user = await User.findOne({ _id: userId })
    // console.log(user);
    if (user.role !== 'CLIENT') {
      return res.status(401).json({ message: 'Unauthorized: Only CLIENTs can create Property Requests' });
    }

    const request = await PropertyRequest.findById(requestId);
    // console.log(requestId);
    // console.log(request);

    if (!request) {
      return res.status(404).json({ message: 'Property request not found' });
    }

    //checking if the 'createdBy' field matches the user ID
    if (request.createdBy != userId) {
      return res.status(401).json({ message: 'Unauthorized: You only can update Property Requests you created' });
    }

    request.description = description;
    request.area = area;
    request.price = price;
    request.refreshedAt = Date.now();

    await request.save();

    res.status(200).json({ message: 'Property request updated successfully', request });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ message: err.details[0].message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};