import { Controller, Get, Query } from '@nestjs/common';
import { PaginatedDto } from 'src/common/pagination/dtos/paginated.dto';
import { Instrument } from 'src/instruments/model/instrument.entity';
import { InstrumentsService } from 'src/instruments/services/instruments.service';
import { ApiPaginatedResponse } from '../../common/pagination/decorators/api-paginated-response';
import { PaginationParamsDto } from '../../common/pagination/dtos/pagination-params.dto';
import { InstrumentQuery } from '../dtos/instrument-query.dto';

@Controller('instruments')
export class InstrumentsController {
  public constructor(private readonly service: InstrumentsService) {}

  @Get()
  @ApiPaginatedResponse(Instrument, {
    description: 'A paginated list of instruments',
    example: {
      meta: {
        page: 1,
        take: 1,
        itemCount: 1,
        pageCount: 3,
        hasPreviousPage: false,
        hasNextPage: true,
      },
      data: [
        {
          id: 42,
          ticker: 'MOLI',
          name: 'Molinos Río de la Plata',
          type: 'ACCIONES',
        },
      ],
    },
  })
  find(
    @Query() params: InstrumentQuery,
    @Query() pagination: PaginationParamsDto,
  ): Promise<PaginatedDto<Instrument>> {
    return this.service.getInstruments(params, pagination);
  }
}
