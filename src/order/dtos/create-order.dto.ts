import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { OrderSide } from '../model/constants/order-side';
import { OrderType } from '../model/constants/order-type';
import { CashAmountTradeDto } from './cash-amount-trade.dto';
import { Tradeable } from './interfaces/Tradeable';
import { StockAmountTradeDto } from './stock-amount-trade.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    enum: OrderSide,
  })
  @IsEnum(OrderSide)
  side: OrderSide;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
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

  @ValidateIf((o) => o.type === OrderType.LIMIT)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  limitPrice?: number;
}
