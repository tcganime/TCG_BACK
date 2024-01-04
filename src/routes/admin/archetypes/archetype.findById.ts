import { Request, Response } from "express";
import findArchetypeById from "../../../services/archetypes/archetype.findArchetypeById";

async function findById(res: Response, req: Request) {
    try {
        if (!req.params.id) return res.status(400).send({ message: "Archetype id is required" });
        let archetype = await findArchetypeById(Number(req.params.id));

        if (!archetype) return res.status(404).send({ message: "Archetype not found" });

        return res.status(200).json({
            id: archetype.id,
            name: archetype.name
        });

    } catch (error) {
        res.status(500).send({ message: `/admin/archetypes/find - ${error.message}` });
    }
}

export default findById;