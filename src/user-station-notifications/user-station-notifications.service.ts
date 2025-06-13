import { Injectable } from '@nestjs/common';
import { CreateUserStationNotificationDto } from './dto/create-user-station-notification.dto';
import { UpdateUserStationNotificationDto } from './dto/update-user-station-notification.dto';

@Injectable()
export class UserStationNotificationsService {
  create(createUserStationNotificationDto: CreateUserStationNotificationDto) {
    return 'This action adds a new userStationNotification';
  }

  findAll() {
    return `This action returns all userStationNotifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userStationNotification`;
  }

  update(
    id: number,
    updateUserStationNotificationDto: UpdateUserStationNotificationDto,
  ) {
    return `This action updates a #${id} userStationNotification`;
  }

  remove(id: number) {
    return `This action removes a #${id} userStationNotification`;
  }
}
