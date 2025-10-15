import { Test, TestingModule } from '@nestjs/testing';
import { GratuityController } from './gratuity.controller';
import { GratuityService } from './gratuity.service';

describe('GratuityController', () => {
  let controller: GratuityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GratuityController],
      providers: [GratuityService],
    }).compile();

    controller = module.get<GratuityController>(GratuityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
