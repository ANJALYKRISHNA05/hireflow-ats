import jwt from 'jsonwebtoken';

export const generateAccessToken = (
  payload: { userId: string; role: string }
) => {
  const ACCESS_SECRET = process.env.JWT_SECRET;

  if (!ACCESS_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (
  payload: { userId: string }
) => {
  const REFRESH_SECRET = process.env.REFRESH_SECRET;

  if (!REFRESH_SECRET) {
    throw new Error("REFRESH_SECRET is not defined");
  }

  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '7d',
  });
};
