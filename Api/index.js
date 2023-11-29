import { UserModel } from './models/User.js';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws'
import { MessageModel } from './models/Message.js';
import mongoose from 'mongoose';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const MONGO_URL=process.env.MONGO_URL
const JWT_SECRET=process.env.JWT_SECRET
const bcryptSalt = bycrypt.genSaltSync(10);
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

async function getUserDataFromRequest(req){
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token){
      jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
        if(err) throw err;
        resolve(userData)
      })
    }else{
      reject({message: 'Unauthorized'})
    }
  });
}

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.get('/messages/:userId', async (req, res) => {
  const {userId} = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await MessageModel.find({
    sender: {$in: [userId, ourUserId]},
    recipient: {$in: [userId, ourUserId]}
  }).sort({createdAt: -1}).exec();
  res.json(messages);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  
  const foundUser = await UserModel.findOne({username})
  if(foundUser){
    const passOk = bycrypt.compareSync(password, foundUser.password)
    if(passOk){
      jwt.sign({userId: foundUser._id, username}, JWT_SECRET, {}, (err, token) => {
        if(err) throw err;
        res.cookie('token', token, {sameSite: 'none', secure: true }).status(200).json({
          id: foundUser._id
        })
      })
    }
  }  
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
  try {
    const hashedPassword = bycrypt.hashSync(password, bcryptSalt)
    const createdUser = await UserModel.create({ 
      username: username,
      password: hashedPassword
    })
    jwt.sign({userId: createdUser._id, username}, JWT_SECRET, {}, (err, token) => {
      if (err) {
        res.status(500).json({message: 'Internal server error', error: err})
      }
      res.cookie('token', token, {sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id
      })
    })
  } catch (err) {
    res.status(500).json({message: 'Internal server error', error: err})
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

// TODO: read username from the cookie for this connection
wss.on('connection', (connection, req) => {
  const cookies = req.headers.cookie;
  if(cookies){
    const tokenCokieString = cookies.split(';').find(str => str.startsWith('token='));
    if(tokenCokieString){
      const token = tokenCokieString.split('=')[1];
      if(token){
        jwt.verify(token, JWT_SECRET, {}, (err, userData) => {
          if(err) throw err;
          const {userId, username} = userData;
          connection.userId = userId;
          connection.username = username;      
        })
      }
    }

    connection.on('message', async (message) => {
      const messageData = JSON.parse(message.toString());
      const {recipient, text} = messageData;
      if(recipient && text) {
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
              id: messageDoc._id
            }
          )))
      }
    })
  }

  // TODO: notify everyone about online people
  [...wss.clients].forEach(client => {
    client.send(JSON.stringify({
      online: [...wss.clients].map(c => ({userId: c.userId, username: c.username}))
    }
    ))
  })
})
