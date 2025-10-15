import { Test, TestingModule } from '@nestjs/testing';
import { SalesTypeController } from './sales-type.controller';
import { SalesTypeService } from './sales-type.service';

describe('SalesTypeController', () => {
  let controller: SalesTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesTypeController],
      providers: [SalesTypeService],
    }).compile();

    controller = module.get<SalesTypeController>(SalesTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
