import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { RegisterUserDto } from './application/use-cases/dtos/register-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let registerUserUseCase: RegisterUserUseCase;

  const mockAuthService = {};
  const mockRegisterUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
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

      expect(result).toEqual({
        success: true,
        user: {
          id: mockUserResult.id,
          name: mockUserResult.name,
          email: mockUserResult.email,
          role: mockUserResult.role,
          createdAt: mockUserResult.createdAt,
        },
      });
      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('should return error failure on exception', async () => {
      const dto: RegisterUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const errorMessage = 'El correo electrónico ya se encuentra registrado.';
      mockRegisterUserUseCase.execute.mockRejectedValue(new Error(errorMessage));

      const result = await authController.registerUser(dto);

      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });
    });
  });

  describe('validateToken', () => {
    it('should return isValid true for correct token', async () => {
      const result = await authController.validateToken({ token: 'mi-token-secreto-123' });
      expect(result.isValid).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should return isValid false for incorrect token', async () => {
      const result = await authController.validateToken({ token: 'invalid-token' });
      expect(result.isValid).toBe(false);
    });
  });
});

