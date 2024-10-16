import { z } from 'zod';

const registerSchema = z.object({
  names: z.string({ message: 'names is required' }).min(3, { message: 'names must be at least 3 characters' }),
  lastNames: z.string({ message: 'lastNames is required' }).min(3, { message: 'lastNames must be at least 3 characters' }),
  email: z.string({ message: 'email is required' }).email({ message: 'email is invalid' }),
  password: z.string({ message: 'password is required' }).min(6, { message: 'password must be at least 6 characters' }),
  confirmPassword: z.string({ message: 'confirmPassword is required' }).min(6, { message: 'confirmPassword must be at least 6 characters' }),
});

const loginSchema = z.object({
  email: z.string({ message: 'email is required' }).email({ message: 'email is invalid' }),
  password: z.string({ message: 'password is required' }).min(6, { message: 'password must be at least 6 characters' }),
})

export const validateRegister = (data: unknown) => {
  return registerSchema.safeParseAsync(data);
}


export const validateLogin = (data: unknown) => {
  return loginSchema.safeParseAsync(data);
}