import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class InstrumentQuery {
  @ApiPropertyOptional({
    name: 'ticker',
    description: 'A instrument ticker',
  })
  @IsOptional()
  @IsString()
  readonly ticker: string;

  @ApiPropertyOptional({
    name: 'name',
    description: 'A partial instrument name to be match',
  })
  @IsOptional()
  @IsString()
  readonly name: string;
}
