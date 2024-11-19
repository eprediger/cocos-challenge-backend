import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marketdata } from 'src/marketdata/marketdata.entity';
import { Order, OrderSide, OrderStatus } from 'src/order/order.entity';
import { In, Repository } from 'typeorm';
import { Portfolio } from './portfolio';
import { Instrument } from 'src/instruments/instrument.entity';

@Injectable()
export class PortfolioService {
  public constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Marketdata)
    private readonly marketDataRepo: Repository<Marketdata>,
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
  ) {}

  public async findUserPortfolio(userId: number): Promise<Portfolio> {
    const orders = await this.ordersRepo.find({
      where: {
        userid: userId,
        status: In([OrderStatus.FILLED, OrderStatus.NEW]),
      },
      order: {
        datetime: 'ASC',
      },
    });

    const marketdata = await this.marketDataRepo.find({
      relations: {
        instrument: true,
      },
    });

    const mostRecentDate = marketdata
      .map((m) => m.date)
      .reduce((prev, curr) => {
        return curr > prev ? curr : prev;
      }, marketdata[0].date);

    const userAssetsMovements = await this.instrumentRepo.find({
      where: {
        orders: {
          userid: userId,
          status: In([OrderStatus.FILLED, OrderStatus.NEW]),
          side: In([OrderSide.BUY, OrderSide.SELL]),
        },
        marketdata: {
          date: mostRecentDate,
        },
      },
      order: {
        ticker: 'ASC',
        orders: {
          datetime: 'ASC',
        },
      },
      relations: {
        orders: true,
        marketdata: true,
      },
    });

    const portfolio = new Portfolio(orders, userAssetsMovements);

    return portfolio;
  }
}
