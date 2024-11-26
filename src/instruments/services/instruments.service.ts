import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { InstrumentQuery } from '../dtos/InstrumentQuery';
import { Instrument } from '../model/instrument.entity';

@Injectable()
export class InstrumentsService {
  public constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
  ) {}

  public find(query: InstrumentQuery): Promise<Instrument[]> {
    return this.instrumentRepo.find({
      where: {
        ticker: query.ticker && ILike(`%${query.ticker}%`),
        name: query.name && ILike(`%${query.name}%`),
      },
    });
  }

  public async findById(id: number): Promise<Instrument> {
    return this.instrumentRepo.findOneBy({
      id,
    });
  }
}
