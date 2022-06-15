import { Injectable, Logger } from '@nestjs/common';
import {
  defaultRandomServiceOptions,
  RandomServiceOptions,
} from './random-service-options';

@Injectable()
export class RandomService {
  private options: RandomServiceOptions;
  private logger: Logger;

  init(options: Partial<RandomServiceOptions>, logger: Logger) {
    this.options = { ...defaultRandomServiceOptions, ...options };
    this.logger = logger;
  }

  generate(): number {
    this.logger.log(
      `Running the random number service between ${this.options.min} and ${this.options.max}`,
    );

    const range = this.options.max - this.options.min;
    return this.options.min + Math.floor(Math.random() * range);
  }
}
