import { Test, TestingModule } from '@nestjs/testing';
import { PolkadotApiService } from './polkadot-api.service';

describe('PolkadotApiService', () => {
  let service: PolkadotApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolkadotApiService],
    }).compile();

    service = module.get<PolkadotApiService>(PolkadotApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
