import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupSwagger(app: INestApplication, path: string) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter Docs')
    .setDescription('The NestJS Starter API description')
    .setContact(
      'Kalmia Woods',
      'https://www.github.com/shotcowboystyle',
      'curt.blanton@gmail.com',
    )
    .addServer(`http://localhost:8080`, 'Local Server')
    .setVersion('1.0.0')
    .addBearerAuth(undefined, 'Access Token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
