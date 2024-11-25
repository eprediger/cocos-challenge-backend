import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './instrument.entity';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
  exports: [TypeOrmModule, InstrumentsService],
})
export class InstrumentsModule {}
