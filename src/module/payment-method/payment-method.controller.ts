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
import { PaymentMethodService } from './payment-method.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { ApiDefaultResponses } from '@common/decorators/swagger-response.decorator';
import {
  PaymentMethodDto,
  GetPaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/request-payment-method.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { ResponseDefaultDto } from '@common/dto/response-default.dto';

@ApiTags('Payment Method')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  @ApiDefaultResponses()
  async create(@Body() paymentMethodDto: PaymentMethodDto) {
    const result = await this.paymentMethodService.create(
      paymentMethodDto,
      paymentMethodDto.outletId,
    );
    return new ResponseDefaultDto(result);
  }

  @Get()
  @ApiDefaultResponses()
  async findAll(@Query() getDto: GetPaymentMethodDto) {
    const result = await this.paymentMethodService.findAll(
      getDto,
      getDto.outletId,
    );
    return ResponsePaginationDto.fromPage(result, (item) => item);
  }

  @Get('dropdown')
  @ApiDefaultResponses('Success get dropdown Payment Method')
  async getDropdown(@Query('outletId') outletId?: string) {
    const result = await this.paymentMethodService.getDropdown(outletId);
    return new ResponseDefaultDto(result);
  }

  @Get(':id')
  @ApiDefaultResponses()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.paymentMethodService.findOne(id);
    return new ResponseDefaultDto(result);
  }

  @Put(':id')
  @ApiDefaultResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePaymentMethodDto,
  ) {
    const result = await this.paymentMethodService.update(id, updateDto);
    return new ResponseDefaultDto(result);
  }

  @Delete(':id')
  @ApiDefaultResponses()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.paymentMethodService.remove(id);
    return new ResponseDefaultDto({
      message: 'Payment method deleted successfully',
    });
  }
}
