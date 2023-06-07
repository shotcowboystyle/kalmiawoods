import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { AppService } from '../app.service';

/** Base app-related routing, prefixed with `/{BACKEND_BASE_PATH}/` */
@Controller()
export class AppController {
  /**
   * Initialize controller dependencies.
   * @param appService The injected `AppService` instance.
   */
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    description: 'Get the app version',
    summary: AppController.prototype.getVersion.name,
  })
  @ApiOkResponse({
    description: 'Return current version',
    type: String,
  })
  // @ApiBadRequestResponse(toSwaggerError(NormalException.UNEXPECTED()))
  @Get('version')
  getVersion(): string {
    return this.appService.getVersion();
  }
}
