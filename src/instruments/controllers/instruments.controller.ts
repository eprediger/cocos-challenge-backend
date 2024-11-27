import {
  Controller,
  Get,
  Query
} from '@nestjs/common';
import { PaginatedDto } from 'src/common/pagination/dtos/PaginatedDto';
import { Instrument } from 'src/instruments/model/instrument.entity';
import { InstrumentsService } from 'src/instruments/services/instruments.service';
import { ApiPaginatedResponse } from '../../common/pagination/decorators/ApiPaginatedResponse';
import { PaginationParamsDto } from '../../common/pagination/dtos/PaginationParamsDto';
import { InstrumentQuery } from '../dtos/InstrumentQuery';

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
