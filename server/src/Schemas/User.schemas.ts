import z from 'zod';

const UserSchema = z.object({
  username: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6),
});

export type User = z.infer<typeof UserSchema>;

export const validateUser = (user: unknown): User => {
  return UserSchema.parse(user);
}
