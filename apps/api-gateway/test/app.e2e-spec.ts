import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { of } from 'rxjs';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/interceptors/transform.interceptor';

describe('API Gateway (e2e)', () => {
  let app: INestApplication<App>;

  // Mock de los clientes Redis para no requerir microservicios reales levantados
  const mockAuthClient = {
    send: jest.fn(),
  };

  const mockTracingClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('AUTH_SERVICE')
      .useValue(mockAuthClient)
      .overrideProvider('TRACING_SERVICE')
      .useValue(mockTracingClient)
      .overrideProvider('CUSTOMER_SERVICE')
      .useValue({ send: jest.fn() })
      .overrideProvider('APPLICATIONS_SERVICE')
      .useValue({ send: jest.fn() })
      .overrideProvider('USER_CORE_SERVICE')
      .useValue({ send: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();

    // Aplicamos los mismos pipes y filtros que main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe('Healthcheck', () => {
    it('/api/v1 (GET) should return API info', () => {
      return request(app.getHttpServer())
        .get('/api/v1/')
        .expect(200)
        .expect((res) => {
          expect(res.body.statusCode).toBe(200);
          expect(res.body.data).toBe('Hello World!');
        });
    });
  });

  describe('Auth Flow', () => {
    it('/api/v1/auth/login (POST) should return tokens on valid credentials', () => {
      const mockLoginResponse = {
        accessToken: 'mocked_jwt_token',
        user: { email: 'admin@banco.com', role: 'ADMIN' },
      };

      mockAuthClient.send.mockReturnValue(of(mockLoginResponse));

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@banco.com', password: 'Password123!' })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.data.accessToken).toBe('mocked_jwt_token');
          expect(mockAuthClient.send).toHaveBeenCalled();
        });
    });

    it('/api/v1/auth/login (POST) should fail with 400 on invalid payload', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'no_es_un_email', password: '' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message[0]).toContain('formato válido');
        });
    });
  });
});
