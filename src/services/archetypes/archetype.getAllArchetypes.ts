import Archetype from "../../models/archetype.model";

async function getAllArchetypes() : Promise<Archetype[]> {
    let archetypes = await Archetype.findAll();

    return archetypes;
}

export default getAllArchetypes;