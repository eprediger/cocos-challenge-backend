import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './model/instrument.entity';
import { InstrumentsService } from './services/instruments.service';
import { InstrumentsController } from './controllers/instruments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
  exports: [TypeOrmModule, InstrumentsService],
})
export class InstrumentsModule {}
