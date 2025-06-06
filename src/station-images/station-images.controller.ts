import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
  // BadRequestException,
} from '@nestjs/common';
import { StationImagesService } from './station-images.service';
import { CreateStationImageDto } from './dto/create-station-image.dto';
import { UpdateStationImageDto } from './dto/update-station-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import * as multer from 'multer';
import { extname } from 'path';

@Controller('station-images')
export class StationImagesController {
  constructor(private readonly stationImagesService: StationImagesService) {}

  // @Post()
  // create(@Body() createStationImageDto: CreateStationImageDto) {
  //   return this.stationImagesService.create(createStationImageDto);
  // }

  // {
  //     storage: multer.memoryStorage(), // ✅ Ahora sí funciona
  //     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  //     fileFilter: (req, file, cb) => {
  //       if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //         return cb(new Error('Only image files are allowed!'), false);
  //       }
  //       cb(null, true);
  //     },
  //   }

  @Post()
  @UseInterceptors(FileInterceptor('imageUrl'))
  create(
    @Body() createStationImageDto: CreateStationImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('No file4 uploaded');
    }
    return this.stationImagesService.create(createStationImageDto, image);
  }

  @Get()
  findAll() {
    return this.stationImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stationImagesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageUrl'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationImageDto: UpdateStationImageDto,
    @UploadedFile() imageUrl: Express.Multer.File,
  ) {
    return this.stationImagesService.update(
      id,
      updateStationImageDto,
      imageUrl,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stationImagesService.remove(id);
  }
}
