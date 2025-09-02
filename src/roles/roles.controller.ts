import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles devuelta exitosamente',
    type: Role,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findAll() {
    return this.rolesService.findAll();
  }

  // @UseGuards(AuthGuard, RolesGuard) // probando autorizacion
  // @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @Auth(RoleEnum.ADMIN, RoleEnum.MANAGER) //decorador de composición para autorización
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por su ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID único del rol',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado y devuelto exitosamente',
    type: Role,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol por su ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID único del rol',
    example: 1,
  })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol por su ID (borrado físico)' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID único del rol',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
