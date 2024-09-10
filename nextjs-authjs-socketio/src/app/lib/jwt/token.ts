import jwt, { JwtPayload } from 'jsonwebtoken';

interface SignOption {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTIONS: SignOption = {
  expiresIn: '1d',
};

// create jwt
export function signJwt(
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTIONS,
) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, secretKey!, option);
  return token;
}

// decode jwt
export function verifyJwt(token: string) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secretKey!);
    return decoded as JwtPayload;
  } catch (err) {
    return null;
  }
}
