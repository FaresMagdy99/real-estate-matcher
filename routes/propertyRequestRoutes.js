const express = require('express');
const router = express.Router();
const propertyRequestController = require('../controllers/propertyRequestController');

// Authentication middleware (implement logic for JWT verification)
const auth = require('../middleware/auth'); // Replace with your middleware file

router.post('/', auth, propertyRequestController.createRequest); 

module.exports = router;
