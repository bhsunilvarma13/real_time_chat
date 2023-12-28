import { Chat, Store } from "./store/Store";

let globalChatId = 0;

export interface Room {
  roomId: string;
  chats: Chat[];
}

export type UserId = string;

export class InMemoryStore implements Store {
  private store: Map<string, Room>;

  constructor() {
    this.store = new Map<string, Room>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, {
      roomId,
      chats: [],
    });
  }

  getChats(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);

    if (!room) {
      return [];
    }

    // return room.chats
    //   .reverse()
    //   .slice(0, offset)
    //   .slice(-1 * limit);

    return room.chats.slice(offset, limit);
  }

  addChat(userId: UserId, name: string, roomId: string, message: string) {
    const room = this.store.get(roomId);

    if (!room) {
      return;
    }

    return room.chats.push({
      chatId: (globalChatId++).toString(),
      userId,
      name,
      message,
      upvotes: [],
    });
  }

  upVote(userId: UserId, roomId: string, chatId: string) {
    const room = this.store.get(roomId);

    if (!room) {
      return;
    }

    const chat = room.chats.find(({ chatId }) => chatId === chatId);

    if (chat) {
      chat.upvotes.push(userId);
    }
  }
}
