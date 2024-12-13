import { getMessages, getPeople } from '@/controllers/chat.controller';
import { Router } from 'express';

export const chatRouter = Router();

chatRouter.get('/messages/:userId', getMessages);

chatRouter.get('/people', getPeople);
