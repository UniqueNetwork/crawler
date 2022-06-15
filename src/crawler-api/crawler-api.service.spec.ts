import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerApiService } from './crawler-api.service';

describe('CrawlerApiService', () => {
  let service: CrawlerApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlerApiService],
    }).compile();

    service = module.get<CrawlerApiService>(CrawlerApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
