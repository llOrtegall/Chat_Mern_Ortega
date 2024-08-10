import { Router } from 'express';

import { messageById } from '../controllers/messages.controller';

const messageRouter = Router();

messageRouter.get('/messages/:userId', messageById);


export default messageRouter;