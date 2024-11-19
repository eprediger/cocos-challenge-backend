import { ApiProperty } from '@nestjs/swagger';
import { Marketdata } from 'src/marketdata/marketdata.entity';
import { Order } from 'src/order/order.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'instruments' })
export class Instrument {
  @PrimaryColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  ticker: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  type: string;

  @OneToMany(() => Order, (o) => o.instrument)
  orders: Order[];

  @OneToMany(() => Marketdata, (o) => o.instrument)
  marketdata: Marketdata[];
}
