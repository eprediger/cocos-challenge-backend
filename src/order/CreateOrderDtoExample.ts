import { plainToInstance } from 'class-transformer';
import {
  CreateOrderDto,
  StockAmountTradeDto,
  Tradeable,
} from './CreateOrderDto';
import { OrderSide, OrderStatus, OrderType } from './order.entity';

export class CreateOrderDtoExample {
  private props: any = {
    userId: 1,
    side: OrderSide.BUY,
    instrumentId: 1,
    type: OrderType.MARKET,
    trade: <Tradeable>plainToInstance(StockAmountTradeDto, {
      amount: 1,
      price: 1,
    }),
  };

  public build(): CreateOrderDto {
    return plainToInstance(CreateOrderDto, this.props);
  }

  public withTrade(trade: Tradeable): CreateOrderDtoExample {
    this.props.trade = trade;
    return this;
  }

  public withType(orderType: OrderType): CreateOrderDtoExample {
    this.props.type = orderType;
    return this;
  }

  public withLimitPrice(limitPrice: number): CreateOrderDtoExample {
    this.props.limitPrice = limitPrice;
    return this;
  }

  public withSide(side: OrderSide): CreateOrderDtoExample {
    this.props.side = side;
    return this;
  }

  public withStatus(status: OrderStatus): CreateOrderDtoExample {
    this.props.status = status;
    return this;
  }
}