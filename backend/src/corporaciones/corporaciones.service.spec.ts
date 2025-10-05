import { Test, TestingModule } from '@nestjs/testing';
import { CorporacionesService } from './corporaciones.service';

describe('CorporacionesService', () => {
  let service: CorporacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorporacionesService],
    }).compile();

    service = module.get<CorporacionesService>(CorporacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
