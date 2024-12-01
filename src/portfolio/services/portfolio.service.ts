import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/instruments/model/instrument.entity';
import { MarketdataService } from 'src/marketdata/services/marketdata.service';
import { OrderSide } from 'src/order/model/constants/order-side';
import { OrderStatus } from 'src/order/model/constants/order-status';
import { OrderService } from 'src/order/services/order.service';
import { In, Repository } from 'typeorm';
import { Portfolio } from '../model/portfolio';

@Injectable()
export class PortfolioService {
  public constructor(
    private readonly marketDataService: MarketdataService,
    @InjectRepository(Instrument)
    private readonly instrumentRepo: Repository<Instrument>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
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
          status: In([OrderStatus.FILLED]),
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
