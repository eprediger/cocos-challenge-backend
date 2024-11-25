import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsPositive, ValidateIf } from 'class-validator';
import { Marketdata } from 'src/marketdata/marketdata.entity';
import { OrderSide, OrderType } from './order.entity';

export enum AmountType {
  STOCK = 'STOCK',
  CASH = 'CASH',
}

export interface Tradeable {
  totalTradeCashAmount(): number;
  stockSize(marketdata: Marketdata): number;
  totalStockPrice(marketdata: Marketdata): number;
}

export class CashAmountTradeDto implements Tradeable {
  @ApiProperty()
  @IsPositive()
  amount: number;

  public totalTradeCashAmount(): number {
    return this.amount;
  }

  // TODO: create test case when amount < marketdata.close => stockSize == 0;
  public stockSize(marketdata: Marketdata): number {
    return Math.floor(this.amount / marketdata.close);
  }

  //@Exclude()
  public totalStockPrice(marketdata: Marketdata): number {
    return this.stockSize(marketdata) * marketdata.close;
  }
}
export class StockAmountTradeDto implements Tradeable {
  @ApiProperty()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsPositive()
  price: number;

  public totalTradeCashAmount(): number {
    return this.amount * this.price;
  }

  public stockSize(marketdata: Marketdata): number {
    return this.amount;
  }

  //@Exclude()
  public totalStockPrice(marketdata: Marketdata): number {
    return this.amount * marketdata.close;
  }
}

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
