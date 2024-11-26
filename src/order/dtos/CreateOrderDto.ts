import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';
import { OrderType } from '../model/constants/OrderType';
import { OrderSide } from '../model/constants/OrderSide';
import { Tradeable } from './interfaces/Tradeable';
import { CashAmountTradeDto } from './CashAmountTradeDto';
import { StockAmountTradeDto } from './StockAmountTradeDto';

export class CreateOrderDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  side: OrderSide;

  @ApiProperty()
  instrumentId: number;

  @ApiProperty({
    enum: OrderType,
  })
  type: OrderType;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(CashAmountTradeDto) },
      { $ref: getSchemaPath(StockAmountTradeDto) },
    ],
  })
  trade: Tradeable;

  @ValidateIf((body) => body.offer === OrderType.LIMIT)
  limitPrice: number;
}
