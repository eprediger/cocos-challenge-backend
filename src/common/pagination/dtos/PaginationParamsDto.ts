import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageOrder } from 'src/common/pagination/constants/PageOrder';

const TAKE_MAXIMUM = 50;
const TAKE_DEFAULT = 10;
const TAKE_MINIMUM = 1;
const PAGE_MINIMUM = 1;
const PAGE_DEFAULT = 1;

export class PaginationParamsDto {
  @ApiPropertyOptional({ enum: PageOrder, default: PageOrder.ASC })
  @IsEnum(PageOrder)
  @IsOptional()
  readonly order: PageOrder = PageOrder.ASC;

  @ApiPropertyOptional({
    minimum: PAGE_MINIMUM,
    default: PAGE_DEFAULT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PAGE_MINIMUM)
  @IsOptional()
  readonly page: number = PAGE_DEFAULT;

  @ApiPropertyOptional({
    minimum: TAKE_MINIMUM,
    maximum: TAKE_MAXIMUM,
    default: TAKE_DEFAULT,
  })
  @Type(() => Number)
  @IsInt()
  @Min(TAKE_MINIMUM)
  @Max(TAKE_MAXIMUM)
  @IsOptional()
  readonly take: number = TAKE_DEFAULT;

  @Expose()
  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
