import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderService } from 'src/order/order.service';
import { In, Repository } from 'typeorm';
import { Instrument } from 'src/instruments/instrument.entity';
import { Marketdata } from 'src/marketdata/marketdata.entity';
import { OrderSide, OrderStatus } from 'src/order/order.entity';
import { Portfolio } from './portfolio';
import { MarketdataService } from 'src/marketdata/marketdata.service';

@Injectable()
export class PortfolioService {
  public constructor(
    private readonly orderService: OrderService,
    private readonly marketDataService: MarketdataService,
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
  ) {}

  public async findUserPortfolio(userId: number): Promise<Portfolio> {
    const orders = await this.orderService.findUserOrders(userId, [
      OrderStatus.FILLED,
      OrderStatus.NEW,
    ]);
    const mostRecentDate = await this.marketDataService.getMostRecentDate();

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

    return new Portfolio(orders, userAssetsMovements);
  }
}
