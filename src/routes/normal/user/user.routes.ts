// Purpose: User routes for normal users.
// path: /user

import { Router, Response, Request } from 'express';
import { VerifToken, VerifTokenPassId } from '../../../jwt/verif_token';

// routes
import getAllUsers from './user.getAllUsers';
import getUserById from './user.getUserById';
import createUser from './user.createUser';
import loginUser from './user.loginUser';
import updateUser from './user.updateUser';
import updateUserPassword from './user.updateUserPassword';
import profileUser from './user.profileUser';

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Returns a list of all users with selected attributes.
 *     responses:
 *       200:
 *         description: Success - Returns all users
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
router.get('/', VerifToken, getAllUsers);


/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     description: Retrieves the profile of the authenticated user.
 *     security:
 *       - Bearer JWT: []
 *     responses:
 *       200:
 *         description: Success - Returns the user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 profile_picture:
 *                   type: string
 *                 victories:
 *                   type: integer
 *                 defeats:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       500:
 *         description: Internal Server Error
 */

router.get('/profile', VerifTokenPassId, profileUser);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     description: Retrieves a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Success - Returns the user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 victories:
 *                   type: integer
 *                 defeats:
 *                   type: integer
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

router.get('/:id', VerifToken, getUserById);

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Creates a new user with the provided details.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User creation details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             profile_picture:
 *               type: string
 *           required:
 *             - username
 *             - email
 *             - password
 *     responses:
 *       201:
 *         description: Success - User created
 *       400:
 *         description: Bad Request - Missing parameters or bad format for email/password
 *       409:
 *         description: Conflict - User already exists
 *       500:
 *         description: Internal Server Error
 */

router.post('/create', createUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     description: Logs in a user with the provided credentials and password.
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
 *         description: Unauthorized - Wrong password
 *       404:
 *         description: Not Found - User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     description: Updates user details with the provided information.
 *     security:
 *       - Bearer JWT: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: body
 *         name: body
 *         description: User details for update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             profile_picture:
 *               type: string
 *           required:
 *             - username
 *             - email
 *     responses:
 *       201:
 *         description: Success - User updated
 *       400:
 *         description: Bad Request - Missing parameters or wrong email format
 *       404:
 *         description: Not Found - User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/update', VerifTokenPassId, updateUser);

/**
 * @swagger
 * /user/update/password:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     description: Updates user password with the provided new password.
 *     security:
 *       - Bearer JWT: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for authentication
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *           required:
 *             - password
 *     responses:
 *       201:
 *         description: Success - User password updated
 *       400:
 *         description: Bad Request - Missing parameters or password in wrong format
 *       404:
 *         description: Not Found - User not found
 *       500:
 *         description: Internal Server Error
 */

router.put('/update/password', VerifTokenPassId, updateUserPassword);

export default router;