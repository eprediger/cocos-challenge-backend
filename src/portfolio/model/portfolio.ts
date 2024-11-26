import { ApiProperty } from '@nestjs/swagger';
import { Asset } from './asset';
import { Instrument } from 'src/instruments/model/instrument.entity';
import { Order } from 'src/order/model/order.entity';

export class Portfolio {
  @ApiProperty()
  totalAccountValue: number;

  @ApiProperty()
  availableForTrading: number;

  @ApiProperty({ type: [Asset] })
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
