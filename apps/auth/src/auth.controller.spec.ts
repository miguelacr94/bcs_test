import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase, LoginUserUseCase, RefreshTokenUseCase, LogoutUseCase, UpdateUserUseCase } from './application/use-cases';
import { AuthService } from './auth.service';
import { RpcException } from '@nestjs/microservices';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: LoginUserUseCase;
  let registerUseCase: RegisterUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: RegisterUserUseCase, useValue: { execute: jest.fn() } },
        { provide: LoginUserUseCase, useValue: { execute: jest.fn() } },
        { provide: RefreshTokenUseCase, useValue: { execute: jest.fn() } },
        { provide: LogoutUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateUserUseCase, useValue: { execute: jest.fn() } },
        { provide: 'TokenServicePort', useValue: {} },
        { provide: 'UserRepositoryPort', useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUserUseCase>(LoginUserUseCase);
    registerUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('loginUser', () => {
    it('should login and return tokens', async () => {
      const dto = { email: 'admin@test.com', password: 'password' };
      const expectedTokens = { accessToken: 'token123', refreshToken: 'refresh123', user: { id: '1' } as any };
      
      jest.spyOn(loginUseCase, 'execute').mockResolvedValue(expectedTokens);

      const result = await controller.loginUser(dto);
      expect(result).toEqual(expectedTokens);
      expect(loginUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('should throw RpcException if credentials are bad', async () => {
      const dto = { email: 'admin@test.com', password: 'bad' };
      jest.spyOn(loginUseCase, 'execute').mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.loginUser(dto)).rejects.toThrow(RpcException);
    });
  });
});
