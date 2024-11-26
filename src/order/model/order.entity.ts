import { Instrument } from 'src/instruments/model/instrument.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum OrderSide {
  BUY = 'BUY',
  CASH_OUT = 'CASH_OUT',
  CASH_IN = 'CASH_IN',
  SELL = 'SELL',
}

export enum OrderStatus {
  FILLED = 'FILLED',
  NEW = 'NEW',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @Column()
  instrumentid: number;

  @Column()
  size: number;

  @Column()
  price: number;

  @Column()
  type: OrderType;

  @Column()
  side: OrderSide;

  @Column()
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamp' })
  datetime: string;

  @ManyToOne(() => Instrument, (i) => i.orders)
  @JoinColumn({
    name: 'instrumentid',
  })
  instrument: Instrument;

  public orderPrice(): number {
    let orderAmount = this.price * this.size;

    if (this.side == OrderSide.BUY || this.side == OrderSide.CASH_OUT) {
      orderAmount *= -1;
    }

    return orderAmount;
  }

  isStock(): boolean {
    return this.side == OrderSide.BUY || this.side == OrderSide.SELL;
  }

  public stockSize(): number {
    if (this.side == OrderSide.SELL) {
      return -this.size;
    }
    return this.size;
  }
}
