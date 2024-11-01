import { model, Schema } from 'mongoose';

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  text: { type: String }
}, { timestamps: true });

const MessageModel = model('Message', MessageSchema);

export { MessageModel };