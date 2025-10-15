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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { OutletService } from './outlet.service';
import { OutletQueryDto } from './dto/outlet-query.dto';
import { RequestOutletDto } from './dto/request-outlet.dto';
import { OutletDto } from './dto/outlet.dto';
import { UserId } from '@common/decorators/UserId';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { DropdownDto } from '@common/dto/dropdown.dto';
import { BusinessId } from '@common/decorators/BusinessId';

@ApiTags('Outlet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('outlet')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Post()
  @ApiDefaultResponses()
  async create(
    @Body() requestDto: RequestOutletDto,
    @UserId() userId: string,
    @BusinessId() businessId: string,
  ): Promise<ResponseDefaultDto<OutletDto>> {
    const result = await this.outletService.create(
      requestDto,
      userId,
      businessId,
    );
    return new ResponseDefaultDto({
      message: 'Outlet created successfully',
      result: OutletDto.fromEntity(result),
    });
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(
    @Query() queryDto: OutletQueryDto,
    @BusinessId() businessId: string,
  ): Promise<ResponsePaginationDto<OutletDto>> {
    const outlets = await this.outletService.findAll(queryDto, businessId);
    return ResponsePaginationDto.fromPage<Outlet, OutletDto>(
      outlets,
      (item) => {
        return OutletDto.fromEntity(item);
      },
    );
  }

  @Get('dropdown')
  async findDropdown(
    @BusinessId() businessId: string,
  ): Promise<ResponseDefaultDto<DropdownDto[]>> {
    const data = await this.outletService.findDropdown(businessId);
    return new ResponseDefaultDto({
      result: data.map((data) => DropdownDto.fromEntity(data, 'id', 'name')),
      message: 'All add-on groups retrieved successfully',
    });
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseDefaultDto<OutletDto>> {
    const outlet = await this.outletService.findOne(id);
    const result = OutletDto.fromEntity(outlet);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOutletDto,
    @BusinessId() businessId: string,
  ): Promise<ResponseDefaultDto<OutletDto>> {
    const updated = await this.outletService.update(id, updateDto, businessId);
    return new ResponseDefaultDto({
      message: 'Outlet updated successfully',
      result: OutletDto.fromEntity(updated),
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDefaultDto<any>> {
    await this.outletService.remove(id);
    return new ResponseDefaultDto({
      message: 'Outlet deleted successfully',
      data: null,
    });
  }
}
