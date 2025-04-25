/* eslint-disable */
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(WebsocketGateway.name);
  private clients = new Map<string, string>(); // socketId -> userId

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('WebSocket server initialized.');
  }

  server: Server;

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = await this.jwtService.verify(
        token.replace('Bearer ', ''),
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      );

      const userId = payload.id;
      await client.join(userId); // 💡 Cria uma "sala" com o ID do usuário

      this.clients.set(client.id, userId);
      // console.log(`✅ Usuário ${userId} conectado (socket: ${client.id})`);
    } catch (err: any) {
      console.log('❌ Token inválido', err?.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.clients.get(client.id);
    if (userId) {
      // console.log(`🔌 Usuário ${userId} desconectado`);
      this.clients.delete(client.id);
    }
  }

  getServer(): Server {
    return this.server;
  }
}
