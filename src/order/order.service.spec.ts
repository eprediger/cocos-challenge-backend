import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Instrument } from 'src/instruments/instrument.entity';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { Marketdata } from 'src/marketdata/marketdata.entity';
import { MarketdataService } from 'src/marketdata/marketdata.service';
import { Portfolio } from 'src/portfolio/portfolio';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { Repository } from 'typeorm';
import { CashAmountTradeDto, CreateOrderDto } from './CreateOrderDto';
import { CreateOrderDtoExample } from './CreateOrderDtoExample';
import { Order, OrderSide, OrderStatus, OrderType } from './order.entity';
import { OrderService } from './order.service';
import { InvalidStateForCancellationError } from './InvalidStateForCancellationError';

describe('Order', () => {
  let service: OrderService;
  let repo: Repository<Order>;
  let instrumentService: InstrumentsService;
  let marketDataService: MarketdataService;
  let portfolioService: PortfolioService;

  beforeAll(async () => {
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
          provide: PortfolioService,
          useValue: {
            findUserPortfolio: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            findOneBy: jest.fn(),
            create: jest
              .fn()
              .mockImplementation((o) => plainToInstance(CreateOrderDto, o)),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    portfolioService = module.get(PortfolioService);
    marketDataService = module.get(MarketdataService);
    instrumentService = module.get(InstrumentsService);
    service = module.get(OrderService);
    repo = module.get(getRepositoryToken(Order));
  });

  describe('Given a MARKET order type', () => {
    it('should create it successfully', async () => {
      const orderRequest = new CreateOrderDtoExample()
        .withType(OrderType.MARKET)
        .build();

      const mockedPortfolio = new Portfolio([], []);
      mockedPortfolio.availableForTrading = 100_000;
      jest
        .spyOn(portfolioService, 'findUserPortfolio')
        .mockResolvedValueOnce(mockedPortfolio);

      jest
        .spyOn(instrumentService, 'findById')
        .mockResolvedValueOnce(new Instrument());

      const mockedMarketdata = new Marketdata();
      mockedMarketdata.close = 1000;
      jest
        .spyOn(marketDataService, 'getLatestInstrumentMarketData')
        .mockResolvedValueOnce(mockedMarketdata);

      const mockedOrder = repo.create({
        id: 1,
        userid: orderRequest.userId,
        instrumentid: orderRequest.instrumentId,
        size: orderRequest.trade.stockSize(mockedMarketdata),
        price: mockedMarketdata.close,
        type: orderRequest.type,
        side: orderRequest.side,
        status: OrderStatus.FILLED,
      });

      jest.spyOn(repo, 'save').mockResolvedValueOnce(mockedOrder);

      const orderResult = await service.createOrder(orderRequest);

      expect(orderResult.id).toEqual(1);
      expect(orderResult.status).toEqual(OrderStatus.FILLED);
    });
  });

  describe.skip('Given a LIMIT order type', () => {
    it('should create it successfully', async () => {
      const OrderRequest = new CreateOrderDtoExample()
        .withType(OrderType.LIMIT)
        .withLimitPrice(998)
        .build();

      const mockedMarketdata = new Marketdata();
      mockedMarketdata.close = 999;
      jest
        .spyOn(marketDataService, 'getLatestInstrumentMarketData')
        .mockResolvedValueOnce(mockedMarketdata);

      const mockedOrder = repo.create({
        userid: OrderRequest.userId,
        instrumentid: OrderRequest.instrumentId,
        size: OrderRequest.trade.stockSize(mockedMarketdata),
        price: mockedMarketdata.close,
        type: OrderRequest.type,
        side: OrderRequest.side,
      });
      jest.spyOn(repo, 'save').mockResolvedValueOnce(mockedOrder);

      const actualOrder = await service.createOrder(OrderRequest);

      expect(actualOrder.id).toEqual(1);
      expect(actualOrder.status).toEqual(OrderStatus.NEW);
    });
  });

  describe('Order rejection reasons', () => {
    it('should reject when the user has insufficient funds', async () => {
      const orderRequest = new CreateOrderDtoExample()
        .withSide(OrderSide.BUY)
        .build();

      const mockedPortfolio = new Portfolio([], []);
      mockedPortfolio.availableForTrading = 0;
      jest
        .spyOn(portfolioService, 'findUserPortfolio')
        .mockResolvedValueOnce(mockedPortfolio);

      const mockedMarketdata = new Marketdata();
      mockedMarketdata.close = 1000;
      jest
        .spyOn(marketDataService, 'getLatestInstrumentMarketData')
        .mockResolvedValueOnce(mockedMarketdata);

      const mockedOrder = repo.create({
        id: 1,
        userid: orderRequest.userId,
        instrumentid: orderRequest.instrumentId,
        size: orderRequest.trade.stockSize(mockedMarketdata),
        price: mockedMarketdata.close,
        type: orderRequest.type,
        side: orderRequest.side,
        status: OrderStatus.REJECTED,
      });
      jest.spyOn(repo, 'save').mockResolvedValueOnce(mockedOrder);

      const order = await service.createOrder(orderRequest);

      expect(order.status).toEqual(OrderStatus.REJECTED);
    });

    it.skip('should reject the order when the user has less than the order declared amount', async () => {
      const orderRequest = new CreateOrderDtoExample()
        .withSide(OrderSide.CASH_OUT)
        .withTrade(plainToInstance(CashAmountTradeDto, { amount: 1000 }))
        .build();

      const mockedMarketdata = new Marketdata();
      mockedMarketdata.close = 1000;
      jest
        .spyOn(marketDataService, 'getLatestInstrumentMarketData')
        .mockResolvedValueOnce(mockedMarketdata);

      const mockedOrder = repo.create({
        id: 1,
        userid: orderRequest.userId,
        instrumentid: orderRequest.instrumentId,
        size: orderRequest.trade.stockSize(mockedMarketdata),
        price: mockedMarketdata.close,
        type: orderRequest.type,
        side: orderRequest.side,
        status: OrderStatus.REJECTED,
      });
      jest.spyOn(repo, 'save').mockResolvedValueOnce(mockedOrder);

      const order = await service.createOrder(orderRequest);

      expect(order.status).toEqual(OrderStatus.REJECTED);
    });
  });

  describe('Given an existent order', () => {
    const orderId = 1;
    const foundOrder = plainToInstance(Order, {
      id: orderId,
      userId: 1,
      instrumentId: 1,
      size: 1,
      price: 1,
      type: OrderType.MARKET,
      side: OrderSide.BUY,
      status: OrderStatus.NEW,
      datetime: new Date(),
    });

    it('should be cancelable by the user for an order in NEW state', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(foundOrder);

      jest.spyOn(repo, 'save').mockResolvedValueOnce(
        plainToInstance(Order, {
          ...foundOrder,
          status: OrderStatus.CANCELLED,
        }),
      );

      const cancelledOrder = await service.cancelOrder(orderId);
      expect(cancelledOrder.status).toEqual(OrderStatus.CANCELLED);
    });

    it.each([OrderStatus.CANCELLED, OrderStatus.FILLED, OrderStatus.REJECTED])(
      'should fail when the users cancels an order in state %s',
      async (status) => {
        foundOrder.status = status;
        jest.spyOn(repo, 'findOneBy').mockResolvedValueOnce(foundOrder);

        await expect(service.cancelOrder(orderId)).rejects.toThrow(
          InvalidStateForCancellationError,
        );
      },
    );
  });
});
