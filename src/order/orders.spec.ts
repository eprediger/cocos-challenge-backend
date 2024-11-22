import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Instrument } from 'src/instruments/instrument.entity';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { Repository } from 'typeorm';
import { Order, OrderSide, OrderStatus, OrderType } from './order.entity';
import { OrderService } from './order.service';
import { Marketdata } from 'src/marketdata/marketdata.entity';
import { AmountType } from './CreateOrderDto';

describe('Order', () => {
  let service: OrderService;
  let repo: Repository<Order>;
  let save: jest.Mock;
  let instrumentService: InstrumentsService;
  let marketDataService: MarketdataService;

  beforeAll(async () => {
    save = jest.fn().mockResolvedValue({
      id: 1,
      userid: 1,
      instrumentid: 1,
      size: 1,
      price: 1,
      type: OrderType.MARKET,
      side: OrderSide.BUY,
      status: OrderStatus.FILLED,
      datetime: '2024-11-21T11:13:20.000Z',
    });

    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: InstrumentsService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: MarketdataService,
          useValue: {
            getLatestInstrumentMarketData: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn().mockImplementation((o) => ({ id: 1, ...o })),
            save,
          },
        },
      ],
    }).compile();

    marketDataService = module.get(MarketdataService);
    instrumentService = module.get(InstrumentsService);
    service = module.get(OrderService);
    repo = module.get(getRepositoryToken(Order));
  });

  describe('Given a MARKET order type', () => {
    it('should create it successfully', async () => {
      const body = {
        userId: 1,
        type: OrderType.MARKET,
        InstrumentId: 47,
        trade: {
          amountType: AmountType.STOCK,
          amount: 1,
        },
        side: OrderSide.BUY,
      };

      jest
        .spyOn(instrumentService, 'findById')
        .mockResolvedValueOnce(new Instrument());
      const mockedMarketdata = new Marketdata();
      mockedMarketdata.close = 1000;
      jest
        .spyOn(marketDataService, 'getLatestInstrumentMarketData')
        .mockResolvedValueOnce(mockedMarketdata);

      const mockedOrder = repo.create({
        userid: body.userId,
        instrumentid: body.InstrumentId,
        size: body.trade.amount,
        price: mockedMarketdata.close,
        type: body.type,
        side: body.side,
        status: OrderStatus.FILLED,
      });

      jest.spyOn(repo, 'save').mockResolvedValueOnce(mockedOrder);

      const order = await service.createOrder(body);

      expect(order.id).toEqual(1);
    });
  });

  // TODO: las ordenes limite requieren el envío del precio al cual el usuario quiere ejecutar la orden.
});
