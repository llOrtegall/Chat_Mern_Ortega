import { PORT, MONGO_URL, JWT_SECRET, CORS_ORIGIN } from '@/config/enviroments';
import { CustomWebSocket, TokenPayload } from '@/types/interfaces';
import { userRouter } from '@/routes/user.routes';
import { chatRouter } from '@/routes/chat.routes';
import { MessageModel } from '@/models/Messages';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import ws from 'ws';

mongoose.connect(MONGO_URL);

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true, }));

app.use('/', userRouter);
app.use('/', chatRouter);

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
