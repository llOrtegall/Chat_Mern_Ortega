import { MessageModel } from '@/models/Messages';
import { getUserByToken } from '@/services/auth';
import { Request, Response } from 'express';

export const getMessages = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userData = await getUserByToken(req);

  if (!userData) {
    res.status(401).json('Unauthorized');
    return;
  }

  try {
    const messages = await MessageModel.find({
      sender: { $in: [userId, userData.userId] },
      recipient: { $in: [userId, userData.userId] }
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json('An error occurred');
  }

}