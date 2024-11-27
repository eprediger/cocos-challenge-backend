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
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CashAmountTradeDto } from '../dtos/CashAmountTradeDto';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { StockAmountTradeDto } from '../dtos/StockAmountTradeDto';
import { AmountType } from '../dtos/constants/AmountType';
import { Order } from '../model/order.entity';
import { OrderService } from '../services/order.service';

@Controller('orders')
@ApiExtraModels(CashAmountTradeDto, StockAmountTradeDto)
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

        const amountType = value.trade.amountType;

        switch (amountType) {
          case AmountType.CASH:
            transformed = plainToInstance(CashAmountTradeDto, value.trade);
            break;
          case AmountType.STOCK:
            transformed = plainToInstance(StockAmountTradeDto, value.trade);
            break;
          default:
            throw new BadRequestException(
              `'${amountType}' is not a valid trade amount type`,
            );
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe();
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        value.trade = transformed;
        return value;
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
