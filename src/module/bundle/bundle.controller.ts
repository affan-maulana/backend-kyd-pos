import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { BundleService } from './bundle.service';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { GetBundleDto } from './dto/get-bundle.dto';
import { BundleDto } from './dto/bundle.dto';

@ApiTags('Outlet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bundles')
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  @Post()
  async create(@Body() dto: CreateBundleDto) {
    const result = await this.bundleService.createBundle(dto);
    return new ResponseDefaultDto({
      message: 'Bundle created successfully',
      data: BundleDto.fromEntity(result),
    });
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(@Query() getBundleDto: GetBundleDto) {
    const result = await this.bundleService.findAll(
      getBundleDto,
      getBundleDto.outletId,
    );
    return ResponsePaginationDto.fromPage(result, (item) =>
      BundleDto.fromEntity(item),
    );
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('outletId', ParseUUIDPipe) outletId: string,
  ) {
    const result = await this.bundleService.findOneBundle(id, outletId);
    return new ResponseDefaultDto({
      result: BundleDto.fromEntity(result),
      message: 'Bundle retrieved successfully',
    });
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBundleDto) {
    return this.bundleService.updateBundle(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.bundleService.deleteBundle(id);
    return new ResponseDefaultDto({
      result: null,
      message: 'Bundle deleted successfully',
    });
  }
}
