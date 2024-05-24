const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const matchingController = require('../controllers/matchingController');
const propertyRequestController = require('../controllers/propertyRequestController')
const auth = require('../utils/JWTAuth')

router.post('/', auth, adController.createAd); 

router.get('/:adId/requests', auth, matchingController.getMatchingRequests); 

// router.post('/propReq', propertyRequestController.createRequest)

module.exports = router;
