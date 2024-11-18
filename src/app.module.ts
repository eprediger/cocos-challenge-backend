import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { TypeOrmConfigService } from './config/type-orm-config/type-orm-config.service';
import { InstrumentsModule } from './instruments/instruments.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
