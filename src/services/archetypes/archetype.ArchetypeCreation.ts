import Archetype from "../../models/archetype.model";

async function ArchetypeCreation(archetype_name: string) : Promise<Archetype | null> {
    let archetype = await Archetype.create({name: archetype_name})
    .catch((error) => {
        console.log(error.message);
        return null;
    });

    return archetype;
}

export default ArchetypeCreation;