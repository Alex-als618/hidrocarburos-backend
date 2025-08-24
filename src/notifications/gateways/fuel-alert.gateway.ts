import { WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from 'src/common/websocket/base.gateway';

/**
 * Gateway especializado para enviar alertas de bajo combustible vía WebSocket.
 * Extiende BaseGateway y emite el evento 'low_fuel_alert' cuando la cantidad
 * disponible en una estación cae por debajo del umbral definido.
 * Actualmente, la alerta se envía a todos los clientes conectados.
 */
@WebSocketGateway({ cors: { origin: '*' } })
export class FuelAlertGateway extends BaseGateway {
  /**
   * Envía una alerta de bajo combustible a los clientes conectados.
   * @param stationId ID de la estación con bajo combustible
   * @param availableQuantity Cantidad disponible actual
   */
  sendLowFuelAlert(stationId: number, availableQuantity: number) {
    // Emitimos el evento 'low_fuel_alert' con los datos relevantes
    this.sendToAll(
      'low_fuel_alert',
      JSON.stringify({
        stationId,
        availableQuantity,
        message: '¡Combustible por debajo del umbral!',
      }),
    );
  }
}
