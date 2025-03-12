import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { CreateChatDto } from './dto/chat.dto';
import { Chat } from './schema/chat.schema';
@Injectable()
export class ChatService {
  private activeUsers: Map<string, string> = new Map();

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private readonly userService: AuthService,
  ) {}

  validateToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err, decoded: any) => {
          if (err) {
            reject('Invalid Token');
          } else {
            resolve(decoded.id);
          }
        },
      );
    });
  }
  async setUserOnline(id: string) {
    const user = await this.userService.getUser(id);

    if (!user) {
      console.log('User not found');
      return;
    }

    await this.userService.updateUser(id, { isOnline: true });

    console.log(`✅ User ${user.username} is now online.`);
  }

  async setUserOffline(id: string) {
    const user = await this.userService.getUser(id);

    if (!user) {
      console.log('User not found');
      return;
    }

    await this.userService.updateUser(id, { isOnline: false });

    console.log(`❌ User ${user.username} is now offline.`);
  }

  addUser(socketId: string, userId: string): void {
    this.activeUsers.set(socketId, userId);
  }

  removeUser(socketId: string): string {
    const userId = this.activeUsers.get(socketId);
    this.activeUsers.delete(socketId);
    return userId;
  }

  getActiveUsers(): string[] {
    return Array.from(this.activeUsers.values());
  }

  async getRecentMessages(): Promise<Chat[]> {
    return await this.chatModel.find().sort({ createdAt: -1 }).limit(10);
  }

  async addMessage(data: CreateChatDto): Promise<Chat> {
    try {
      console.log('Received Data:', data);

      const message = {
        sender: data.sender,
        receiver: data.receiver,
        type: data.type,
        content: data.content,
        roomName: data.roomName,
      };

      const savedMessage = await this.chatModel.create(message);
      console.log('Saved Message:', savedMessage);

      const populatedMessage = await this.chatModel
        .findById(savedMessage._id)
        .populate('sender', 'username')
        .populate('receiver', 'username');

      return populatedMessage;
    } catch (error) {
      console.error('Error in addMessage:', error);
      throw new Error('Message saving failed.');
    }
  }

  getUserIdBySocketId(socketId: string): string | null {
    return this.activeUsers.get(socketId) || null;
  }

  getRoomName(sender: string, receiver: string): string {
    return [sender, receiver].sort().join('');
  }

  async getContacts(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);

    const chats: any = await this.chatModel
      .find({ $or: [{ sender: objectId }, { receiver: objectId }] })
      .populate({
        path: 'sender',
        select: 'username isOnline profileId',
        populate: {
          path: 'profileId',
          select: 'imageProfile',
        },
      })
      .populate({
        path: 'receiver',
        select: 'username isOnline profileId',
        populate: {
          path: 'profileId',
          select: 'imageProfile',
        },
      })
      .sort({ createdAt: -1 });

    console.log('Populated chats:', JSON.stringify(chats, null, 2));

    const uniqueContacts = new Map();

    chats.forEach((chat) => {
      let otherParticipant = null;

      if (
        chat.sender &&
        chat.sender._id &&
        chat.sender._id.toString() === objectId.toString()
      ) {
        otherParticipant = chat.receiver;
      } else if (
        chat.receiver &&
        chat.receiver._id &&
        chat.receiver._id.toString() === objectId.toString()
      ) {
        otherParticipant = chat.sender;
      }

      if (!otherParticipant || !otherParticipant._id) {
        console.log('Skipping chat due to invalid participant:', chat._id);
        return;
      }

      const participantId = otherParticipant._id.toString();

      if (!uniqueContacts.has(participantId)) {
        uniqueContacts.set(participantId, {
          roomName: chat.roomName || `${objectId}-${participantId}`,
          username: otherParticipant.username,
          isOnline: otherParticipant.isOnline,
          _id: participantId,
          imageProfile:
            otherParticipant.profileId?.imageProfile?.url ||
            'https://res.cloudinary.com/dsldmzxqt/image/upload/v1737556717/profile_tfo9f4.png',
          lastMessage: {
            content: chat.content,
            time: chat.createdAt,
          },
        });
      } else {
        const existingContact = uniqueContacts.get(participantId);
        if (chat.createdAt > existingContact.lastMessage.time) {
          existingContact.lastMessage = {
            content: chat.content,
            time: chat.createdAt,
          };
          uniqueContacts.set(participantId, existingContact);
        }
      }
    });

    return Array.from(uniqueContacts.values());
  }

  async getMessages(roomName: string, page: number = 1) {
    const limit = 50;
    const skip = (page - 1) * limit;

    const chats: any = await this.chatModel
      .find({ roomName: roomName })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .skip(skip)
      .limit(limit);

    return chats;
  }
}

/*

 async getContacts(userId: string) {
    const chats:any = await this.chatModel
      .find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .sort({ createdAt: -1 });

    const uniqueContacts = new Set();
    const myContacts = [];

    chats.forEach((chat) => {
      if (
        chat.sender._id != userId &&
        !uniqueContacts.has(chat.sender._id.toString())
      ) {
        uniqueContacts.add(chat.sender._id.toString());
        myContacts.push({
          roomName: chat.roomName,
          username: chat.sender.username,
          _id: chat.sender._id,
          lastMessage: {
            content: chat.content,
            time: chat.createdAt,
          },
        });
      }

      if (
        chat.receiver._id != userId &&
        !uniqueContacts.has(chat.receiver._id.toString())
      ) {
        uniqueContacts.add(chat.receiver._id.toString());
        myContacts.push({
          roomName: chat.roomName,
          username: chat.receiver.username,
          _id: chat.receiver._id,
          lastMessage: {
            content: chat.content,
            time: chat.createdAt,
          },
        });
      }
    });

    return myContacts;
  }
*/
