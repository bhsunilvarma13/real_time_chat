import { connection } from "websocket";
import { OutgoingMessages } from "./messages/outgoingMessages";

interface User {
  name: string;
  id: string;
  connection: connection;
}

interface Room {
  users: User[];
}

export class UserManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  addUser(name: string, userId: string, roomId: string, socket: connection) {
    if (!this.rooms.get(roomId)) {
      this.rooms.set(roomId, {
        users: [],
      });
    }

    this.rooms.get(roomId)?.users.push({
      name,
      id: userId,
      connection: socket,
    });
  }

  getUser(userId: string, roomId: string): User | null {
    const user = this.rooms.get(roomId)?.users.find(({ id }) => id === userId);

    return user ?? null;
  }

  removeUser(roomId: string, userId: string) {
    const users = this.rooms.get(roomId)?.users;

    if (users) {
      users.filter(({ id }) => id !== userId);
    }
  }

  broadcast(roomId: string, userId: string, message: OutgoingMessages) {
    const user = this.getUser(userId, roomId);

    if (!user) {
      console.error("User not found!");
      return;
    }

    const room = this.rooms.get(roomId);

    if (!room) {
      console.error("Room not found!");
      return;
    }

    room.users.forEach(({ connection }) => {
      connection.sendUTF(JSON.stringify(message));
    });
  }
}
