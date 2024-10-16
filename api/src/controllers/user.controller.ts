import { validateLogin, validateRegister } from '../schemas/user.schemas';
import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT = 12;
const SECRET = process.env.JWT_SECRET!

export const createdUser = async (req: Request, res: Response) => {
  const result = await validateRegister(req.body);

  if (result.error) {
    res.status(400).json({ message: result.error.errors[0].message });
    return;
  }

  if (result.data.password !== result.data.confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match' });
    return;
  }

  const hasPassword = bycrypt.hashSync(result.data.password, SALT);

  try {
    await User.sync();
    const user = await User.create({
      names: result.data.names,
      lastNames: result.data.lastNames,
      email: result.data.email,
      password: hasPassword,
    });

    console.log(user.dataValues);

    res.status(201).json({ message: 'User created' });
    return;
  } catch (e) {
    if (e instanceof Error && e.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    console.log(e);

    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}

export const getUserByEmail = async (req: Request, res: Response) => {
  const result = await validateLogin(req.body);

  if (result.error) {
    res.status(400).json({ message: result.error.errors[0].message });
    return;
  }

  try {
    const user = await User.findOne({ where: { email: result.data.email } });

    if (!user) {
      res.status(404).json({ message: 'User not found, please check your email' });
      return;
    }

    const comparePassword = await bycrypt.compare(result.data.password, user.password);

    if (!comparePassword) {
      res.status(401).json({ message: 'Incorrect password' });
      return;
    }

    const { id, names } = user.dataValues;

    jwt.sign({ id, names }, SECRET, { expiresIn: '2h' }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true }).status(200).json({ message: 'Login successful', userId: id });
      return;
    })

  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}

export const verifyUser = async (req: Request, res: Response) => {
  const token = req.cookies?.token;
  
  if (token) {
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      res.status(200).json(decoded);
      return;
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }


}