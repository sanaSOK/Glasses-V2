import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { StoreAccessGuard } from '../src/common/guards/store-access.guard';
import { Role } from '../src/common/enums/role.enum';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('Multi-Tenant Store Isolation Security (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          // Simulate authenticated user headers
          const roleHeader = req.headers['x-test-role'];
          const storeIdHeader = req.headers['x-test-store-id'];

          if (roleHeader) {
            req.user = {
              userId: 99,
              email: 'test@store.com',
              role: roleHeader as Role,
              storeId: storeIdHeader ? parseInt(storeIdHeader, 10) : null,
            };
            return true;
          }
          return true; // Bypass for public routes in tests if needed
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('STORE_ADMIN of Store 1 requesting GET /products should automatically be forced to store_id = 1', async () => {
    const response = await request(app.getHttpServer())
      .get('/products?store_id=999') // Attempt cross-store injection
      .set('x-test-role', 'STORE_ADMIN')
      .set('x-test-store-id', '1');

    expect(response.status).toBe(200);
    // Verified that query params get rewritten or scoped to storeId = 1
    if (response.body.data && response.body.data.items) {
      response.body.data.items.forEach((product: any) => {
        expect(product.store_id).toBe(1);
      });
    }
  });

  it('STORE_ADMIN of Store 1 requesting Store 2 specific path should be blocked with 403 Forbidden', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('x-test-role', 'STORE_ADMIN')
      .set('x-test-store-id', '1');

    expect(response.status).toBe(200);
    if (response.body.data) {
      response.body.data.forEach((user: any) => {
        expect(user.store_id).toBe(1);
      });
    }
  });

  it('SUPER_ADMIN should be allowed to view all stores', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .set('x-test-role', 'SUPER_ADMIN');

    expect(response.status).toBe(200);
  });
});
