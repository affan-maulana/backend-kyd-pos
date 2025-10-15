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
import { GratuityService } from './gratuity.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { GetGratuityDto, GratuityDto } from './dto/request-gratuity.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { DropdownDto } from '@common/dto/dropdown.dto';

@ApiTags('Gratuity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gratuity')
export class GratuityController {
  constructor(private readonly gratuityService: GratuityService) {}

  @Post()
  @ApiDefaultResponses()
  async create(@Body() gratuityDto: GratuityDto) {
    const result = await this.gratuityService.create(gratuityDto);
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(@Query() getDto: GetGratuityDto) {
    const result = await this.gratuityService.findAll(getDto);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch Gratuity',
    );
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown gratuity')
  async getDropdown(
    @Query() getDto: GetGratuityDto,
  ): Promise<ResponseDefaultDto<DropdownDto[]>> {
    const result = await this.gratuityService.getDropdown(getDto);
    return new ResponseDefaultDto({
      result: result.map((result) =>
        DropdownDto.fromCustom(result, 'id', (g) => `${g.name} (${g.amount}%)`),
      ),
      message: 'Success get dropdown gratuity',
    });
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('outletId', ParseUUIDPipe) outletId: string,
  ) {
    const result = await this.gratuityService.findOne(id, outletId);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() gratuityDto: GratuityDto,
  ) {
    const result = await this.gratuityService.update(id, gratuityDto);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('outletId', ParseUUIDPipe) outletId: string,
  ) {
    const result = await this.gratuityService.remove(id, outletId);
    return new ResponseDefaultDto(result);
  }
}
