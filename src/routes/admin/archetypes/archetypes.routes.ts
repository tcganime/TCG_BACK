import { Router } from 'express';
import ArchetypesDebug from './archetypes.debug';
import createArchetype from './archetype.createArchetype';
import findById from './archetype.findById';

/**
 * @swagger
 * tags:
 *   name: Admin_Archetypes
 *   description: The admin archetypes managing API
 */

const router = Router();


/**
 * @swagger
 * /admin/archetypes/debug:
 *   get:
 *     summary: Get all archetypes for debugging
 *     tags: [Admin_Archetypes]
 *     description: Retrieves a list of all archetypes for debugging purposes.
 *     responses:
 *       200:
 *         description: Success - Returns a list of all archetypes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archetype'  # Assuming you have a schema definition for Archetype
 *       500:
 *         description: Internal Server Error
 */

router.get('/debug', ArchetypesDebug)

/**
 * @swagger
 * /admin/archetypes/{id}:
 *   get:
 *     summary: Get archetype by ID
 *     tags: [Admin_Archetypes]
 *     description: Retrieves an archetype based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Archetype ID
 *     responses:
 *       200:
 *         description: Success - Returns the archetype
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archetype'  # Assuming you have a schema definition for Archetype
 *       400:
 *         description: Bad Request - Missing parameters or bad format
 *       500:
 *         description: Internal Server Error
 */

router.get('/:id', findById)

/**
 * @swagger
 * /admin/archetypes/create:
 *   post:
 *     summary: Create a new archetype
 *     tags: [Admin_Archetypes]
 *     description: Creates a new archetype with the provided name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Success - Archetype created
 *       400:
 *         description: Bad Request - Missing parameters or bad format
 *       409:
 *         description: Conflict - Archetype already exists
 *       500:
 *         description: Internal Server Error
 */

router.post('/create', createArchetype)

export default router;