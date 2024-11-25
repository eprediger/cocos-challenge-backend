import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './CreateOrderDto';
import { Order, OrderStatus, OrderType } from './order.entity';
import { InvalidStateForCancellationError } from './InvalidStateForCancellationError';

@Injectable()
export class OrderService {
  public constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    private readonly instrumentsService: InstrumentsService,
    private readonly marketdataService: MarketdataService,
    @Inject(forwardRef(() => PortfolioService))
    private readonly portfolioService: PortfolioService,
  ) {}

  public async findUserOrders(userId: number, status: OrderStatus[]) {
    return this.repo.find({
      where: {
        userid: userId,
        status: In(status),
      },
      order: {
        datetime: 'ASC',
      },
    });
  }

  public async createOrder(newOrder: CreateOrderDto) {
    const instrument = this.instrumentsService.findById(newOrder.instrumentId);

    /* TODO: if (instrument === null) {
        ERROR INSTRUMENT NOT FOUND
      } */

    const instrumentMarketdata =
      await this.marketdataService.getLatestInstrumentMarketData(
        newOrder.instrumentId,
      );

    const userPortfolio = await this.portfolioService.findUserPortfolio(
      newOrder.userId,
    );

    if (
      userPortfolio.availableForTrading <
      newOrder.trade.totalStockPrice(instrumentMarketdata)
    ) {
      const rejectedOrder = this.repo.create({
        userid: newOrder.userId,
        instrumentid: newOrder.instrumentId,
        size: newOrder.trade.stockSize(instrumentMarketdata),
        price: instrumentMarketdata.close, // TODO: solo para MARKET
        type: newOrder.type,
        side: newOrder.side,
        status: OrderStatus.REJECTED,
      });
      return this.repo.save(rejectedOrder);
    }

    const validOrder = this.repo.create({
      userid: newOrder.userId,
      instrumentid: newOrder.instrumentId,
      size: newOrder.trade.stockSize(instrumentMarketdata),
      price:
        newOrder.type === OrderType.MARKET
          ? instrumentMarketdata.close
          : newOrder.limitPrice,
      type: newOrder.type,
      side: newOrder.side,
      status:
        newOrder.type === OrderType.MARKET
          ? OrderStatus.FILLED
          : OrderStatus.NEW,
    });

    return this.repo.save(validOrder);
  }

  public async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.repo.findOneBy({
      id: orderId,
    });

    if (order !== null) {
      console.log(`estado orden: ${order.status}`);
      if (order.status !== OrderStatus.NEW) {
        throw new InvalidStateForCancellationError();
      }

      order.status = OrderStatus.CANCELLED;
      return this.repo.save(order);
    }
  }
}
