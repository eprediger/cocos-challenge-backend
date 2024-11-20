import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { Portfolio } from './portfolio';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  public constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':userId')
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'The user id portfolio',
  })
  @ApiOkResponse({
    description: 'A user portfolio',
    type: Portfolio,
  })
  public findUserPortfolio(@Param('userId') userId: number) {
    return this.portfolioService.findUserPortfolio(userId);
  }
}
