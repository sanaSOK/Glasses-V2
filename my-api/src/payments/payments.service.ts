import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaymentTransactionStatus, PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async processPayment(orderId: number, dto: ProcessPaymentDto) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    let payment = await this.paymentRepository.findOne({ where: { order_id: orderId } });
    if (!payment) {
      payment = this.paymentRepository.create({
        order_id: orderId,
        amount: order.total_amount,
      });
    }

    payment.payment_method = dto.payment_method;
    payment.transaction_id = dto.transaction_id || `TXN-${Date.now()}`;
    payment.status = PaymentTransactionStatus.COMPLETED;
    payment.paid_at = new Date();

    const savedPayment = await this.paymentRepository.save(payment);

    // Update order payment status
    order.payment_status = PaymentStatus.PAID;
    await this.orderRepository.save(order);

    return savedPayment;
  }

  async getPaymentByOrder(orderId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { order_id: orderId },
      relations: { order: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment record for order #${orderId} not found`);
    }

    return payment;
  }
}
