import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class InstrumentQuery {
  @ApiPropertyOptional({
    name: 'ticker',
    description: 'A instrument ticker',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  readonly ticker: string;

  @ApiPropertyOptional({
    name: 'name',
    description: 'A partial instrument name to be match',
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  readonly name: string;
}
