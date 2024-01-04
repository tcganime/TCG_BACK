import { Request, Response } from 'express';
import getAllArchetypes from '../../../services/archetypes/archetype.getAllArchetypes';

async function ArchetypesDebug(req: Request, res: Response) {
    try {
        let archetypes = await getAllArchetypes();
        return res.status(200).json(archetypes);
    } catch (error) {
        res.status(500).send({ message: `/admin/archetypes/debug - ${error.message}` });
    }
}

export default ArchetypesDebug;
