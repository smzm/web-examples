import { Server as NetServer } from 'http';
import { Socket, Server as TNetServer } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: TNetServer & {
      io: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
    });
    res.socket.server.io = io;
  }
  res.end();
}
