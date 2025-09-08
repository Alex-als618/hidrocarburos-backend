import { Injectable, NotFoundException } from '@nestjs/common';
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
    const notification = await this.userStationNotificationRepository.findOne({
      where: { idUserStationNotification: id },
      relations: ['user', 'fuelStation'],
    });

    if (!notification) {
      throw new NotFoundException(`UserStationNotification #${id} not found`);
    }

    return notification;
  }

  async update(id: number, dto: UpdateUserStationNotificationDto) {
    await this.userStationNotificationRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const notification = await this.findOne(id);
    await this.userStationNotificationRepository.remove(notification);
    return { message: 'Eliminado correctamente' };
  }

  // Paginación
  async findAllPaginated(page: number, limit: number) {
    const [data, total] =
      await this.userStationNotificationRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['user', 'fuelStation'],
      });

    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }
}
