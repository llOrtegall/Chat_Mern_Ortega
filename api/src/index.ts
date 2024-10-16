import { UserRouter } from './routes/user.routes';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT!;
const ulrOrigin = process.env.ORIGIN_URL!;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ulrOrigin,
  credentials: true
}))

app.use(UserRouter)

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (conn, req) => {

  conn.send('Hello from server');

  conn.on('message', (message) => {
    console.log(message);
    
  });
});