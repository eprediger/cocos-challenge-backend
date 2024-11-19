import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { TypeOrmConfigService } from './config/type-orm-config/type-orm-config.service';
import { InstrumentsModule } from './instruments/instruments.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { OrderModule } from './order/order.module';
import { MarketdataModule } from './marketdata/marketdata.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    InstrumentsModule,
    PortfolioModule,
    OrderModule,
    MarketdataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
