import { User } from '../Schemas/User.schemas';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

export const UserModel = model('User', UserSchema);