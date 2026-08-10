import { Test, TestingModule } from '@nestjs/testing';
import { UserCoreController } from './user-core.controller';
import { UserCoreService } from './user-core.service';
import { UserInfo } from './infrastructure/adapters/mock-user.adapter';

describe('UserCoreController', () => {
  let controller: UserCoreController;
  let service: UserCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCoreController],
      providers: [
        {
          provide: UserCoreService,
          useValue: {
            getUserByDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserCoreController>(UserCoreController);
    service = module.get<UserCoreService>(UserCoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getByDocument', () => {
    it('should return a user if it exists', async () => {
      const mockUser = { id: '1', document: '111111111' };
      jest
        .spyOn(service, 'getUserByDocument')
        .mockResolvedValue(mockUser as unknown as UserInfo);

      const result = await controller.getByDocument({ document: '111111111' });
      expect(result).toEqual(mockUser);
      expect(service.getUserByDocument).toHaveBeenCalledWith('111111111');
    });

    it('should return null if user does not exist', async () => {
      jest
        .spyOn(service, 'getUserByDocument')
        .mockResolvedValue(null as unknown as UserInfo);

      const result = await controller.getByDocument({ document: '000000000' });
      expect(result).toBeNull();
    });
  });
});
