import { JwtPayload } from 'jsonwebtoken';
import { WebSocket } from 'ws';

export interface CustomWebSocket extends WebSocket {
  userId?: string;
  username?: string;
  isAlive?: boolean;
  timer?: NodeJS.Timeout;
  deathTimer?: NodeJS.Timeout;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  username: string;
}
