import { SALT, JWT_SECRET } from '@/config/enviroments';
import { validateUser } from '@/Schemas/User.schemas';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
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

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json('Username and password are required');
    return;
  }

  try {
    const foundUser = await UserModel.findOne({ username });

    if (!foundUser) {
      res.status(404).json('User not found');
      return;
    }

    const isPasswordValid = compareSync(password, foundUser.password);

    if (!isPasswordValid) {
      res.status(401).json('Invalid password');
      return;
    }

    jwt.sign({ userId: foundUser._id, username: foundUser.username }, JWT_SECRET, { expiresIn: '2h' }, (err, token) => {
      if (err) throw err;
      res.status(200).cookie('token', token, { sameSite: 'lax', secure: false }).json({
        id: foundUser._id,
        username: foundUser.username
      });
      return;
    });

  } catch (error) {
    console.log(error);
    res.status(500).json('An error occurred');
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token').json('Logged out');
}

export const profileUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.cookie?.split('=')[1];

    if (!token) {
      res.status(401).json('Unauthorized');
      return;
    }

    jwt.verify(token, JWT_SECRET, {}, (err, decoded) => {
      if (err) throw err;
      res.status(200).json(decoded);
    });
  } catch (error) {
    res.status(401).json('Unauthorized');
  }
}