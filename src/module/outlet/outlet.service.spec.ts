import { Test, TestingModule } from '@nestjs/testing';
import { OutletService } from './outlet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Outlet } from '@module/outlet/entities/outlet.entity';

describe('OutletService', () => {
  let service: OutletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutletService,
        {
          provide: getRepositoryToken(Outlet),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OutletService>(OutletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
