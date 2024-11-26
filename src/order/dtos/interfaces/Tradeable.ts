import { Marketdata } from 'src/marketdata/model/marketdata.entity';

export interface Tradeable {
  totalTradeCashAmount(): number;
  stockSize(marketdata: Marketdata): number;
  totalStockPrice(marketdata: Marketdata): number;
}
