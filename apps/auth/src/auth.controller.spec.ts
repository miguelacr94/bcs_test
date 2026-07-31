import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserUseCase, LoginUserUseCase, RefreshTokenUseCase, LogoutUseCase, UpdateUserUseCase } from './application/use-cases';
import { RegisterUserDto } from './application/use-cases/dtos/register-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let registerUserUseCase: RegisterUserUseCase;

  const mockAuthService = {};
  const mockRegisterUserUseCase = {
    execute: jest.fn(),
  };

  const mockTokenService = {
    verifyToken: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: LoginUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: RefreshTokenUseCase, useValue: mockRegisterUserUseCase },
        { provide: LogoutUseCase, useValue: mockRegisterUserUseCase },
        { provide: UpdateUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: 'TokenServicePort', useValue: mockTokenService },
        { provide: 'UserRepositoryPort', useValue: { findById: jest.fn().mockResolvedValue({ id: 'user-id', email: 'test@example.com' }) } },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    registerUserUseCase = app.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUserResult = {
        id: 'mock-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        createdAt: new Date(),
      };

      mockRegisterUserUseCase.execute.mockResolvedValue(mockUserResult);

      const result = await authController.registerUser(dto);

      expect(result).toEqual(mockUserResult);
      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('should throw RpcException on error', async () => {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const errorMessage = 'El correo electrónico ya se encuentra registrado.';
      mockRegisterUserUseCase.execute.mockRejectedValue(new Error(errorMessage));

      await expect(authController.registerUser(dto)).rejects.toThrow(errorMessage);
    });
  });

  describe('validateToken', () => {
    it('should return isValid true for correct token', async () => {
      mockTokenService.verifyToken.mockResolvedValue({ id: 'user-id' });
      const result = await authController.validateToken({ token: 'mi-token-secreto-123' });
      expect(result.isValid).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should return isValid false for incorrect token', async () => {
      mockTokenService.verifyToken.mockRejectedValue(new Error('Invalid token'));
      const result = await authController.validateToken({ token: 'invalid-token' });
      expect(result.isValid).toBe(false);
    });
  });
});
