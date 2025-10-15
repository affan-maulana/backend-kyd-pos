import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { GetProductVariantDto } from './dto/request-product-variant.dto';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';

@ApiTags('Product Variants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  @ApiDefaultResponses()
  async create(@Body() createProductVariantDto: CreateProductVariantDto) {
    const result = await this.productVariantService.create(
      createProductVariantDto,
    );
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(@Query() getDto: GetProductVariantDto) {
    const result = await this.productVariantService.findAll(getDto);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch product variant',
    );
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(@Param('id') id: string) {
    const result = await this.productVariantService.findOne(id);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id') id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    const result = await this.productVariantService.update(
      id,
      updateProductVariantDto,
    );
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(@Param('id') id: string) {
    const result = await this.productVariantService.remove(id);
    return new ResponseDefaultDto(result);
  }
}
