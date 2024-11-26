import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marketdata } from '../model/marketdata.entity';

@Injectable()
export class MarketdataService {
  public constructor(
    @InjectRepository(Marketdata)
    private readonly repo: Repository<Marketdata>,
  ) {}

  public async getMostRecentDate(): Promise<string> {
    const marketdata = await this.repo.find();

    return marketdata
      .map((m) => m.date)
      .reduce((prev, curr) => {
        return curr > prev ? curr : prev;
      }, marketdata[0].date);
  }

  public async getLatestInstrumentMarketData(
    instrumentId: number,
  ): Promise<Marketdata> {
    const mostRecentDate = await this.getMostRecentDate();

    return this.repo.findOneBy({
      instrumentid: instrumentId,
      date: mostRecentDate,
    });
  }
}
