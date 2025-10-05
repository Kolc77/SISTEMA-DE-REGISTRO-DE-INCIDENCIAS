import { Test, TestingModule } from '@nestjs/testing';
import { CorporacionesController } from './corporaciones.controller';

describe('CorporacionesController', () => {
  let controller: CorporacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporacionesController],
    }).compile();

    controller = module.get<CorporacionesController>(CorporacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
