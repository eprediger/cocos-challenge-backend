import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { Marketdata } from 'src/marketdata/model/marketdata.entity';
import { Tradeable } from './interfaces/Tradeable';

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

  public totalStockPrice(marketdata: Marketdata): number {
    return this.stockSize(marketdata) * marketdata.close;
  }
}
