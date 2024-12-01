import { Instrument } from 'src/instruments/model/instrument.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderSide } from './constants/order-side';
import { OrderStatus } from './constants/order-status';
import { OrderType } from './constants/order-type';

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
