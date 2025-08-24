import { Module } from '@nestjs/common';
import { FuelAlertGateway } from './gateways/fuel-alert.gateway';

@Module({
  providers: [FuelAlertGateway],
  exports: [FuelAlertGateway],
})
export class NotificationsModule {}
