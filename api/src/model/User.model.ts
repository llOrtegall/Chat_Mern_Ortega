import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  lastnames: { type: String, required: true },
  password: { type: String, required: true },
  names: { type: String, required: true },
}, { timestamps: true });

const UserModel = model('User', UserSchema);

export { UserModel };