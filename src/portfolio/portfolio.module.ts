import { Module, forwardRef } from '@nestjs/common';
import { MarketdataModule } from 'src/marketdata/marketdata.module';
import { OrderModule } from 'src/order/order.module';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { InstrumentsModule } from 'src/instruments/instruments.module';

@Module({
  imports: [forwardRef(() => OrderModule), MarketdataModule, InstrumentsModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
