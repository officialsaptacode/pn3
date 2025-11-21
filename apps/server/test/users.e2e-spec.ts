import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import cookieParser from 'cookie-parser';

describe('Users E2E Tests', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );

        await app.init();

        prisma = app.get(PrismaService);
        await prisma.cleanDatabase();

        // Create a test user and get access token
        const signupResponse = await request(app.getHttpServer())
            .post('/api/auth/signup')
            .send({
                email: 'test@example.com',
                userName: 'testuser',
                password: 'password123',
            });

        accessToken = signupResponse.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /api/users', () => {
        it('should get all users when authenticated', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('email');
            expect(response.body[0]).toHaveProperty('userName');
            expect(response.body[0]).toHaveProperty('role');
            expect(response.body[0]).toHaveProperty('createdAt');
            expect(response.body[0]).not.toHaveProperty('hash');
            expect(response.body[0]).not.toHaveProperty('hashedRt');
        });

        it('should fail without authentication', async () => {
            await request(app.getHttpServer())
                .get('/api/users')
                .expect(401);
        });

        it('should fail with invalid token', async () => {
            await request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });
});
