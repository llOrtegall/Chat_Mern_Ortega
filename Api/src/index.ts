import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express, { Request } from 'express';
import bcryp from 'bcryptjs';
import cors from 'cors';
import 'dotenv/config';
import ws, { WebSocket } from 'ws';

// TODO: Imports models
import { MessageModel } from './model/Message.model';
import { UserModel } from './model/User.model';

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  username?: string;
}

interface MessageDataInt {
  recipient: string;
  text: string;
}

interface UserDataInt {
  userId: string;
  username: string;
  iat: number;
}

mongoose.connect(process.env.MONGO_URL as string)


const app = express();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET as string;
const ORIGIN_URL = process.env.ORIGIN_URL as string;
const ORIGIN_URL1 = process.env.ORIGIN_URL1 as string;
const SALT = parseInt(process.env.SALT as string);

async function getUserDataFromRequest(req: Request): Promise<UserDataInt> {
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

app.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userData = await getUserDataFromRequest(req)
    
    const ourUserId = userData.userId;
    const messages = await MessageModel.find({
      sender: { $in : [userId, ourUserId] },
      recipient: { $in : [userId, ourUserId] }
    }).sort({ createdAt: -1 })

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(error);
  }
})

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

wss.on('connection', (connection: ExtendedWebSocket, req) => {

  // TODO: esto es para verificar si el usuario está autenticado y obtener su userId y username
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find((cookie: string) => cookie.includes('token'));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {

        jwt.verify(token, JWT_SECRET, {}, async (err: any, decoded: any) => {
          if (err) throw err;

          const { userId, username } = decoded;

          connection.userId = userId;
          connection.username = username;

        });
      }
    }
  }

  connection.on('message', async (message: string) => {
    const messageData: MessageDataInt = JSON.parse(message)
    const { recipient, text } = messageData;

    if (recipient && text) {
      const newMessageDoc = await MessageModel.create({ sender: connection.userId, recipient, text });
      [...wss.clients]
        .filter((client: ExtendedWebSocket) => client.userId === recipient)
        .forEach((client: ExtendedWebSocket) => {
          client.send(JSON.stringify({
            text,
            sender: connection.userId,
            recipient,
            id: newMessageDoc._id
          }));
        })
    }
  });

  // TODO: enviar a todos los clientes conectados la lista de usuarios conectados
  [...wss.clients].forEach((client: ExtendedWebSocket) => {
    client.send(JSON.stringify({
      online: [...wss.clients].map((client: ExtendedWebSocket) => ({ userId: client.userId, username: client.username }))
    }));
  });

});