import { UserModel } from './models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL=process.env.MONGO_URL
const JWT_SECRET=process.env.JWT_SECRET
const PORT = 4040;
const app = express();
app.use(express.json());

mongoose.connect(MONGO_URL);

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.post('/register', async(req, res) => {
  const { username, password } = req.body;
  const createdUser = await UserModel.create({ username, password })
  jwt.sign({userId: createdUser._id}, JWT_SECRET, {}, (err, token) => {
    if (err) {
      res.status(500).json({message: 'Internal server error', error: err})
    }
    res.cookie('token', token).status(201).json('ok')
  })
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});