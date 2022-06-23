import { CrawlerModule } from './crawler.module';
import { CrawlerApiService } from './crawler-api/crawler-api.service';
import { CrawlerApiServiceOptions } from './crawler-api/crawler-api-service-options';
import { BlockData } from './types/block.types';
import {
  EventData,
  EventMethod,
  EventPhase,
  EventSection,
} from './types/event.types';
import {
  ExtrinsicData,
  ExtrinsicMethod,
  ExtrinsicSection,
} from './types/extrinsic.types';

export {
  CrawlerModule,
  CrawlerApiService,
  CrawlerApiServiceOptions,
  // todo: Maybe we can export these types below in a more elegant way?
  BlockData,
  EventData,
  EventMethod,
  EventPhase,
  EventSection,
  ExtrinsicData,
  ExtrinsicMethod,
  ExtrinsicSection,
};
