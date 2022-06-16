import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import {
  defaultRandomServiceOptions,
  RandomServiceOptions,
} from './random-service-options';

@Injectable()
export class RandomService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  generate(): number {
    const max = Number(this.configService.getOption('max'));
    const min = Number(this.configService.getOption('min'));

    this.logger.log(`Generate in range [${min}, ${max}]`, 'RandomService');

    const range = max - min;
    return min + Math.floor(Math.random() * range);
  }
}
