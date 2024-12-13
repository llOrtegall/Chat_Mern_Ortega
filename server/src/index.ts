import { PORT, MONGO_URL, JWT_SECRET, CORS_ORIGIN } from '@/config/enviroments';
import { CustomWebSocket, TokenPayload } from './types/interfaces';
import { userRouter } from './routes/user.routes';
import { MessageModel } from '@/models/Messages';
import jwt from 'jsonwebtoken';
import express, { Request } from 'express';
import { UserModel } from '@/models/User';
import ws from 'ws';
import mongoose from 'mongoose';
import cors from 'cors';

mongoose.connect(MONGO_URL);

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true, }));

app.use('/', userRouter);

async function getUserByToken(req: Request) {
  const token = req.headers.cookie?.split('=')[1];
  if (!token) return null;
  return jwt.verify(token, JWT_SECRET, {}) as TokenPayload;
}

app.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserByToken(req);

  if (!userData) {
    res.status(401).json('Unauthorized');
    return;
  }

  try {
    const messages = await MessageModel.find({
      sender: { $in: [userId, userData.userId] },
      recipient: { $in: [userId, userData.userId] }
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json('An error occurred');
  }
});

app.get('/people', async (req, res) => {
  try {
    const users = await UserModel.find({}, { '_id': 1, 'username': 1 });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json('An error occurred');
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const wss = new ws.WebSocketServer({ server });

wss.on('connection', (socket: CustomWebSocket, request) => {

  const notifyOnlinePeople = () => {
    // notify all clients about the new connection (when someone connects)
    [...wss.clients].forEach((c: CustomWebSocket) => {
      c.send(JSON.stringify({
        online: [...wss.clients].map((c: CustomWebSocket) => ({
          userId: c.userId, username: c.username
        }))
      }))
    });
  }

  socket.isAlive = true;

  socket.timer = setInterval(() => {
    socket.ping();

    socket.deathTimer = setTimeout(() => {
      socket.isAlive = false;
      clearInterval(socket.timer);
      socket.terminate();
      notifyOnlinePeople();
      // 
      // console.log('Client is dead');
    }, 5000);
  }, 10000);

  socket.on('pong', () => {
    // console.log('Pong received');
    clearTimeout(socket.deathTimer);
  });

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
    if (message.recipient && message.text) {
      const msgDoc = await MessageModel.create({
        sender: socket.userId,
        recipient: message.recipient,
        text: message.text
      });

      [...wss.clients]
        .filter((c: CustomWebSocket) => c.userId === message.recipient)
        .forEach((c: CustomWebSocket) => {
          c.send(JSON.stringify({
            mgsSend: {
              sender: socket.userId,
              recipient: message.recipient,
              text: message.text,
              _id: msgDoc._id
            }
          }))
        });
    }
  });

  notifyOnlinePeople();

})
