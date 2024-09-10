import setJwtToken from '@/app/actions/authentication/login/setJwtToken';
import authConfig from '@/app/lib/authentication/auth.config';
import { getUserByEmail, getUserById } from '@/app/lib/data/user';
import prisma from '@/app/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Profile } from '@prisma/client';
import NextAuth from 'next-auth';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/account/login',
    error: '/account/error',
  },
  events: {
    async signIn({ user }) {
      const existingUser = await getUserById({ id: user.id });
      if (!existingUser?.email) return;
      if (!existingUser?.cleanEmail) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            cleanEmail:
              existingUser.email.split('@')[0].replace(/\.|\+/g, '') +
              '@' +
              existingUser.email.split('@')[1],
          },
        });
      }
    },
    async linkAccount({ user, account }) {
      const [userRes, accountRes] = await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
          },
        }),
        prisma.account.updateMany({
          where: {
            providerAccountId: account.providerAccountId,
            provider: account.provider,
          },
          data: {
            email: user.email,
          },
        }),
      ]);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // if user logged in with OAuth
      if (account?.provider !== 'credentials') {
        const existingUser = await getUserByEmail({ email: user.email! });
        // Check for two factor authentication
        if (
          (existingUser?.otpByAuthenticator &&
            existingUser?.otpByAuthenticatorVerified) ||
          (existingUser?.otpByPhone && existingUser?.otpByPhoneVerified)
        ) {
          await setJwtToken({ id: existingUser.id });
          return false;
        }

        // if user not exist means user is new and it should register in db
        if (!existingUser) {
          if (!account?.access_token) return false;
          const u = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              emailVerified: new Date(),
              name: user.name,
              image: user.image,
            },
          });
          // to signin after register username, set id to cookie with credentials provider
          await setJwtToken({ id: u.id });
          return false;
        }
        // if user exist but name or username is null
        if (!existingUser?.name || !existingUser?.username) {
          const res = await setJwtToken({ id: existingUser.id });
          if (!res.success) {
            console.log('error:', res.error);
          }
          return false;
        }
      }
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token; // if user is not logged in return empty token
      const existingUser = await getUserById({ id: token.sub });
      if (!existingUser) return token;
      !existingUser?.password
        ? (token.hasPassword = false)
        : (token.hasPassword = true);
      token.emailVerified = existingUser.emailVerified;
      token.username = existingUser.username;
      token.phoneNumber = existingUser.phoneNumber;
      token.image = existingUser.image;
      token.otpByAuthenticator = existingUser.otpByAuthenticator;
      token.otpByAuthenticatorVerified =
        existingUser.otpByAuthenticatorVerified;
      token.otpByPhone = existingUser.otpByPhone;
      token.otpByPhoneVerified = existingUser.otpByPhoneVerified;
      token.profile = existingUser.Profile || null;
      return token; // always return token
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        // add id to session.user (id in token named sub)
        session.user.hasPassword = token.hasPassword as boolean;
        session.user.id = token.sub;
        session.user.username = token.username as string;
        session.user.emailVerified = token.emailVerified as Date;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.otpByPhone = token.otpByPhone as boolean;
        session.user.otpByPhoneVerified = token.otpByPhoneVerified as Date;
        session.user.otpByAuthenticator = token.otpByAuthenticator as boolean;
        session.user.otpByAuthenticatorVerified =
          token.otpByAuthenticatorVerified as boolean;
        session.user.profile = (token.profile as Profile) || null;
        session.user.image = token.image as string;
      }
      return session; // always return session
    },
  },
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 90, // 90 days
  },
  ...authConfig,
});
