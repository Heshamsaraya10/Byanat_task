import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (payload: String): string => {
  return jwt.sign(
    { userId: payload },
    process.env.JWT_SECRET_KEY || "fallback_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );
};

export default createToken;
