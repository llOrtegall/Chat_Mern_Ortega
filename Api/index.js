import { UserModel } from './models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL=process.env.MONGO_URL
const JWT_SECRET=process.env.JWT_SECRET
const PORT = 4040;
const app = express();

app.disable('x-powered-by');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGO_URL);

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.get('/profile', async (req, res) => {
  const token = req.cookies?.token;
  if(token){
    jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
      if(err) throw err;
      res.json(userData)
    })
  }else{
    res.status(401).json({message: 'Unauthorized'})
  }
});
 

app.post('/register', async(req, res) => {
  const { username, password } = req.body;
  const createdUser = await UserModel.create({ username, password })
  jwt.sign({userId: createdUser._id, username}, JWT_SECRET, {}, (err, token) => {
    if (err) {
      res.status(500).json({message: 'Internal server error', error: err})
    }
    res.cookie('token', token, {sameSite: 'none', secure: true }).status(201).json({
      id: createdUser._id, 
    })
  })
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});