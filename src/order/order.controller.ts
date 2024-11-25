import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  AmountType,
  CashAmountTradeDto,
  CreateOrderDto,
  StockAmountTradeDto,
} from './CreateOrderDto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  public constructor(private readonly service: OrderService) {}

  @Post()
  @ApiBody({
    type: CreateOrderDto,
  })
  createOrder(
    @Body({
      transform: async (value) => {
        let transformed: CashAmountTradeDto | StockAmountTradeDto;

        switch (value.trade.amountType) {
          case AmountType.CASH:
            transformed = plainToInstance(CashAmountTradeDto, value.trade);
            break;
          case AmountType.STOCK:
            transformed = plainToInstance(StockAmountTradeDto, value.trade);
          default:
            throw new BadRequestException('Invalid trade amount type');
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe();
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        return transformed;
      },
    })
    body: CreateOrderDto,
  ): Promise<unknown> {
    return this.service.createOrder(body);
  }
}
