import { HttpException, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import type { FastifyRequest } from 'fastify';

/**
 * Import and provide GraphQL related configuration.
 *
 * @module
 */
@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      errorFormatter: (execution) => {
        const [error] = execution.errors; // take first error
        const originalError = error?.originalError;
        if (originalError instanceof HttpException)
          return {
            statusCode: originalError.getStatus(),
            response: { data: originalError.getResponse() as any },
          };
        return { statusCode: 400, response: execution };
      },
      graphiql: false,
      ide: false,
      sortSchema: true,
      path: '/graphql',
      // autoSchemaFile: "./../frontend/schema.graphql",
      autoSchemaFile: './src/generated/schema.graphql',
      context: (request: FastifyRequest) => ({
        raw: request.raw,
      }),
    }),
  ],
  // exports: [GraphQLModule],
})
export class GraphQlConfigModule {}
