import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, In, Repository } from 'typeorm';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { CreateOrderDto } from './CreateOrderDto';

@Injectable()
export class OrderService {
  public constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    private readonly instrumentsService: InstrumentsService,
    private readonly marketdataService: MarketdataService,
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
    const instrument = this.instrumentsService.findById(newOrder.InstrumentId);

    /* TODO: if (instrument === null) {
      ERROR INSTRUMENT NOT FOUND
    } */

    const instrumentMarketdata =
      await this.marketdataService.getLatestInstrumentMarketData(
        newOrder.InstrumentId,
      );

    const validOrder = this.repo.create({
      userid: newOrder.userId,
      instrumentid: newOrder.InstrumentId,
      size: newOrder.trade.amount,
      price: instrumentMarketdata.close,
      type: newOrder.type,
      side: newOrder.side,
      status: OrderStatus.FILLED,
    });

    return this.repo.save(validOrder);
  }
}
