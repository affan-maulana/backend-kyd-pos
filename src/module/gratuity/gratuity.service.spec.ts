import { Test, TestingModule } from '@nestjs/testing';
import { GratuityService } from './gratuity.service';

describe('GratuityService', () => {
  let service: GratuityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GratuityService],
    }).compile();

    service = module.get<GratuityService>(GratuityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
