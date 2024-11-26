import { Controller, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/pagination/dtos/PaginatedDto';
import { Instrument } from 'src/instruments/model/instrument.entity';
import { InstrumentsService } from 'src/instruments/services/instruments.service';
import { ApiPaginatedResponse } from '../../common/pagination/decorators/ApiPaginatedResponse';
import { InstrumentQuery } from '../dtos/InstrumentQuery';
import { PaginationParamsDto } from '../../common/pagination/dtos/PaginationParamsDto';

@Controller('instruments')
@ApiExtraModels(PaginatedDto)
export class InstrumentsController {
  public constructor(private readonly service: InstrumentsService) {}

  @Get()
  @ApiQuery({ type: PaginationParamsDto })
  @ApiQuery({
    name: 'ticker',
    required: false,
    description: 'A instrument ticker',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'A partial instrument name to be match',
  })
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
    @Query() params: InstrumentQuery & PaginationParamsDto,
  ): Promise<PaginatedDto<Instrument>> {
    return this.service.getInstruments(params);
  }
}
