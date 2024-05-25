/**
 * @swagger
 * tags:
 *   name: Property Requests
 *   description: Endpoints for managing property requests
 */

/**
 * @swagger
 * /api/propertyRequests/:
 *   post:
 *     summary: Create a new property request
 *     description: Creates a new property request with the provided details.
 *     tags: [Property Requests]
 *     security:
 *       - JWTAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *                 description: The type of property being requested.
 *                 enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT']
 *               area:
 *                 type: number
 *                 description: The area size of the property.
 *               price:
 *                 type: number
 *                 description: The price range for the property.
 *               city:
 *                 type: string
 *                 description: The city where the property is located.
 *               district:
 *                 type: string
 *                 description: The district where the property is located.
 *               description:
 *                 type: string
 *                 description: Additional description for the property request.
 *     responses:
 *       201:
 *         description: Property request created successfully.
 *       401:
 *         description: Unauthorized. Only CLIENTs can create property requests.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWTAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


const express = require('express');
const router = express.Router();
const propertyRequestController = require('../controllers/propertyRequestController');
const auth = require('../utils/JWTAuth')


router.post('/', auth, propertyRequestController.createRequest);
router.put('/update/:requestId', auth, propertyRequestController.updateRequest);


module.exports = router;
