import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StationImage } from './entities/station-image.entity';
import { CreateStationImageDto } from './dto/create-station-image.dto';
import { UpdateStationImageDto } from './dto/update-station-image.dto';

@Injectable()
export class StationImagesService {
  constructor(
    @InjectRepository(StationImage)
    private readonly stationImageRepository: Repository<StationImage>,
  ) {}

  async create(dto: CreateStationImageDto) {
    const image = this.stationImageRepository.create(dto);
    return await this.stationImageRepository.save(image);
  }

  async findAll() {
    return await this.stationImageRepository.find({
      relations: ['fuelStation'],
    });
  }

  async findOne(id: number) {
    const image = await this.stationImageRepository.findOne({
      where: { idStationImage: id },
      relations: ['fuelStation'],
    });

    if (!image) {
      throw new NotFoundException(`StationImage #${id} not found`);
    }

    return image;
  }

  async update(id: number, dto: UpdateStationImageDto) {
    const image = await this.findOne(id);
    const updated = Object.assign(image, dto);
    return await this.stationImageRepository.save(updated);
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    await this.stationImageRepository.remove(image);
    return { message: 'Eliminado correctamente' };
  }

  // Paginación
  async findAllPaginated(page: number, limit: number) {
    const [data, total] = await this.stationImageRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['fuelStation'],
    });

    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }
}
