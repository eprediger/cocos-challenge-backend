import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentsModule } from 'src/instruments/instruments.module';
import { MarketdataModule } from 'src/marketdata/marketdata.module';
import { PortfolioModule } from 'src/portfolio/portfolio.module';
import { OrderController } from './controllers/order.controller';
import { Order } from './model/order.entity';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    forwardRef(() => PortfolioModule),
    TypeOrmModule.forFeature([Order]),
    InstrumentsModule,
    MarketdataModule,
  ],
  exports: [OrderService],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
