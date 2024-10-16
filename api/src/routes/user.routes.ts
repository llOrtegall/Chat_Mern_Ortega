import { createdUser, getUserByEmail, verifyUser } from '../controllers/user.controller';
import { Router } from "express";

const UserRouter = Router();

UserRouter.post('/register', createdUser);

UserRouter.post('/login', getUserByEmail);

UserRouter.get('/profile', verifyUser);

export { UserRouter };