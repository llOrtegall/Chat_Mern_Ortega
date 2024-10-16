import { createdUser } from '../controllers/user.controller';
import { Router } from "express";

const UserRouter = Router();

UserRouter.get('/user', createdUser);

export { UserRouter };