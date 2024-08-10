import { Router } from 'express';

import { loginUser, registerUser, getProfile, logoutProfile, getUserDataUsers } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/login', loginUser);

userRouter.post('/register', registerUser);

userRouter.get('/profile', getProfile);

userRouter.post('/logout', logoutProfile);

userRouter.get('/people', getUserDataUsers);

export default userRouter;