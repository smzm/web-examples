import { Profile, User } from '@prisma/client';
import NextAuth from 'next-auth';

type TUser = Omit<User, 'password'>;
type TSession = TUser & {
  profile: Profile | null;
  hasPassword: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: TSession;
  }
}
