import { getUserDataFromRequest } from './user.controller';
import { MessageModel } from '../model/Message.model';
import { Request, Response } from 'express';

const messageById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userData = await getUserDataFromRequest(req)
    
    const ourUserId = userData.userId;
    const messages = await MessageModel.find({
      sender: { $in : [userId, ourUserId] },
      recipient: { $in : [userId, ourUserId] }
    }).sort({ createdAt: 1 })

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export { messageById };
