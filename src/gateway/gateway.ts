import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001'],
  },
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    console.log(body);
    this.server.emit('onMessage', {
      socketid: client.id,
      msg: 'New Message',
      content: body,
    });
  }
}
