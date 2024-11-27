import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsEnum, IsPositive, ValidateIf } from 'class-validator';
import { OrderSide } from '../model/constants/OrderSide';
import { OrderType } from '../model/constants/OrderType';
import { CashAmountTradeDto } from './CashAmountTradeDto';
import { StockAmountTradeDto } from './StockAmountTradeDto';
import { Tradeable } from './interfaces/Tradeable';

export class CreateOrderDto {
  @ApiProperty()
  @IsPositive()
  userId: number;

  @ApiProperty({
    enum: OrderSide,
  })
  @IsEnum(OrderSide)
  side: OrderSide;

  @ApiProperty()
  @IsPositive()
  instrumentId: number;

  @ApiProperty({
    enum: OrderType,
  })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(CashAmountTradeDto) },
      { $ref: getSchemaPath(StockAmountTradeDto) },
    ],
  })
  trade: Tradeable;

  @ValidateIf((body) => body.offer === OrderType.LIMIT)
  limitPrice?: number;
}
