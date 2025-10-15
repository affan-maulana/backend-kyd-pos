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
import { TaxService } from './tax.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { TaxDto, GetTaxDto, UpdateTaxDto } from './dto/request-tax.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';

@ApiTags('Tax')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @ApiDefaultResponses()
  async create(@Body() taxDto: TaxDto) {
    const result = await this.taxService.create(taxDto, taxDto.outletId);
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(@Query() getDto: GetTaxDto) {
    const result = await this.taxService.findAll(getDto, getDto.outletId);
    return ResponsePaginationDto.fromPage(result, (item) => item);
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown Tax')
  async getDropdown(@Query('outletId') outletId?: string) {
    const result = await this.taxService.getDropdown(outletId);
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.taxService.findOne(id);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTaxDto,
  ) {
    const result = await this.taxService.update(id, updateDto);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.taxService.remove(id);
    return new ResponseDefaultDto({
      message: 'Tax deleted successfully',
    });
  }
}
