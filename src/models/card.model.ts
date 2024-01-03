import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../init/sequelize';
import Archetype from './archetype.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         card_type:
 *           type: string
 *         type:
 *           type: array
 *           items:
 *             type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         effect:
 *           type: string
 *         image:
 *           type: string
 *         archetypes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Archetype'
 *         limited:
 *           type: integer
 *       required:
 *         - id
 *         - name
 *         - description
 *         - card_type
 *         - type
 *         - created_at
 *         - updated_at
 *         - limited
 *       example:
 *         id: 1
 *         name: "CardName"
 *         description: "Card Description"
 *         card_type: "Type"
 *         type: ["Type1", "Type2"]
 *         created_at: '2024-01-01T12:00:00.000Z'
 *         updated_at: '2024-01-01T12:30:00.000Z'
 *         effect: "Card Effect"
 *         image: "image-url.jpg"
 *         archetypes: [1, 2, 3]
 *         limited: 0
 */

interface CardAttributes {
  id: number;
  name: string;
  description: string;
  card_type: string;
  type: string[];
  created_at: Date;
  updated_at: Date;
  effect: string;
  image: string;
  archetypes: number[];
  limited: number;
}

interface CardCreationAttributes extends Optional<CardAttributes, 'id' | 'created_at' | 'updated_at' | 'archetypes'> {}

class Card extends Model<CardAttributes, CardCreationAttributes> implements CardAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public card_type!: string;
  public type!: string[];
  public created_at!: Date;
  public updated_at!: Date;
  public effect!: string;
  public image!: string;
  public archetypes!: number[];
  public limited!: number;
}

Card.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    card_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
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
    effect: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    archetypes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    limited: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Card',
    timestamps: true,
    underscored: true,
    tableName: 'cards',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  }
);

// Define association with Archetype model
Card.belongsToMany(Archetype, { through: 'CardArchetypes', foreignKey: 'card_id' });
Archetype.belongsToMany(Card, { through: 'CardArchetypes', foreignKey: 'archetype_id' });

export default Card;