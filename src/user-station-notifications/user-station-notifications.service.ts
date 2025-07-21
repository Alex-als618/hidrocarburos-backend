import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStationNotification } from './entities/user-station-notification.entity';
import { CreateUserStationNotificationDto } from './dto/create-user-station-notification.dto';
import { UpdateUserStationNotificationDto } from './dto/update-user-station-notification.dto';

@Injectable()
export class UserStationNotificationsService {
  constructor(
    @InjectRepository(UserStationNotification)
    private readonly userStationNotificationRepository: Repository<UserStationNotification>,
  ) {}

  async create(dto: CreateUserStationNotificationDto) {
    const notification = this.userStationNotificationRepository.create(dto);
    return await this.userStationNotificationRepository.save(notification);
  }

  async findAll() {
    return await this.userStationNotificationRepository.find({
      relations: ['user', 'fuelStation'],
    });
  }

  async findOne(id: number) {
    return await this.userStationNotificationRepository.findOne({
      where: { idUserStationNotification: id },
      relations: ['user', 'fuelStation'],
    });
  }

  async update(id: number, dto: UpdateUserStationNotificationDto) {
    await this.userStationNotificationRepository.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.userStationNotificationRepository.delete(id);
  }
}
