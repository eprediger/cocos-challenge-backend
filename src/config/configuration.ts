import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsSemVer,
  IsString,
  IsUrl
} from 'class-validator';

export class Configuration {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  readonly PORT: number;

  @IsSemVer()
  @IsNotEmpty()
  readonly VERSION: string = process.env.npm_package_version;

  @IsUrl()
  @IsString()
  @IsNotEmpty()
  readonly DB_HOST: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  readonly DB_PORT: number;

  @IsNotEmpty()
  readonly DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  readonly DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  readonly DB_DATABASE: string;
}
