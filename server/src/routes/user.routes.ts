import { registerNewUser } from '@/controllers/user.controller';
import { Router } from 'express';

export const userRouter = Router();

userRouter.post('/register', registerNewUser);
