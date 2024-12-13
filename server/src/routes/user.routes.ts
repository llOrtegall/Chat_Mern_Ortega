import { registerNewUser, loginUser, logoutUser, profileUser } from '@/controllers/user.controller';
import { Router } from 'express';

export const userRouter = Router();

userRouter.post('/register', registerNewUser);

userRouter.post('/login', loginUser);

userRouter.post('/logout', logoutUser);

userRouter.get('/profile', profileUser);
