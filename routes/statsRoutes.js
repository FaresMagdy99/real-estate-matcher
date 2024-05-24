const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../utils/JWTAuth')

router.get('/', auth, statsController.getAdminStats);

module.exports = router;
