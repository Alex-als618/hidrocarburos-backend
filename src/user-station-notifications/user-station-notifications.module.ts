import { Module } from '@nestjs/common';
import { UserStationNotificationsService } from './user-station-notifications.service';
import { UserStationNotificationsController } from './user-station-notifications.controller';

@Module({
  controllers: [UserStationNotificationsController],
  providers: [UserStationNotificationsService],
})
export class UserStationNotificationsModule {}
