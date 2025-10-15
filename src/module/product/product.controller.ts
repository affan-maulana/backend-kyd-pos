import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { BusinessId } from '@common/decorators/BusinessId';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { DropdownProductDto, GetProductDto } from './dto/request-product.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { UpdateCategoryProductDto } from './dto/update-product-category-product.dto';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiDefaultResponses()
  async create(
    @Body() createProductDto: CreateProductDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.productService.create(
      createProductDto,
      businessId,
    );
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(
    @Query() getDto: GetProductDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.productService.findAll(getDto, businessId);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch Product',
    );
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown Product')
  async getDropdown(
    @Query() { outletId, search, productCategoryId }: DropdownProductDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.productService.getDropdown(
      outletId,
      businessId,
      search,
      productCategoryId,
    );
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.productService.findOne(id);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const result = await this.productService.update(id, updateProductDto);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.productService.remove(id);
    return new ResponseDefaultDto(result);
  }

  @Patch('category/:id')
  @ApiDefaultResponses()
  async updateProductCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @BusinessId() businessId: string,
    @Body() updateProductDto: UpdateCategoryProductDto,
  ) {
    const result = await this.productService.updateCategoryProduct(
      id,
      businessId,
      updateProductDto,
    );
    return new ResponseDefaultDto(result);
  }
}
