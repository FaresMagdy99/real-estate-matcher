/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Admin statistics endpoints
 */

/**
 * @swagger
 * /api/stats/:
 *   get:
 *     summary: Get admin statistics
 *     description: Retrieve statistics for admin users, including requests and ads counts.
 *     tags: [Stats]
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: Successful response. Returns admin statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The user ID.
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                       role:
 *                         type: string
 *                         description: The role of the user.
 *                       requestsCount:
 *                         type: integer
 *                         description: The count of requests created by the user.
 *                       totalRequestsAmount:
 *                         type: number
 *                         description: The total amount of requests created by the user.
 *                       adsCount:
 *                         type: integer
 *                         description: The count of ads created by the user.
 *                       totalAdsAmount:
 *                         type: number
 *                         description: The total amount of ads created by the user.
 *                 page:
 *                   type: integer
 *                   description: The current page number.
 *                 limit:
 *                   type: integer
 *                   description: The limit of items per page.
 *                 total:
 *                   type: integer
 *                   description: The total count of admin users.
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Indicates if there are more pages after the current page.
 *                 hasPreviousPage:
 *                   type: boolean
 *                   description: Indicates if there are previous pages before the current page.
 *       401:
 *         description: Unauthorized. Only admin users can access this endpoint.
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
const statsController = require('../controllers/statsController');
const auth = require('../utils/JWTAuth')

router.get('/', auth, statsController.getAdminStats);

module.exports = router;
