import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentsModule } from 'src/instruments/instruments.module';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { MarketdataModule } from 'src/marketdata/marketdata.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    InstrumentsModule,
    MarketdataModule,
  ],
  exports: [OrderService],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
