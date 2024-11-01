import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { validateUser } from './Schemas/User.schemas';
import { MessageModel } from './models/Messages';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from './models/User';
import ws, { WebSocket } from 'ws';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
const MONGO_URL = process.env.MONGO_URL ?? ''
const SALT = process.env.SALT_ROUNDS as string;
const PORT = process.env.PORT ?? 3000;

const bcryptSalt = genSaltSync(parseInt(SALT));

mongoose.connect(MONGO_URL);

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true, }));

app.get('/test', (req, res) => {
  res.send('Hello World this is a test');
});

app.get('/profile', async (req, res) => {

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
});


app.post('/login', async (req, res) => {
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
});

app.post('/register', async (req, res) => {
  const data = validateUser(req.body);

  const hasPassword = hashSync(data.password, bcryptSalt);

  try {
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
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

interface CustomWebSocket extends WebSocket {
  userId?: string;
  username?: string;
}

interface TokenPayload extends JwtPayload {
  userId: string;
  username: string;
}

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (socket: CustomWebSocket, request) => {
  const cookies = request.headers.cookie;
  // read the cookie from the request
  if (cookies) {
    const tokenStr = cookies.split('=')[1];
    if (tokenStr) {
      jwt.verify(tokenStr, JWT_SECRET, {}, (err, decoded) => {
        if (err) {
          socket.close(1008, 'Unauthorized');
          return;
        }
        const payload = decoded as TokenPayload;

        socket.userId = payload.userId;
        socket.username = payload.username;

      });
    }
  }

  socket.on('message', async (msg) => {
    const message = JSON.parse(msg.toString());
    if(message.recipient && message.text){
      const msgDoc = await MessageModel.create({
        sender: socket.userId,
        recipient: message.recipient,
        text: message.text
      });

      [...wss.clients]
        .filter((c: CustomWebSocket) => c.userId === message.recipient)
        .forEach((c: CustomWebSocket) => {
          c.send(JSON.stringify({
            sender: socket.userId,
            text: message.text,
            id: msgDoc._id
          }))
        });
    }
  });

  // notify all clients about the new connection (when someone connects)
  [...wss.clients].forEach((c: CustomWebSocket) => {
    c.send(JSON.stringify({
      online: [...wss.clients].map((c: CustomWebSocket) => ({
        userId: c.userId, username: c.username
      }))
    }))
  });
})

