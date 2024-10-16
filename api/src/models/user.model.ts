import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { dbConnection } from '../connection';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare names: string;
  declare lastNames: string;
  declare email: string;
  declare password: string;
}

User.init({
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4, },
  names: { type: DataTypes.STRING(40), allowNull: false, },
  lastNames: { type: DataTypes.STRING(40), allowNull: true, },
  email: { type: DataTypes.STRING(180), allowNull: false, unique: true, },
  password: { type: DataTypes.STRING(120), allowNull: false, },
}, {
  sequelize: dbConnection,
  modelName: 'User',
  timestamps: true
})

export { User };