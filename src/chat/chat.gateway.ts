import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/chat.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private senderId: string;

  constructor(private readonly chatService: ChatService) {}

  // Handle new connections
  async handleConnection(client: Socket) {
    const tokenHeader = client.handshake.headers.token;
    const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

    if (!token) {
      console.log('Token not provided');
      client.disconnect();
      return;
    }

    try {
      const userId = await this.chatService.validateToken(token);
      console.log(`🔵 User Connected: ${client.id}, UserID: ${userId}`);

      this.senderId = userId;
      await this.chatService.setUserOnline(userId);

      this.chatService.addUser(client.id, userId);
      this.server.emit('users', this.chatService.getActiveUsers());
      client.emit('recent-messages', this.chatService.getRecentMessages());
    } catch (error) {
      console.log('Invalid token', error);
      client.disconnect();
    }
  }

  // Handle disconnections
  async handleDisconnect(client: Socket) {
    const tokenHeader = client.handshake.headers.token;
    const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

    try {
      const userId = await this.chatService.validateToken(token);
      await this.chatService.setUserOffline(userId);
      this.chatService.removeUser(client.id);

      this.server.emit('users', this.chatService.getActiveUsers());
      console.log(`🔴 User Disconnected: ${userId}`);
    } catch (error) {
      console.log('Error during disconnect:', error);
    }
  }

  @SubscribeMessage('join_room')
  joinRoom(
    client: Socket,
    data: { receiver?: string; sender?: string; roomname?: string },
  ) {
    console.log(data.roomname);
    if (data.receiver && data.sender) {
      const roomName: string = this.chatService.getRoomName(
        data.sender,
        data.receiver,
      );

      client.join(roomName);
      console.log(`User joined room: ${roomName}`);
    } else {
      if (data.roomname.includes(this.senderId)) {
        client.join(data.roomname);
        console.log(`User joined room: ${data.roomname}`);
      }
    }
  }

  @SubscribeMessage('leave_room')
  leaveRoom(client: Socket, data: { roomname: string }) {
    console.log(`User leaving room: ${data.roomname}`);
    client.leave(data.roomname);
    console.log(`User left room: ${data.roomname}`);
  }

  // Handle sending a message to a room
  @SubscribeMessage('send_message')
  async handleMessageByRoome(client: Socket, data: CreateChatDto) {
    const roomName = this.chatService.getRoomName(data.sender, data.receiver);
    const msg = data.content;
    data.roomName = roomName;

    const newMsg = await this.chatService.addMessage(data);
    console.log(newMsg);

    this.server.to(roomName).emit('receive_message', { newMsg });
  }

  // Get contacts of the current user
  @SubscribeMessage('getContacts')
  async getContacts(client: Socket, sender: string) {
    console.log('get contact');
    console.log('Sender:', sender);
    console.log('get contact');

    try {
      const contact = await this.chatService.getContacts(sender);
      console.log('Fetched Contacts:', contact);

      if (!contact) {
        console.error(
          '❌ chatService.getContacts() returned null or undefined.',
        );
        client.emit('contactsList', []);
        return;
      }

      client.emit('contactsList', contact);
    } catch (error) {
      console.error('❌ Error fetching contacts:', error);
      client.emit('contactsList', { error: 'Failed to fetch contacts' });
    }
  }

  // Get messages for a specific room
  @SubscribeMessage('getmessage')
  async getMessages(client: Socket, data: { roomname: string; page?: number }) {
    try {
      const { roomname, page = 1 } = data;

      if (!roomname) {
        return client.emit('errorMessage', {
          message: 'Room name is required',
        });
      }

      console.log(`Fetching messages for room: ${roomname}, Page: ${page}`);
      const messages = await this.chatService.getMessages(roomname, page);

      this.server.to(roomname).emit('sendMessageRoom', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      client.emit('errorMessage', { message: 'Error fetching messages' });
    }
  }

  // Handle sending a message in a general chat
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.chatService
      .getActiveUsers()
      .find((id) => this.chatService.getActiveUsers().includes(id));

    if (!userId) {
      return;
    }

    const message = this.chatService.addMessage(data);
    this.server.emit('message', message);
  }
}
