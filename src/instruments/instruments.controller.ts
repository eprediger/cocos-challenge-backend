import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Instrument } from './instrument.entity';
import { InstrumentsService } from './instruments.service';

@Controller('instruments')
export class InstrumentsController {
  public constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  @ApiQuery({ name: 'ticker', required: false, example: 'MOLI' })
  @ApiQuery({ name: 'name', required: false })
  @ApiOkResponse({
    description: 'A list of instruments',
    type: [Instrument],
    example: [
      {
        id: 42,
        ticker: 'MOLI',
        name: 'Molinos Río de la Plata',
        type: 'ACCIONES',
      },
    ],
  })
  find(
    @Query('ticker') ticker?: string,
    @Query('name') name?: string,
  ): Promise<Instrument[]> {
    return this.instrumentsService.find({ ticker, name });
  }
}
