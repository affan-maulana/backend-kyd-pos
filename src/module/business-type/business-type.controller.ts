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
import { BusinessTypeService } from './business-type.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import {
  BusinessTypeDto,
  GetBusinessTypeDto,
} from './dto/request-business-type.dto';

@ApiTags('Business Type')
@Controller('business-type')
export class BusinessTypeController {
  constructor(private readonly businessTypeService: BusinessTypeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiDefaultResponses('Success created business type')
  async create(@Body() businessTypeDto: BusinessTypeDto) {
    const result = await this.businessTypeService.create(businessTypeDto);
    return new ResponseDefaultDto(result);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiDefaultResponses('Success fetch business type')
  async findAll(@Query() getDto: GetBusinessTypeDto) {
    const result = await this.businessTypeService.findAll(getDto);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch business type',
    );
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown business type')
  async getDropdown() {
    const result = await this.businessTypeService.getDropdown();
    return new ResponseDefaultDto(result);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiDefaultResponses('Success get business type')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.businessTypeService.findOne(id);
    return new ResponseDefaultDto(result);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiDefaultResponses('Success update business type')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() businessTypeDto: BusinessTypeDto,
  ) {
    const result = await this.businessTypeService.update(id, businessTypeDto);
    return new ResponseDefaultDto(result);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiDefaultResponses('Success remove business type')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.businessTypeService.remove(id);
    return new ResponseDefaultDto(result);
  }
}
