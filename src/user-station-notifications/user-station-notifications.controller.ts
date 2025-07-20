import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserStationNotificationsService } from './user-station-notifications.service';
import { CreateUserStationNotificationDto } from './dto/create-user-station-notification.dto';
import { AuthGuard } from './auth.guard';

// Extiende Request para incluir user con id
interface RequestWithUser extends Request {
  user: {
    id: number;
    // otros campos si los tienes
  };
}

@Controller('user-station-notifications')
@UseGuards(AuthGuard)
export class UserStationNotificationsController {
  constructor(
    private readonly userStationNotificationsService: UserStationNotificationsService,
  ) {}

  @Post()
  async upsertNotification(
    @Req() req: RequestWithUser,
    @Body() dto: CreateUserStationNotificationDto,
  ) {
    try {
      const idUser = req.user.id;
      const payload = { ...dto, idUser };
      const result = await this.userStationNotificationsService.upsert(payload);
      return {
        message: 'Preferencia guardada correctamente',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        'Error guardando preferencia',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findUserPreferences(@Req() req: RequestWithUser) {
    try {
      const idUser = req.user.id;
      const prefs = await this.userStationNotificationsService.findByUser(idUser);
      return {
        message: 'Preferencias obtenidas correctamente',
        data: prefs,
      };
    } catch (error) {
      throw new HttpException(
        'Error obteniendo preferencias',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
