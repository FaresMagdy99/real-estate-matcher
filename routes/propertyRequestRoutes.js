const express = require('express');
const router = express.Router();
const propertyRequestController = require('../controllers/propertyRequestController');
const auth = require('../utils/JWTAuth')


router.post('/', auth, propertyRequestController.createRequest);
router.post('/update', auth, propertyRequestController.updateRequest);


module.exports = router;
