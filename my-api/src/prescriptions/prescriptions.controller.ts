import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @ApiOperation({ summary: 'Create new optical prescription record' })
  @Post()
  create(@Body() dto: CreatePrescriptionDto, @CurrentUser() user: ActiveUserData) {
    return this.prescriptionsService.create(dto, user);
  }

  @ApiOperation({ summary: 'Get current customer prescriptions list' })
  @Get()
  findAll(@CurrentUser() user: ActiveUserData) {
    return this.prescriptionsService.findAll(user);
  }

  @ApiOperation({ summary: 'Get prescription details by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update prescription' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete prescription' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionsService.remove(id);
  }
}
