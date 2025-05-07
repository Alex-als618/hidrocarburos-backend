import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserStationNotificationsService } from './user-station-notifications.service';
import { CreateUserStationNotificationDto } from './dto/create-user-station-notification.dto';
import { UpdateUserStationNotificationDto } from './dto/update-user-station-notification.dto';

@Controller('user-station-notifications')
export class UserStationNotificationsController {
  constructor(private readonly userStationNotificationsService: UserStationNotificationsService) {}

  @Post()
  create(@Body() createUserStationNotificationDto: CreateUserStationNotificationDto) {
    return this.userStationNotificationsService.create(createUserStationNotificationDto);
  }

  @Get()
  findAll() {
    return this.userStationNotificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStationNotificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserStationNotificationDto: UpdateUserStationNotificationDto) {
    return this.userStationNotificationsService.update(+id, updateUserStationNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userStationNotificationsService.remove(+id);
  }
}
