import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Marketdata } from 'src/marketdata/model/marketdata.entity';
import { Tradeable } from './interfaces/Tradeable';

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
