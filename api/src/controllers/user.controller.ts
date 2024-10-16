import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

export const createdUser = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}