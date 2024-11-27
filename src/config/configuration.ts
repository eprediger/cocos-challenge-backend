import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsSemVer,
  IsString,
  IsUrl,
} from 'class-validator';

export class Configuration {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => Number)
  readonly PORT: number;

  @IsSemVer()
  @IsNotEmpty()
  @IsDefined()
  readonly VERSION: string = process.env.npm_package_version;

  @IsUrl()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly DB_HOST: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => Number)
  readonly DB_PORT: number;

  @IsNotEmpty()
  @IsDefined()
  readonly DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly DB_DATABASE: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsNotEmpty()
  @IsDefined()
  readonly DB_LOGGING: boolean;
}
