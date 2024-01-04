import Archetype from "../../../models/archetype.model";
import { Request, Response } from "express";
import ArchetypeCreation from "../../../services/archetypes/archetype.ArchetypeCreation";
import FindArchetypeByName from "../../../services/archetypes/archetype.FindArchetypeByName";

async function createArchetype(res: Response, req: Request) {
    try {

        if (!req.body.name) return res.status(400).send({ message: "Archetype name is required" });

        let isExistingArchetype = FindArchetypeByName(req.body.name);
        if (isExistingArchetype) return res.status(409).send({ message: "Archetype already exists" });

        let isCreated = await ArchetypeCreation(req.body.name);
        if (!isCreated) return res.status(500).send({ message: "Archetype not created" });

        return res.status(201).send({ message: "Archetype created" });
    } catch (error) {
        res.status(500).send({ message: `/admin/archetypes/create - ${error.message}` });
    }
}

export default createArchetype;