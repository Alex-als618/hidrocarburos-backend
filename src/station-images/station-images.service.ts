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

import { ConfigService } from '@nestjs/config';
import {
  v2 as CloudinaryV2,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { uploadToCloudinary } from 'src/common/utils/uploadToCloudinary';

import * as sharp from 'sharp';

@Injectable()
export class StationImagesService {
  private cloudinary: typeof CloudinaryV2;

  constructor(
    @InjectRepository(StationImage)
    private readonly stationImageRepository: Repository<StationImage>,
    @InjectRepository(FuelStation)
    private readonly fuelStationRepository: Repository<FuelStation>,
    private configService: ConfigService,
  ) {
    this.cloudinary = this.configureCloudinary();
  }

  private readonly uploadDir = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    'images',
    'station-images',
  );
  private readonly extensionImages = ['.png', '.jpg', '.jpeg'];

  // async create(
  //   createStationImageDto: CreateStationImageDto,
  //   imageFile: Express.Multer.File,
  // ) {
  //   console.log('entra create');
  //   const { description, fuelStationId } = createStationImageDto;

  //   const fuelStation = await this.findFuelStationOrThrow(fuelStationId);

  //   const filename = this.saveImage(imageFile);

  //   const stationImage = this.stationImageRepository.create({
  //     description,
  //     fuelStation,
  //     imageUrl: filename,
  //   });

  //   return this.stationImageRepository.save(stationImage);
  // }

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

  // async update(
  //   id: number,
  //   updateStationImageDto: UpdateStationImageDto,
  //   imageFile?: Express.Multer.File,
  // ) {
  //   const { description, fuelStationId } = updateStationImageDto;
  //   const stationImage = await this.stationImageRepository.preload({
  //     idStationImage: id,
  //     description,
  //   });

  //   if (!stationImage) {
  //     throw new NotFoundException(`StationImage with id ${id} not found`);
  //   }

  //   if (fuelStationId) {
  //     stationImage.fuelStation =
  //       await this.findFuelStationOrThrow(fuelStationId);
  //   }

  //   if (imageFile) {
  //     const savedFilename = this.saveImage(imageFile);
  //     this.deleteImage(stationImage.imageUrl);
  //     stationImage.imageUrl = savedFilename;
  //   }

  //   return this.stationImageRepository.save(stationImage);
  // }

  // async remove(id: number) {
  //   const stationImage = await this.stationImageRepository.findOneBy({
  //     idStationImage: id,
  //   });
  //   if (!stationImage) {
  //     throw new NotFoundException(`StationImage with id ${id} not found`);
  //   }

  //   this.deleteImage(stationImage.imageUrl);
  //   await this.stationImageRepository.remove(stationImage);
  //   return stationImage;
  // }

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

  private configureCloudinary(): typeof CloudinaryV2 {
    CloudinaryV2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
    return CloudinaryV2;
  }

  async uploadToCloudinary(
    fileBuffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      // ✅ Ahora TypeScript sabe que cloudinary.uploader es correcto
      this.cloudinary.uploader
        .upload_stream(
          { folder },
          (
            error: UploadApiErrorResponse | undefined,
            result?: UploadApiResponse,
          ) => {
            if (error)
              return reject(
                new Error(error.message || 'Cloudinary upload failed'),
              );
            if (!result) return reject(new Error('No upload result received'));
            resolve(result);
          },
        )
        .end(fileBuffer);
    });
  }

  async create(
    createStationImageDto: CreateStationImageDto,
    imageFile: Express.Multer.File,
  ) {
    const { description, fuelStationId } = createStationImageDto;
    const fuelStation = await this.findFuelStationOrThrow(fuelStationId);

    // 1️⃣ Procesar la imagen con Sharp antes de subir
    const optimizedImageBuffer = await sharp(imageFile.buffer)
      .resize({ width: 800 }) // redimensionar ancho máx. 800px
      .jpeg({ quality: 75 }) // comprimir JPEG
      .toBuffer();

    // 2️⃣ Subir a Cloudinary
    const uploadResult: UploadApiResponse = await uploadToCloudinary(
      // imageFile.buffer,
      optimizedImageBuffer,
      'station-images',
    );

    const stationImage = this.stationImageRepository.create({
      description,
      fuelStation,
      imageUrl: uploadResult.secure_url,
    });

    return this.stationImageRepository.save(stationImage);
  }

  async update(
    id: number,
    updateStationImageDto?: UpdateStationImageDto,
    imageFile?: Express.Multer.File,
  ) {
    const description = updateStationImageDto?.description;
    const fuelStationId = updateStationImageDto?.fuelStationId;

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
      // 1️⃣ Eliminar la imagen anterior de Cloudinary
      if (stationImage.imageUrl) {
        const publicId = stationImage.imageUrl
          .split('/')
          .slice(-2)
          .join('/')
          .split('.')[0];

        try {
          await this.cloudinary.uploader.destroy(publicId);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(
              'Error deleting old image from Cloudinary:',
              error.message,
            );
          } else {
            console.error(
              'Unknown error deleting old image from Cloudinary:',
              error,
            );
          }
        }
      }

      // 2️⃣ Optimizar la nueva imagen con Sharp
      const optimizedImageBuffer = await sharp(imageFile.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 75 })
        .toBuffer();

      // 3️⃣ Subir a Cloudinary
      const uploadResult: UploadApiResponse = await uploadToCloudinary(
        // imageFile.buffer,
        optimizedImageBuffer,
        'station-images',
      );

      stationImage.imageUrl = uploadResult.secure_url;
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

    // ✅ Opcional: borrar de Cloudinary
    const publicId = stationImage.imageUrl
      .split('/')
      .slice(-2)
      .join('/')
      .split('.')[0]; // obtener public_id

    try {
      await this.cloudinary.uploader.destroy(publicId);
    } catch (error: any) {
      if (error instanceof Error) {
        console.error('Error deleting image from Cloudinary:', error.message);
      } else {
        console.error('Unknown error deleting image from Cloudinary', error);
      }
    }

    await this.stationImageRepository.remove(stationImage);
    return stationImage;
  }
}
