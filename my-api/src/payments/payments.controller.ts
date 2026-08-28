import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Process mock payment for an order' })
  @Post('orders/:orderId')
  processPayment(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: ProcessPaymentDto,
  ) {
    return this.paymentsService.processPayment(orderId, dto);
  }

  @ApiOperation({ summary: 'Get payment record by order ID' })
  @Get('orders/:orderId')
  getPaymentByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.getPaymentByOrder(orderId);
  }
}
