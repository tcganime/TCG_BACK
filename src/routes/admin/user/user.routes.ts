// Purpose: User routes for admin users.
// path: /admin/user

import { Router, Request, Response } from 'express';
import { verifyAdminToken } from '../../../jwt/verif_token';

// routes
import userDebug from './user.debug';
import getUserByIdAdmin from './user.getUserByIdAdmin';
import makeAdminById from './user.makeAdminById';
import deleteById from './user.deleteById';
import userLoginAdmin from './user.userLoginAdmin';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin_Users
 *   description: The admin users managing API
 */

/**
 * @swagger
 * /admin/user/debug:
 *   get:
 *     summary: Get all users for debugging
 *     tags: [Admin_Users]
 *     description: Retrieves a list of all users for debugging purposes.
 *     responses:
 *       200:
 *         description: Success - Returns a list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'  # Assuming you have a schema definition for User
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - Bearer JWT: []
 *     securitySchemes:
 *       Bearer JWT:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 */

router.get('/debug', verifyAdminToken, userDebug);

/**
 * @swagger
 * /admin/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin_Users]
 *     description: Returns user details by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success - Returns user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found - User not found
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - Bearer JWT: []
 *     securitySchemes:
 *       Bearer JWT:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 */

router.get('/:id', verifyAdminToken, getUserByIdAdmin);

/**
 * @swagger
 * /admin/user/login:
 *   post:
 *     summary: Admin user login
 *     tags: [Admin_Users]
 *     description: Logs in an admin user with the provided credentials and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - credential
 *               - password
 *     responses:
 *       200:
 *         description: Success - Returns tokens for authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing parameters
 *       401:
 *         description: Unauthorized - Wrong password or user is not an admin
 *       404:
 *         description: Not Found - User not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/login', userLoginAdmin);

/**
 * @swagger
 * /admin/makeAdmin/{id}:
 *   put:
 *     summary: Make a user admin
 *     tags: [Admin_Users]
 *     description: Make a user admin by setting the 'admin' flag to true.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *       - in: headers
 *         name: Authorization
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       201:
 *         description: Success - User is now admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - Bearer JWT: []
 *     securitySchemes:
 *       Bearer JWT:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 */

router.put('/makeAdmin/:id', verifyAdminToken, makeAdminById);

/**
 * @swagger
 * /admin/user/delete/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Admin_Users]
 *     description: Deletes a user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *       - in: headers
 *         name: Authorization
 *         type: string
 *         required: true
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Success - User deleted
 *       500:
 *         description: Internal Server Error
 *     security:
 *       - Bearer JWT: []
 *     securitySchemes:
 *       Bearer JWT:
 *         type: apiKey
 *         in: header
 *         name: Authorization
 */

router.delete('/:id', verifyAdminToken, deleteById);

export default router;