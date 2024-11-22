import { ApiProperty } from '@nestjs/swagger';
import { OrderSide, OrderType } from './order.entity';

export enum AmountType {
  STOCK = 'STOCK',
  CASH = 'CASH',
}

class TradeDto {
  @ApiProperty({
    enum: AmountType,
  })
  amountType: AmountType;

  @ApiProperty()
  amount: number;
}

export class CreateOrderDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  type: OrderType;

  @ApiProperty()
  InstrumentId: number;

  @ApiProperty()
  trade: TradeDto;

  @ApiProperty()
  side: OrderSide;
}
