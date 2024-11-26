import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/pagination/dtos/PageMetaDto';
import { InstrumentQuery } from '../dtos/InstrumentQuery';
import { PaginatedDto } from 'src/common/pagination/dtos/PaginatedDto';
import { PaginationParamsDto } from '../dtos/PaginationParamsDto';
import { Instrument } from '../model/instrument.entity';

@Injectable()
export class InstrumentsService {
  public constructor(
    @InjectRepository(Instrument)
    private readonly repo: Repository<Instrument>,
  ) {}

  public async getInstruments(
    query: PaginationParamsDto & InstrumentQuery,
  ): Promise<PaginatedDto<Instrument>> {
    const queryBuilder = this.repo.createQueryBuilder('instrument');

    queryBuilder
      .orderBy('instrument.id', query.order)
      .skip(query.skip)
      .take(query.take);

    if (query.ticker) {
      queryBuilder.andWhere({ ticker: ILike(`%${query.ticker}%`) });
    }

    if (query.name) {
      queryBuilder.andWhere({ name: ILike(`%${query.name}%`) });
    }

    const [itemCount, { entities }] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.getRawAndEntities(),
    ]);

    const paginationParamsDto: PaginationParamsDto = {
      order: query.order,
      page: query.page,
      take: query.take,
      skip: query.skip,
    };

    const pageMetaDto = new PageMetaDto({ itemCount, paginationParamsDto });

    return new PaginatedDto(entities, pageMetaDto);
  }

  public async findById(id: number): Promise<Instrument> {
    return this.repo.findOneBy({
      id,
    });
  }
}
