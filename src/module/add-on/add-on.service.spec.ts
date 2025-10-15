import { Test, TestingModule } from '@nestjs/testing';
import { AddOnService } from './add-on.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddOn } from '@repository/add-on.entity';
import { AddOnGroup } from '@repository/add-on-group.entity';

describe('AddOnService', () => {
  let service: AddOnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddOnService,
        {
          provide: getRepositoryToken(AddOn),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AddOnGroup),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AddOnService>(AddOnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
