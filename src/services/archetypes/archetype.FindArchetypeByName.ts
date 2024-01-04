import Archetype from "../../models/archetype.model";

async function FindArchetypeByName(name: string) : Promise<Archetype | null> {
    let archetype = await Archetype.findOne({ where: { name: name } });

    if (!archetype) return null;
    return archetype;
}

export default FindArchetypeByName;