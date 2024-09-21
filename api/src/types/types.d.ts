import WebSocket from "ws";

export interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  email?: string;
  isAlive?: boolean;
  timer?: NodeJS.Timeout;
  deathTimer?: NodeJS.Timeout;
}

export interface MessageDataInt {
  recipient: string;
  text: string;
}

export interface UserDataInt {
  userId: string;
  email: string;
  iat: number;
}