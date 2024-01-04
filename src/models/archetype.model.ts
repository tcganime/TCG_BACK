import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../init/sequelize';

/**
 * @swagger
 * components:
 *   schemas:
 *     Archetype:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           unique: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - created_at
 *         - updated_at
 *       example:
 *         id: 1
 *         name: "ArchetypeName"
 *         created_at: '2024-01-01T12:00:00.000Z'
 *         updated_at: '2024-01-01T12:30:00.000Z'
 */

interface ArchetypeAttributes {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface ArchetypeCreationAttributes extends Optional<ArchetypeAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Archetype extends Model<ArchetypeAttributes, ArchetypeCreationAttributes> implements ArchetypeAttributes {
  public id!: number;
  public name!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Archetype.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE(6), // Include milliseconds precision
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE(6), // Include milliseconds precision
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'archetypes',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  }
);

export default Archetype;