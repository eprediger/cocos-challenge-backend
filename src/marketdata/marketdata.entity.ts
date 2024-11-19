import { Instrument } from 'src/instruments/instrument.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'marketdata' })
export class Marketdata {
  @PrimaryColumn()
  id: number;

  @Column()
  instrumentid: number;

  @Column()
  high: number;

  @Column()
  low: number;

  @Column()
  open: number;

  @Column()
  close: number;

  @Column()
  previousclose: number;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => Instrument, (i) => i.marketdata)
  @JoinColumn({
    name: 'instrumentid',
  })
  instrument: Instrument;
}
