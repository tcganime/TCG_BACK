import Archetype from "../../models/archetype.model";

async function FindArchetypeById(id: number) : Promise<Archetype | null> {
    let archetype = await Archetype.findByPk(id);
    return archetype;
}

export default FindArchetypeById;