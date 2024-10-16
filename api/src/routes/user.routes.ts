import { createdUser, getUserByEmail } from '../controllers/user.controller';
import { Router } from "express";

const UserRouter = Router();

UserRouter.post('/register', createdUser);

UserRouter.post('/login', getUserByEmail);

export { UserRouter };