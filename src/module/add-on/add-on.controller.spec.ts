import { Test, TestingModule } from '@nestjs/testing';
import { AddOnController } from './add-on.controller';
import { AddOnService } from './add-on.service';

describe('AddOnController', () => {
  let controller: AddOnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddOnController],
      providers: [AddOnService],
    }).compile();

    controller = module.get<AddOnController>(AddOnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
