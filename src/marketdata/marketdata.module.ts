import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marketdata } from './marketdata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marketdata])],
  exports: [TypeOrmModule],
})
export class MarketdataModule {}
