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
import { ProductCategoriesService } from './product-category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import {
  GetProductCategoryDto,
  ProductCategoryDto,
} from './dto/request-product-category.dto';
import { BusinessId } from '@common/decorators/BusinessId';

@ApiTags('Product Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product-category')
export class ProductCategoriesController {
  constructor(private readonly pCategoryService: ProductCategoriesService) {}

  @Post()
  @ApiDefaultResponses()
  async create(
    @Body() pCategoryDto: ProductCategoryDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.pCategoryService.create(pCategoryDto, businessId);
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(
    @Query() getDto: GetProductCategoryDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.pCategoryService.findAll(getDto, businessId);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch PCategory',
    );
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown pCategory')
  async getDropdown(
    @Query() getDto: GetProductCategoryDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.pCategoryService.getDropdown(getDto, businessId);
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('outletId', ParseUUIDPipe) outletId: string,
    @BusinessId() businessId: string,
  ) {
    const result = await this.pCategoryService.findOne(
      id,
      outletId,
      businessId,
    );
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() pCategoryDto: ProductCategoryDto,
    @BusinessId() businessId: string,
  ) {
    const result = await this.pCategoryService.update(
      id,
      pCategoryDto,
      businessId,
    );
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('outletId', ParseUUIDPipe) outletId: string,
    @BusinessId() businessId: string,
  ) {
    const result = await this.pCategoryService.remove(id, outletId, businessId);
    return new ResponseDefaultDto(result);
  }
}
