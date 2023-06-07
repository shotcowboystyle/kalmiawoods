import { Query, Resolver } from '@nestjs/graphql';

import { Public } from '@/modules/auth/decorators/public.decorator';

import { AppService } from '../app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Query(() => String)
  public getVersion(): string {
    return this.appService.getVersion();
  }
}
