import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { GetStaffDto, StaffDto } from './dto/request-staff.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { BusinessId } from '@common/decorators/BusinessId';

@ApiTags('Staffs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiDefaultResponses()
  async create(@Body() StaffDto: StaffDto, @BusinessId() businessId: string) {
    console.debug('Business ID:', businessId);

    const result = await this.staffService.create(StaffDto, businessId);
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(
    @Query() getDto: GetStaffDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.staffService.findAll(getDto, businessId);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch Staff',
    );
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown staff')
  async getDropdown(@Query() getDto: GetStaffDto) {
    const result = await this.staffService.getDropdown(getDto);
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('outletId', ParseUUIDPipe) outletId: string,
  ) {
    const result = await this.staffService.findOne(id, outletId);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() staffDto: StaffDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.staffService.update(id, staffDto, businessId);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.staffService.remove(id);
    return new ResponseDefaultDto(result);
  }

  @Patch('assign/:id')
  @ApiDefaultResponses()
  async assignToOutlet(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('outletId', ParseUUIDPipe) outletId: string,
    @BusinessId() businessId: string,
  ) {
    const result = await this.staffService.assignToOutlet(
      id,
      outletId,
      businessId,
    );
    return new ResponseDefaultDto(result);
  }
}
