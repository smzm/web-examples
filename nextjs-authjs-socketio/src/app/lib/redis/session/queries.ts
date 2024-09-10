// import { redis } from '@/app/lib/redis';
// import { session_id } from '@/app/lib/redis/keys';
// import { DateTime } from 'luxon';

// type Session = {
//   name: string | '';
//   username: string | '';
//   email: string | '';
//   emailVerified: DateTime | '';
//   phoneNumber: string | '';
//   role: 'USER' | 'ADMIN';
// };

// export const setSession = async (id: string, session: Session) => {
//   await redis.hset(session_id(id), serialize(session));
// };

// const serialize = (data: Session) => {
//   return {
//     name: data.name,
//     username: data.username,
//     email: data.email,
//     emailVerified: data.emailVerified ? data.emailVerified.toMillis() : '',
//     phoneNumber: data.phoneNumber,
//     role: data.role,
//   };
// };

// export const getSession = async (id: string) => {
//   const data = await redis.hgetall(session_id(id));
//   if (!data) return null;
//   return deserialize(data);
// };

// const deserialize = (session: { [key: string]: string }) => {
//   return {
//     name: session.name,
//     username: session.username,
//     email: session.email,
//     emailVerified: session.emailVerified
//       ? DateTime.fromMillis(parseInt(session.emailVerified))
//       : '',
//     phoneNumber: session.phoneNumber,
//     role: session.role,
//   };
// };

// export const deleteSession = async (id: string) => {
//   try {
//     await redis.del(session_id(id));
//   } catch (err) {
//     console.log('Error:', err);
//   }
// };
