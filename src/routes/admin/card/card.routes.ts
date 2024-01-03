// Purpose: Card routes for admin users.
// path: /admin/cards

import { Router } from 'express';
import { verifyAdminToken } from '../../../jwt/verif_token';

// routes

import cardDebug from './card.debug';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin_Card
 *   description: The admin card managing API
 */

/**
 * @swagger
 * /admin/cards/debug:
 *   get:
 *     summary: Get all cards for debugging
 *     tags: [Cards]
 *     description: Retrieves a list of all cards for debugging purposes.
 *     responses:
 *       200:
 *         description: Success - Returns a list of all cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'  # Assuming you have a schema definition for Card
 *       500:
 *         description: Internal Server Error
*/

router.get('/debug', verifyAdminToken, cardDebug)

export default router;