const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getAdminStats); // Get Matching Requests for Ad

module.exports = router;
