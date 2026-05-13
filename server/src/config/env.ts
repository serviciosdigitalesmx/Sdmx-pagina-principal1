import dotenv from 'dotenv';
dotenv.config();

/**
 * Validación estricta de variables de entorno (Backend)
 * MANDATO: CERO HARDCODE.
 */

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`[FATAL] Variable de entorno crítica faltante: ${key}. El servidor no puede iniciar.`);
  }
  return value;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
};

