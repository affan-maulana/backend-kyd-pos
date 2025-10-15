import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import {
  BusinessDto,
  CreateBusinessDto,
  GetBusinessDto,
} from './dto/request-business.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { UserId } from '@common/decorators/UserId';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';

@ApiTags('Business')
@ApiBearerAuth()
@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiDefaultResponses('Success created business')
  async create(
    @Body() businessDto: CreateBusinessDto,
    @UserId() userId: string,
  ) {
    const result = await this.businessService.create(businessDto, userId);
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses('Success created business')
  async findAll(@Query() getDto: GetBusinessDto, @UserId() userId: string) {
    const result = await this.businessService.findAll(getDto, userId);
    return new ResponsePaginationDto(
      result.data,
      result.meta,
      'Success fetch business',
    );
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success fetch business dropdown')
  async findAllDropdown(
    @Query() getDto: GetBusinessDto,
    @UserId() userId: string,
  ) {
    const result = await this.businessService.findAllDropdown(getDto, userId);
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses('Success get business')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    const data = await this.businessService.findOne(id, userId);
    return new ResponseDefaultDto({
      message: 'Business found successfully',
      data,
    });
  }

  @Put(':id')
  @ApiDefaultResponses('Success updated business')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() businessDto: BusinessDto,
    @UserId() userId: string,
  ) {
    const result = await this.businessService.update(id, businessDto, userId);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses('Success removed business')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    const result = await this.businessService.remove(id, userId);
    return new ResponseDefaultDto(result);
  }
}
