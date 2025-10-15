import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AddOnService } from './add-on.service';
import { AddOnQueryDto } from './dto/add-on-query.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { AddOnGroup } from './entities/add-on-group.entity';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';
import { AddOnGroupDto } from './dto/add-on-group.dto';
import { RequestAddOnGroupDto } from './dto/request-add-on.-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { UpdateAddOnGroupDto } from './dto/update-add-on.-group.dto';
import { DropdownDto } from '@common/dto/dropdown.dto';

@ApiTags('Add-on')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('add-on')
export class AddOnController {
  constructor(private readonly addOnService: AddOnService) {}

  /**
   * Find all add-on groups with pagination
   */
  @Get()
  async findAll(
    @Query() query: AddOnQueryDto,
  ): Promise<ResponsePaginationDto<AddOnGroupDto>> {
    const addOnGroups = await this.addOnService.findAll(query);
    return ResponsePaginationDto.fromPage<AddOnGroup, AddOnGroupDto>(
      addOnGroups,
      (item) => {
        return AddOnGroupDto.fromEntity(item);
      },
    );
  }

  /**
   * Find all add-on groups for dropdown
   */
  @Get('dropdown')
  async findDropdown(): Promise<ResponseDefaultDto<DropdownDto[]>> {
    const data = await this.addOnService.findDropdown();
    return new ResponseDefaultDto({
      result: data.map((data) => DropdownDto.fromEntity(data, 'id', 'name')),
      message: 'All add-on groups dropdown retrieved successfully',
    });
  }

  /**
   * Find one add-on group
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseDefaultDto<AddOnGroupDto>> {
    const result = await this.addOnService.findOne(id);
    return new ResponseDefaultDto({
      result: AddOnGroupDto.fromEntity(result),
      message: 'Add-on detail fetched successfully',
    });
  }

  /**
   * Create add-on group with nested add-ons
   */
  @Post()
  async create(
    @Body() body: RequestAddOnGroupDto,
  ): Promise<ResponseDefaultDto<AddOnGroup>> {
    const result = await this.addOnService.create(body);
    return new ResponseDefaultDto({
      result,
      message: 'Add-on group created successfully',
    });
  }

  /**
   * Update add-on group or its add-ons
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAddOnGroupDto,
  ): Promise<ResponseDefaultDto<AddOnGroupDto>> {
    const updated = await this.addOnService.update(id, body);
    return new ResponseDefaultDto({
      result: AddOnGroupDto.fromEntity(updated),
      message: 'Add-on group updated successfully',
    });
  }

  /**
   * Soft delete an add-on group (set deleted_at)
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDefaultDto<any>> {
    await this.addOnService.softDelete(id);
    return new ResponseDefaultDto({
      data: null,
      message: `Add-on group with id ${id} has been deleted`,
    });
  }
}
