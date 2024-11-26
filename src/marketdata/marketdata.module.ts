import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marketdata } from './model/marketdata.entity';
import { MarketdataService } from './services/marketdata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Marketdata])],
  exports: [MarketdataService],
  providers: [MarketdataService],
})
export class MarketdataModule {}
