import { SALT, JWT_SECRET } from '@/config/enviroments';
import { validateUser } from '@/Schemas/User.schemas';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Request, Response } from 'express';
import { UserModel } from '@/models/User';
import jwt from 'jsonwebtoken';

const bcryptSalt = genSaltSync(parseInt(SALT));

export const registerNewUser = async (req: Request, res: Response) => {

  try {
    const data = validateUser(req.body);
    const hasPassword = hashSync(data.password, bcryptSalt);

    const createdUser = await UserModel.create({
      username: data.username,
      email: data.email,
      password: hasPassword
    });

    jwt.sign({ userId: createdUser._id, username: createdUser.username }, JWT_SECRET, { expiresIn: '2h' }, (err, token) => {
      if (err) throw err;
      res.status(201).cookie('token', token, { sameSite: 'lax', secure: false }).json({
        id: createdUser._id,
        username: createdUser.username
      });
      return;
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('An error occurred');
  }
}
