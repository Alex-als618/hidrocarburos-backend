import { PartialType } from '@nestjs/mapped-types';
import { CreateUserStationNotificationDto } from './create-user-station-notification.dto';

export class UpdateUserStationNotificationDto extends PartialType(
  CreateUserStationNotificationDto,
) {}
