import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  constructor() {}

  public async ping() {
    return 'pong';
  }
}
