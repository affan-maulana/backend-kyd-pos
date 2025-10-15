import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { SalesTypeService } from './sales-type.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { BusinessId } from '@common/decorators/BusinessId';
import { GetSalesTypeDto, SalesTypeDto } from './dto/request-sales-type.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';

@ApiTags('Sales Type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sales-type')
export class SalesTypeController {
  constructor(private readonly salesTypeService: SalesTypeService) {}

  @Post()
  @ApiDefaultResponses()
  async create(
    @Body() salesTypeDto: SalesTypeDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.salesTypeService.create(salesTypeDto, businessId);
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(
    @Query() getDto: GetSalesTypeDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.salesTypeService.findAll(getDto, businessId);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch Sales Type',
    );
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown Sales Type')
  async getDropdown() {
    const result = await this.salesTypeService.getDropdown();
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.salesTypeService.findOne(id);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() salesTypeDto: SalesTypeDto,
  ) {
    const result = await this.salesTypeService.update(id, salesTypeDto);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.salesTypeService.remove(id);
    return new ResponseDefaultDto(result);
  }
}
