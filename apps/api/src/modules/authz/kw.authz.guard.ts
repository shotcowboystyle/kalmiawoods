import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IS_PUBLIC_KEY } from '@/modules/auth/decorators/public.decorator';

import { AbilityService } from './ability.service';

@Injectable()
export class kwAuthzGuard implements CanActivate {
  private userId!: string;
  private fieldName!: string;

  constructor(
    private reflector: Reflector,
    private abilityService: AbilityService,
  ) {}

  private readonly logger: Logger = new Logger(kwAuthzGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    if (ctx.getContext()) {
      const { user } = ctx.getContext().req;
      const { fieldName } = ctx.getInfo();

      this.logger.log('ctx info field nodes: ', ctx.getInfo().fieldNodes);
      this.logger.log('ctx info: ', ctx.getContext());

      user ? (this.userId = user.userId) : (this.userId = '');
      this.fieldName = fieldName;
    }

    this.logger.log('this is the graphql user: ', this.userId);
    this.logger.log('this is the fieldName: ', this.fieldName);

    const userAbility = this.abilityService.getRulesForUser(this.userId);
    return userAbility.can('read', this.fieldName);
  }
}
