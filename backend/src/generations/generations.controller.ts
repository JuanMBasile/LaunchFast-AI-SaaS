import { Controller, Get, Param, Query, UseGuards, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GenerationsService } from './generations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Generations')
@Controller('generations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GenerationsController {
  constructor(private generationsService: GenerationsService) {}

  @Get()
  @ApiOperation({ summary: 'List user generations (paginated)' })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.generationsService.findAllByUser(user.sub, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one generation by ID' })
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.generationsService.findOneByUser(id, user.sub);
  }
}
