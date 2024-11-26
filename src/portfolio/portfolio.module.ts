import { Module, forwardRef } from '@nestjs/common';
import { MarketdataModule } from 'src/marketdata/marketdata.module';
import { OrderModule } from 'src/order/order.module';
import { PortfolioController } from './controllers/portfolio.controller';

import { InstrumentsModule } from 'src/instruments/instruments.module';
import { PortfolioService } from './services/portfolio.service';

@Module({
  imports: [forwardRef(() => OrderModule), MarketdataModule, InstrumentsModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
