import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ProductsModule } from './../src/products.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should compile and boot', () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
