// Simple Socket.IO client for React Native
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Change if backend is remote
let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      forceNew: true,
    });
  }
  return socket;
}
