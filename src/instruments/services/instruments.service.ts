import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedDto } from 'src/common/pagination/dtos/paginated.dto';
import { ILike, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/pagination/dtos/page-meta.dto';
import { PaginationParamsDto } from '../../common/pagination/dtos/pagination-params.dto';
import { InstrumentQuery } from '../dtos/instrument-query.dto';
import { Instrument } from '../model/instrument.entity';

@Injectable()
export class InstrumentsService {
  public constructor(
    @InjectRepository(Instrument)
    private readonly repo: Repository<Instrument>,
  ) {}

  public async getInstruments(
    params: InstrumentQuery,
    pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Instrument>> {
    const queryBuilder = this.repo.createQueryBuilder('instrument');

    queryBuilder
      .orderBy('instrument.id', pagination.order)
      .skip(pagination.skip)
      .take(pagination.take);

    if (params.ticker) {
      queryBuilder.andWhere({ ticker: ILike(`%${params.ticker}%`) });
    }

    if (params.name) {
      queryBuilder.andWhere({ name: ILike(`%${params.name}%`) });
    }

    const [itemCount, { entities }] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.getRawAndEntities(),
    ]);

    const paginationParamsDto: PaginationParamsDto = {
      order: pagination.order,
      page: pagination.page,
      take: pagination.take,
      skip: pagination.skip,
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
