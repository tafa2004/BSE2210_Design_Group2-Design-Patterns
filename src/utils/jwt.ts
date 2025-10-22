import jwt from 'jsonwebtoken';

const SECRET: jwt.Secret = 'PulseHubSuperSecretKey2025';

export const signToken = (payload: object, expiresIn = '1h') =>
  jwt.sign(payload, SECRET, { expiresIn });

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET);
