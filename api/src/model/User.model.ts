import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  names: { type: String, required: true },
  lastnames: { type: String, required: true },
}, { timestamps: true });

const UserModel = model('User', UserSchema);

export { UserModel };