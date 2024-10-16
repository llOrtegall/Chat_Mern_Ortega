import { UserRouter } from './routes/user.routes';
import WebSocket, { WebSocketServer } from 'ws';
import { Message } from './models/messages.model';
import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const port = process.env.PORT!;
const ulrOrigin = process.env.ORIGIN_URL!;
const SECRET = process.env.JWT_SECRET!;

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

interface CustomWebSocket extends WebSocket {
  id?: string;
  email?: string;
}

wss.on('connection', (conn: CustomWebSocket, req) => {

  const token = req.headers.cookie?.split('=')[1];

  if (token) {
    jwt.verify(token, SECRET, (err: any, decoded: any) => {
      if (err) throw err;
      conn.id = decoded.id;
      conn.email = decoded.email;
    });
  }

  conn.on('message', async (msg) => {
    const { message } = JSON.parse(msg.toString());
    
    if (message) {
      const { recipient, text } = message as { recipient: string, text: string };

      await Message.sync();
      const messageDoc = await Message.create({ sender: conn.id!, recipient: recipient, text: text })

      if (recipient && text) {
        

        [...wss.clients]
          .filter((c: CustomWebSocket) => c.id === recipient)
          .forEach((c: CustomWebSocket) => {
            c.send(JSON.stringify({ 
              text,
              sender: conn.id,
              recipient: recipient,
              id: messageDoc.id
             }))
          })
      }
    }

  });

  [...wss.clients].forEach((c: CustomWebSocket) => {
    c.send(JSON.stringify({
      online: [...wss.clients].map((c: CustomWebSocket) => ({ id: c.id, email: c.email }))
    }));
  })

});