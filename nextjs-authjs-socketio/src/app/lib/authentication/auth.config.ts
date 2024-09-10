// For using in middleware which not support Database Adapter
import deleteJwtToken from '@/app/actions/authentication/login/deleteJwtToken';
import setJwtToken from '@/app/actions/authentication/login/setJwtToken';
import verifyJwtToken from '@/app/actions/authentication/login/verifyJwtToken';
import {
  getUserById,
  getUserByIdentifier,
  getUserByPhoneNumber,
} from '@/app/lib/data/user';
import {
  phoneNumberSchema,
  signInByCredentialsSchema,
  twoFactorSchema,
} from '@/app/types/account';
import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import {
  deleteTokenForPhoneNumber,
  verifyTokenForPhoneNumber,
} from '../data/token';
import { verifyJwt } from '../jwt/token';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      async authorize(credentials) {
        let userWithoutPassword;
        const { identifier, password, phoneNumber, token, jwt } = credentials;

        // 🔑 if user try to login with identifier(username/email) and password
        if (identifier && password) {
          const validateFields = signInByCredentialsSchema.safeParse({
            identifier,
            password,
          });
          if (validateFields.success) {
            const { identifier, password } = validateFields.data;

            const user = await getUserByIdentifier({ identifier });

            // if user not exist or password does not exist (for OAuth user which should always use OAuth to login, not credentials)
            if (!user) return null;

            // if user exist but password in database is null (OAuth user)
            if (!user.password)
              throw new Error(
                'account is not accessible using password, try another way to sign in',
                {
                  cause: { details: 'no-password' },
                },
              );

            // if user exist and password exist, compare password
            if (user && (await compare(password, user.password))) {
              // CHECK1: if password match, but user email is not verified
              if (user.email && !user.emailVerified)
                throw new Error('Email not verified', {
                  cause: {
                    details: 'email-not-verified',
                  },
                });

              // CHECK2: if username or name not exist
              if (!user.username || !user.name) {
                const jwtResult = await setJwtToken({ id: user.id });
                if (jwtResult.success) {
                  throw new Error('Username or name is null', {
                    cause: {
                      details: 'username-or-name-is-null',
                    },
                  });
                } else {
                  console.log(jwtResult.error);
                  throw new Error('Something went wrong', {
                    cause: {
                      details: 'something-went-wrong',
                    },
                  });
                }
              }

              // CHECK3: two factor authentication
              if (
                (user.otpByAuthenticator && user.otpByAuthenticatorVerified) ||
                (user.otpByPhone && user.otpByPhoneVerified)
              ) {
                const jwtResult = await setJwtToken({ id: user.id });
                if (jwtResult.success) {
                  throw new Error('Two factor authentication is enabled', {
                    cause: {
                      details: 'two-factor-authentication',
                    },
                  });
                } else {
                  throw new Error('Something went wrong', {
                    cause: {
                      details: 'something-went-wrong',
                    },
                  });
                }
              }

              try {
                verifyJwtToken({ id: user.id });
              } catch (err) {
                throw new Error('JWT token problem', {
                  cause: {
                    details: 'jwt-token-error',
                  },
                });
              }

              // if all checks passed, return user
              const { password, ...userWithoutPassword } = user;
              return userWithoutPassword;
            }
          }
          // 📞 if user try to login with phone number
        } else if (phoneNumber && token) {
          const phoneNumberValidateFields = phoneNumberSchema.safeParse({
            phoneNumber,
          });
          const tokenValidateFields = twoFactorSchema.safeParse({
            token,
          });
          if (
            phoneNumberValidateFields.success &&
            tokenValidateFields.success
          ) {
            const { phoneNumber } = phoneNumberValidateFields.data;
            const { token } = tokenValidateFields.data;

            const user = await getUserByPhoneNumber({ phoneNumber });
            if (!user) {
              return null;
            }

            // get token from db
            const tokenVerification = await verifyTokenForPhoneNumber(
              token,
              phoneNumber,
            );
            if (!tokenVerification)
              throw new Error('Invalid token', {
                cause: {
                  details: 'invalid-token',
                },
              });

            // delete token from db
            const isDeleted = deleteTokenForPhoneNumber(phoneNumber);
            if (!isDeleted) return null;

            // CHECK1: if username or name not exist
            if (!user.username || !user.name) {
              const jwtResult = await setJwtToken({ id: user.id });
              if (jwtResult.success) {
                throw new Error('Username or name is null', {
                  cause: {
                    details: 'username-or-name-is-null',
                  },
                });
              } else {
                throw new Error('Something went wrong', {
                  cause: {
                    details: 'something-went-wrong',
                  },
                });
              }
            }

            // CHECK2: two factor authentication
            if (user.otpByAuthenticator && user.otpByAuthenticatorVerified) {
              const jwtResult = await setJwtToken({ id: user.id });
              if (jwtResult.success) {
                throw new Error('Two factor authentication is enabled', {
                  cause: {
                    details: 'two-factor-authentication',
                  },
                });
              } else {
                throw new Error('Something went wrong', {
                  cause: {
                    details: 'something-went-wrong',
                  },
                });
              }
            }

            try {
              verifyJwtToken({ id: user.id });
            } catch (err) {
              throw new Error('JWT token problem', {
                cause: {
                  details: 'jwt-token-error',
                },
              });
            }

            // return user if token match
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
          // 📱 if user try to login with jwt
        } else if (jwt) {
          const payload = verifyJwt(jwt as string);
          const id = payload?.id;

          // For both OAuth and Credentials
          const userExist = await getUserById({ id });
          if (!userExist) {
            return null;
          }
          // if user not logged in with credentials or oauth before try to login with jwt

          try {
            verifyJwtToken({ id: userExist.id });
          } catch (err) {
            throw new Error('JWT token problem', {
              cause: {
                details: 'jwt-token-error',
              },
            });
          }

          if (userExist) {
            await deleteJwtToken({ id: userExist.id });
            const { password, ...userWithoutPassword } = userExist;
            return userWithoutPassword;
          }
        }
        // if validation failed or password does not match
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
