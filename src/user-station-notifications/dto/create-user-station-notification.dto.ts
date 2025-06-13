import { IsBoolean, IsInt, Min } from 'class-validator';

export class CreateUserStationNotificationDto {
  @IsBoolean()
  subscribed: boolean;

  @IsInt()
  @Min(1)
  idUser: number;

  @IsInt()
  @Min(1)
  idFuelStation: number;
}
