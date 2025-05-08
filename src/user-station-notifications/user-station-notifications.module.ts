import { Module } from '@nestjs/common';
import { UserStationNotificationsService } from './user-station-notifications.service';
import { UserStationNotificationsController } from './user-station-notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStationNotification } from './entities/user-station-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStationNotification])],
  controllers: [UserStationNotificationsController],
  providers: [UserStationNotificationsService],
})
export class UserStationNotificationsModule {}
