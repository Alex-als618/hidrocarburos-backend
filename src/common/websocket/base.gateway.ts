import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Gateway base para manejar conexiones WebSocket.
 * Otros gateways extienden esta clase.
 */
@WebSocketGateway({
  cors: { origin: '*' },
})
export abstract class BaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

  /**
   * Se ejecuta cuando un cliente se conecta.
   */
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  /**
   * Se ejecuta cuando un cliente se desconecta.
   */
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Evento para recibir y reenviar mensajes al cliente.
   */
  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: string, client: Socket): string {
    client.emit('message_received', data);
    return 'Message sent!';
  }

  /**
   * Envía un evento a todos los clientes conectados.
   */
  sendToAll(event: string, message: string) {
    this.server.emit(event, message);
  }
}
