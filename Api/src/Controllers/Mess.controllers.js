import { MessageModel } from '../../models/Message.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'

env.config()

const JWT_SECRET = process.env.JWT_SECRET

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData)
      })
    } else {
      reject({ message: 'Unauthorized' })
    }
  });
}

export const messages = async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await MessageModel.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] }
  }).sort({ createdAt: 1 }).exec();
  res.json(messages);
}