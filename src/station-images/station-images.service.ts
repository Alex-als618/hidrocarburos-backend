import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStationImageDto } from './dto/create-station-image.dto';
import { UpdateStationImageDto } from './dto/update-station-image.dto';
import { StationImage } from './entities/station-image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelStation } from 'src/fuel-stations/entities/fuel-station.entity';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StationImagesService {
  constructor(
    @InjectRepository(StationImage)
    private readonly stationImageRepository: Repository<StationImage>,
    @InjectRepository(FuelStation)
    private readonly fuelStationRepository: Repository<FuelStation>,
  ) {}

  private readonly uploadDir = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    'images',
    'station-images',
  );
  private readonly extensionImages = ['.png', '.jpg', '.jpeg'];

  async create(
    createStationImageDto: CreateStationImageDto,
    imageFile: Express.Multer.File,
  ) {
    console.log('entra create');
    const { description, fuelStationId } = createStationImageDto;

    const fuelStation = await this.findFuelStationOrThrow(fuelStationId);

    const filename = this.saveImage(imageFile);

    const stationImage = this.stationImageRepository.create({
      description,
      fuelStation,
      imageUrl: filename,
    });

    return this.stationImageRepository.save(stationImage);
  }

  findAll() {
    return this.stationImageRepository.find({
      order: {
        idStationImage: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const stationImage = await this.stationImageRepository.findOneBy({
      idStationImage: id,
    });
    if (!stationImage) {
      throw new NotFoundException(`StationImage with id ${id} not found`);
    }
    return stationImage;
  }

  async update(
    id: number,
    updateStationImageDto: UpdateStationImageDto,
    imageFile?: Express.Multer.File,
  ) {
    const { description, fuelStationId } = updateStationImageDto;
    const stationImage = await this.stationImageRepository.preload({
      idStationImage: id,
      description,
    });

    if (!stationImage) {
      throw new NotFoundException(`StationImage with id ${id} not found`);
    }

    if (fuelStationId) {
      stationImage.fuelStation =
        await this.findFuelStationOrThrow(fuelStationId);
    }

    if (imageFile) {
      const savedFilename = this.saveImage(imageFile);
      this.deleteImage(stationImage.imageUrl);
      stationImage.imageUrl = savedFilename;
    }

    return this.stationImageRepository.save(stationImage);
  }

  async remove(id: number) {
    const stationImage = await this.stationImageRepository.findOneBy({
      idStationImage: id,
    });
    if (!stationImage) {
      throw new NotFoundException(`StationImage with id ${id} not found`);
    }

    this.deleteImage(stationImage.imageUrl);
    await this.stationImageRepository.remove(stationImage);
    return stationImage;
  }

  private async findFuelStationOrThrow(
    fuelStationId: number,
  ): Promise<FuelStation> {
    const fuelStation = await this.fuelStationRepository.findOneBy({
      idFuelStation: fuelStationId,
    });

    if (!fuelStation) {
      throw new NotFoundException(
        `Fuel station with ID ${fuelStationId} not found`,
      );
    }

    return fuelStation;
  }

  private saveImage(imageFile: Express.Multer.File): string {
    console.log(
      `entra saveImage`,
      imageFile?.originalname,
      imageFile
        ? JSON.stringify({ size: imageFile.size, mimetype: imageFile.mimetype })
        : '',
    );
    if (!imageFile) {
      throw new BadRequestException('No file uploaded');
    }
    const extension = path.extname(imageFile.originalname);
    if (!this.extensionImages.includes(extension)) {
      throw new BadRequestException('Invalid file extension');
    }

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    const filename = `image-${Date.now()}${extension}`;
    const filepath = path.join(this.uploadDir, filename);
    console.log(`saveImage=${filepath}`);

    fs.writeFileSync(filepath, imageFile.buffer);

    return filename;
  }

  private deleteImage(imageUrl: string): void {
    const imagePath = path.join(this.uploadDir, imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
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
