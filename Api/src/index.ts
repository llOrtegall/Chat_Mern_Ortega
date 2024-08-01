import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express from 'express';
import bcryp from 'bcryptjs';
import cors from 'cors';
import 'dotenv/config';
import ws from 'ws';

mongoose.connect(process.env.MONGO_URL as string)

import { UserModel } from './model/User.model';

const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET as string;
const ORIGIN_URL = process.env.ORIGIN_URL as string;
const ORIGIN_URL1 = process.env.ORIGIN_URL1 as string;
const SALT = parseInt(process.env.SALT as string);

app.disable('x-powered-by');
app.use(cookieParser());
app.use(cors({
  origin: [ORIGIN_URL, ORIGIN_URL1],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/profile', async (req, res) => {
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
});

app.post('/login', async (req, res) => {
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
});

app.post('/register', async (req, res) => {
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

});


const server = app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});

// TODO: Implementar el WebSocketServer para el chat
const wss = new ws.WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
});