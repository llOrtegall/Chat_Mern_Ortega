import { z } from 'zod';

const envSchema = z.object({
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET es requerida'),
  MONGO_URL: z.string().min(1, 'MONGO_URL es requerida'),
  SALT: z.string().min(1, 'SALT es requerida'),
  PORT: z.string().min(1, 'PORT es requerida')
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error('Error en la configuración de las variables de entorno: ', error.format());
  process.exit(1);
}

export const {
  CORS_ORIGIN,
  JWT_SECRET,
  MONGO_URL,
  SALT,
  PORT
} = data;