import { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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