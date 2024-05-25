const express = require('express');
const router = express.Router();
const auth = require('../utils/JWTAuth')
const searchController = require('../controllers/searchController');


router.get('/propertyRequests', auth, searchController.propertyRequestsFilter);

router.get('/ads', auth, searchController.adsFilter);

module.exports = router;
