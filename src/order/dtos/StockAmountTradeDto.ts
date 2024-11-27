import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { Marketdata } from 'src/marketdata/model/marketdata.entity';
import { AmountType } from './constants/AmountType';
import { Tradeable } from './interfaces/Tradeable';

export class StockAmountTradeDto implements Tradeable {
  @ApiProperty({ enum: AmountType, default: AmountType.STOCK })
  @IsEnum(AmountType)
  amountType: AmountType = AmountType.STOCK;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsPositive()
  // TODO: documentar para qué era el price, tal vez haya que borrarlo
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
