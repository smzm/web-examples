import { NextApiRequest } from 'next';
import { NextApiResponseServerIo } from '../io';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  // req should be a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // get message from request body
  const message = req.body;

  // get conversationId from query parameter
  const conversationId = req.query?.conversationId as string | undefined;

  // if no conversationId, return 400
  if (!conversationId) {
    return res.status(400).json('No conversationId');
  }

  // get reciverId
  const receiverId = req.query?.receiverId as string | undefined;
  const senderUsername = req.query?.senderUsername as string | undefined;
  // if no receiverId, return 400
  if (!receiverId) {
    return res.status(400).json('No receiverId');
  }

  // if no message, return 400
  if (!message) {
    return res.status(400).json('No message');
  }

  // emit message to conversationId Event
  res?.socket?.server?.io?.emit(conversationId, message);

  // emit message to receiverId Event
  res?.socket?.server?.io?.emit(receiverId, { conversationId, senderUsername });

  return res.status(200).json('Message sent');
}
