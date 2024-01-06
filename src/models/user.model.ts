import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../init/sequelize';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         admin:
 *           type: boolean
 *         superadmin:
 *           type: boolean
 *         victories:
 *           type: integer
 *         defeats:
 *           type: integer
 *         profile_picture:
 *           type: string
 *           nullable: true
 *       required:
 *         - id
 *         - username
 *         - email
 *         - password
 *         - created_at
 *         - updated_at
 *         - admin
 *         - victories
 *         - defeats
 *       example:
 *         id: 1
 *         username: JohnDoe
 *         email: john.doe@example.com
 *         password: hashedPassword
 *         created_at: '2024-01-01T12:00:00.000Z'
 *         updated_at: '2024-01-01T12:30:00.000Z'
 *         admin: false
 *         victories: 10
 *         defeats: 5
 *         profile_picture: null
 */

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  admin: boolean;
  victories: number;
  defeats: number;
  profile_picture: string | null;
  superadmin: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public admin!: boolean;
  public victories!: number;
  public defeats!: number;
  public profile_picture!: string | null;
  public superadmin!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE(6), // Include milliseconds precision
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE(6), // Include milliseconds precision
      defaultValue: DataTypes.NOW,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    victories: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    defeats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    profile_picture: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    superadmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: false, // Set to true if you want Sequelize to manage timestamps automatically
  }
);

export default User;