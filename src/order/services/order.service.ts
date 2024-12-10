import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstrumentsService } from 'src/instruments/services/instruments.service';
import { MarketdataService } from 'src/marketdata/services/marketdata.service';
import { PortfolioService } from 'src/portfolio/services/portfolio.service';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderSide } from '../model/constants/order-side';
import { OrderStatus } from '../model/constants/order-status';
import { OrderType } from '../model/constants/order-type';
import { InvalidStateForCancellationError } from '../model/errors/invalid-state-for-cancellation.error';
import { Order } from '../model/order.entity';

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
    let validOrder: Order;

    const userPortfolio = await this.portfolioService.findUserPortfolio(
      newOrder.userId,
    );
    switch (newOrder.side) {
      case OrderSide.BUY:
      case OrderSide.SELL:
        const instrument = this.instrumentsService.findById(
          newOrder.instrumentId,
        );

        /* TODO: if (instrument === null) {
            ERROR INSTRUMENT NOT FOUND
          } */

        const instrumentMarketdata =
          await this.marketdataService.getLatestInstrumentMarketData(
            newOrder.instrumentId,
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

        validOrder = this.repo.create({
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

        break;

      case OrderSide.CASH_IN:
        validOrder = this.repo.create({
          userid: newOrder.userId,
          instrumentid: newOrder.instrumentId,
          size: newOrder.trade.totalTradeCashAmount(),
          price: 1, // TODO: refactor in method inside CreateOrder
          type: newOrder.type,
          side: newOrder.side,
          status: OrderStatus.FILLED,
        });
      case OrderSide.CASH_OUT:
        if (
          userPortfolio.availableForTrading <
          newOrder.trade.totalTradeCashAmount()
        ) {
          const rejectedOrder = this.repo.create({
            userid: newOrder.userId,
            instrumentid: newOrder.instrumentId,
            size: newOrder.trade.totalTradeCashAmount(),
            price: 1, // TODO: refactor in method inside CreateOrder
            type: newOrder.type,
            side: newOrder.side,
            status: OrderStatus.REJECTED,
          });
          return this.repo.save(rejectedOrder);
        }

        validOrder = this.repo.create({
          userid: newOrder.userId,
          instrumentid: newOrder.instrumentId,
          size: newOrder.trade.totalTradeCashAmount(),
          price: 1, // TODO: refactor in method inside CreateOrder
          type: newOrder.type,
          side: newOrder.side,
          status: OrderStatus.FILLED,
        });
      default:
        break;
    }

    return this.repo.save(validOrder);
  }

  public async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.repo.findOneBy({
      id: orderId,
    });

    if (order !== null) {
      if (order.status !== OrderStatus.NEW) {
        throw new InvalidStateForCancellationError();
      }

      order.status = OrderStatus.CANCELLED;
      return this.repo.save(order);
    }
  }
}
