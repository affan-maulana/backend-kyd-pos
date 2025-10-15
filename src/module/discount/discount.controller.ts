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
import { DiscountService } from './discount.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import {
  DiscountDto,
  GetDiscountDto,
  UpdateDiscountDto,
} from './dto/request-discount.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';

@ApiTags('Discount')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiDefaultResponses()
  async create(@Body() discountDto: DiscountDto) {
    const result = await this.discountService.create(
      discountDto,
      discountDto.outletId,
    );
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(@Query() getDto: GetDiscountDto) {
    const result = await this.discountService.findAll(getDto, getDto.outletId);
    return ResponsePaginationDto.fromPage(result, (item) => item);
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown Discount')
  async getDropdown(@Query('outletId') outletId?: string) {
    const result = await this.discountService.getDropdown(outletId);
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.discountService.findOne(id);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateDiscountDto,
  ) {
    const result = await this.discountService.update(id, updateDto);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.discountService.remove(id);
    return new ResponseDefaultDto({
      message: 'Discount deleted successfully',
    });
  }
}
