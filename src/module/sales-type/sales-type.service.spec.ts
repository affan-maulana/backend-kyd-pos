import { Test, TestingModule } from '@nestjs/testing';
import { SalesTypeService } from './sales-type.service';

describe('SalesTypeService', () => {
  let service: SalesTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesTypeService],
    }).compile();

    service = module.get<SalesTypeService>(SalesTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
