import { Prisma } from '@prisma/client';

/**
 * Middleware to change all DELETE actions for Soft deletes instead
 *
 * @returns Promise<void>
 */
export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next) => {
    const result = await next(params);

    if (params.action == 'delete') {
      params.action = 'update';
      params.args['data'] = { deletedAt: new Date().toJSON() };
    } else if (params.action == 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data != undefined) {
        params.args.data['deletedAt'] = new Date().toJSON();
      } else {
        params.args['data'] = { deletedAt: new Date().toJSON() };
      }
    }

    return result;
  };
}

/**
 * Middleware to filter all soft deleted records out of responses
 *
 * @returns Promise<void>
 */
export function filterSoftDeleteMiddleware(): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next) => {
    const result = await next(params);

    const actions = ['findFirst', 'findMany'];

    if (params.action === 'findUnique') {
      params.action = 'findFirst';
    }

    if (actions.includes(params.action)) {
      // in case deleted records are not explicitly requested
      // return only non soft-deleted records
      if (!params.args.where['deleted']) {
        params.args.where['deletedAt'] = null;
      }

      delete params.args.where['deleted'];
    }

    return result;
  };
}
