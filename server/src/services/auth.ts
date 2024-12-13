import { JWT_SECRET } from '@/config/enviroments';
import { TokenPayload } from '@/types/interfaces';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export async function getUserByToken(req: Request) {
  const token = req.headers.cookie?.split('=')[1];
  if (!token) return null;
  return jwt.verify(token, JWT_SECRET, {}) as TokenPayload;
}
