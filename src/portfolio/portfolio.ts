import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderSide } from 'src/order/order.entity';
import { Instrument } from '../instruments/instrument.entity';

class Asset {
  @ApiProperty()
  stockAmount: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  yield: string;

  public constructor(public readonly instrument: Instrument) {
    this.stockAmount = instrument.orders
      .filter((o) => o.isStock())
      .reduce((accum, currentOrder) => {
        return accum + currentOrder.stockSize();
      }, 0);

    this.value = this.stockAmount * instrument.marketdata[0].close;

    const buy = Math.abs(
      instrument.orders
        .filter((o) => o.side == OrderSide.BUY)
        .reduce((accum, currentOrder) => {
          return accum + currentOrder.orderPrice();
        }, 0),
    );

    this.yield = ((this.value / buy - 1) * 100).toFixed(2);
  }
}

export class Portfolio {
  @ApiProperty()
  totalAccountValue: number;

  @ApiProperty()
  availableForTrading: number;

  @ApiProperty()
  assetHoldings: Asset[];

  public constructor(orders: Order[], detailedInstruments: Instrument[]) {
    this.availableForTrading = orders.reduce((accum, currentOrder) => {
      return accum + currentOrder.orderPrice();
    }, 0);

    this.assetHoldings = detailedInstruments.map((di) => new Asset(di));

    this.totalAccountValue =
      this.availableForTrading +
      this.assetHoldings.reduce((accum, asset) => {
        return accum + asset.value;
      }, 0);
  }
}
