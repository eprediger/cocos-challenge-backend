import { ApiProperty } from '@nestjs/swagger';
import { Instrument } from 'src/instruments/model/instrument.entity';
import { OrderSide } from 'src/order/model/order.entity';

export class Asset {
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
