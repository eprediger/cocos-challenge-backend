import { Body, Controller, Inject, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './CreateOrderDto';
import { ApiBody } from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  public constructor(private readonly service: OrderService) {}

  @Post()
  @ApiBody({
    type: CreateOrderDto,
  })
  createOrder(@Body() body: CreateOrderDto): Promise<unknown> {
    return this.service.createOrder(body);
  }
}
