import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Configuration } from './config/configuration';
import { TypeOrmConfigService } from './config/type-orm-config/type-orm-config.service';
import { InstrumentsModule } from './instruments/instruments.module';
import { MarketdataModule } from './marketdata/marketdata.module';
import { OrderModule } from './order/order.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => {
          const config = plainToInstance(Configuration, process.env);

          const errors = validateSync(config);

          if (errors.length > 0) {
            throw new Error(
              `Configuration validation failed: ${errors.toString()}`,
            );
          }

          return config;
        },
      ],
      isGlobal: true,
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
})
export class AppModule {}
