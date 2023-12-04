import { userRoutes } from './src/Routes/User.Routes.js'
import { messRoutes } from './src/Routes/Mess.Routes.js'
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT
const app = express();

app.disable('x-powered-by');

app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173']
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGO_URL);

app.use(userRoutes);

app.use(messRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });


wss.on('connection', (connection, req) => {

  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
      }
      ))
    })
  }

  connection.isAlive = true

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000)
  }, 5000)

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer)
  })

  // TODO: read username from the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCokieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCokieString) {
      const token = tokenCokieString.split('=')[1];
      if (token) {
        jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        })
      }
    }

    connection.on('message', async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text } = messageData;
      if (recipient && text) {
        const messageDoc = await MessageModel.create({
          sender: connection.userId,
          recipient,
          text
        });

        [...wss.clients]
          .filter(c => c.userId === recipient)
          .forEach(c => c.send(JSON.stringify(
            {
              text,
              sender: connection.userId,
              recipient,
              _id: messageDoc._id
            }
          )))
      }
    })
  }

  // TODO: notify everyone about online people
  notifyAboutOnlinePeople()

})
