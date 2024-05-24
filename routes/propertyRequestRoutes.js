const express = require('express');
const router = express.Router();
const propertyRequestController = require('../controllers/propertyRequestController');

// const auth = require('../middleware/auth');
// router.post('/', auth, propertyRequestController.createRequest); 

router.post('/', propertyRequestController.createRequest);
router.post('/update', propertyRequestController.updateRequest);


module.exports = router;
