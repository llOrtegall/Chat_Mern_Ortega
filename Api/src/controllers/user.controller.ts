import { UserModel } from '../model/User.model';
import { Request, Response } from 'express';
import { JWT_SECRET, SALT } from '../config';
import jwt from 'jsonwebtoken';
import bcryp from 'bcryptjs';

import { UserDataInt } from '../types/types';

export async function getUserDataFromRequest(req: Request): Promise<UserDataInt> {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
        if (err) return reject(err);
        // Type assertion to ensure userData is of type UserDataInt
        if (userData && typeof userData !== 'string') {
          resolve(userData as UserDataInt);
        } else {
          reject('Invalid token payload');
        }
      });
    } else {
      reject('No token found');
    }
  });
}

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json('User not found');

    const passwordMatch = bcryp.compareSync(password, user.password);
    if (!passwordMatch) return res.status(401).json('Clave incorrecta');

    jwt.sign({ userId: user._id, username }, JWT_SECRET, {}, (err: any, token?: string) => {
      if (err) throw err;
      if (token) {
        res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({ id: user._id });
      } else {
        res.status(500).json('Token generation failed');
      }
    });

  } catch (error) {
    res.status(400).json(error);
  }

}

const registerUser = async (req: Request, res: Response) => {

  const { username, password } = req.body;

  try {
    const hashedPassword = bcryp.hashSync(password, SALT);

    const newUser = await UserModel.create({
      username: username,
      password: hashedPassword
    });

    jwt.sign({ userId: newUser._id, username }, JWT_SECRET, {}, (err: any, token?: string) => {
      if (err) throw err;
      if (token) {
        res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({ id: newUser._id });
      } else {
        res.status(500).json('Token generation failed');
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }

}

const getProfile = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) return res.status(404).json('No token found');

  try {
    jwt.verify(token, JWT_SECRET, {}, async (err: any, decoded: any) => {
      if (err) return res.status(401).json('Unauthorized');

      const user = await UserModel.findById(decoded.userId);
      if (!user) return res.status(404).json('User not found');

      return res.status(200).json({ id: user._id, username: user.username });
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

const logoutProfile = async (req: Request, res: Response) => {
  try {
    return res.cookie('token', '', { sameSite: 'none', secure: true }).status(200).json('Logged out');
  } catch (error) {
    return res.status(500).json(error);
  }
}

const getUserDataUsers = async (req: Request, res: Response ) => {
    try {
    const users = await UserModel.find({}, {'_id': 1, username: 1 })
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export { loginUser, registerUser, getProfile, logoutProfile, getUserDataUsers };