import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import cookieParser from 'cookie-parser';

describe('Auth E2E Tests', () => {
    let app: INestApplication;
    let prisma: PrismaService;

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
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Auth', () => {
        const dto = {
            email: 'test@example.com',
            userName: 'testuser',
            password: 'password123',
        };

        it('should signup a new user', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/signup')
                .send(dto)
                .expect(201);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            expect(response.body).toHaveProperty('role');
        });

        it('should signin with correct credentials', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/signin')
                .send({
                    userName: dto.userName,
                    password: dto.password,
                })
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
        });
    });
});
