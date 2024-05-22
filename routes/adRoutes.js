const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const matchingController = require('../controllers/matchingController');
const propertyRequestController = require('../controllers/propertyRequestController')
// ... middleware (e.g., authentication) ...

router.post('/', adController.createAd); // Create Ad

router.get('/:adId/requests', matchingController.getMatchingRequests); // Get Matching Requests for Ad

router.post('/propReq', propertyRequestController.createRequest)

module.exports = router;
