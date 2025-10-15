import { Test, TestingModule } from '@nestjs/testing';
import { BusinessTypeController } from './business-type.controller';

describe('businessTypeController', () => {
  let controller: BusinessTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessTypeController],
    }).compile();

    controller = module.get<BusinessTypeController>(BusinessTypeController);
  });

  it('should be get business type', () => {
    expect(controller).toBeDefined();
    const response = controller.findAll({ page: 1, limit: 10, search: '' });
    expect(response).toBe('Get Business Type');
  });
});
