import { Controller, Get, Req, Res } from '@nestjs/common';

import { IFastifyReply, IFastifyRequest } from '@/common/@types';

import { Public } from '../decorators/public.decorator';
import { AccessTokenDTO } from './dtos/access-token.dto';
import { RefreshService } from './refresh.service';

@Controller('refresh')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) {}

  @Public()
  @Get()
  async refresh(
    @Req() request: IFastifyRequest,
    @Res({ passthrough: true }) reply: IFastifyReply,
  ): Promise<AccessTokenDTO> {
    return await this.refreshService.refresh(request, reply);
  }
}
