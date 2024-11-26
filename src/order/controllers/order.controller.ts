import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { StockAmountTradeDto } from '../dtos/StockAmountTradeDto';
import { CashAmountTradeDto } from '../dtos/CashAmountTradeDto';
import { AmountType } from '../dtos/constants/AmountType';
import { OrderService } from '../services/order.service';
import { Order } from '../model/order.entity';

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
  ): Promise<Order> {
    return this.service.createOrder(body);
  }

  @Delete('/:orderId')
  @ApiParam({
    name: 'orderId',
    type: 'number',
    description: 'The id of the order to be cancelled',
  })
  @ApiOkResponse({
    description: 'The cancelled order',
    type: Order,
    example: {
      id: 5,
      userid: 1,
      instrumentid: 45,
      size: 50,
      price: 710,
      type: 'LIMIT',
      side: 'BUY',
      status: 'CANCELLED',
      datetime: '2023-07-12T15:14:20.000Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'There was an error with the request data',
    example: {
      message: 'Only orders in NEW state can de cancelled.',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  public async cancelOrder(@Param('orderId') id: number): Promise<Order> {
    return this.service.cancelOrder(id);
  }
}
