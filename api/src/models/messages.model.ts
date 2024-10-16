import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { dbConnection } from '../connection';

class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<string>;
  declare sender: string;
  declare recipient: string;
  declare text: string;
}

Message.init({
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: DataTypes.UUIDV4, },
  sender: { type: DataTypes.STRING(40), allowNull: false, },
  recipient: { type: DataTypes.STRING(40), allowNull: false, },
  text: { type: DataTypes.STRING, allowNull: false, },
}, {
  sequelize: dbConnection,
  modelName: 'Message',
  timestamps: true
})

export { Message };