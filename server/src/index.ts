import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { validateUser } from './Schemas/User.schemas';
import { UserModel } from './models/User';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
const MONGO_URL = process.env.MONGO_URL ?? ''
const PORT = process.env.PORT ?? 3000;

mongoose.connect(MONGO_URL);

const app = express();

app.use(cors(
  {
    origin: CORS_ORIGIN,
    credentials: true,
  }
));
app.use(express.json());

app.get('/test', (req, res) => {
  res.send('Hello World this is a test');
});

app.post('/register', async(req, res) => {
  const data = validateUser(req.body);

  try {
    const createdUser = await UserModel.create(data);

    jwt.sign({ userId: createdUser._id }, JWT_SECRET, (err: VerifyErrors, token: JwtPayload) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: false });
      res.status(201).json({ message: 'User registered successfully' });
    });

  } catch (error) {
    console.log(error);
    res.status(400).json('Invalid data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});