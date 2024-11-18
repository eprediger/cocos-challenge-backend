import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
