import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';

jest.mock('argon2');

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        users: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
        },
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'JWT_SECRET_KEY') return 'test-secret';
            if (key === 'JWT_REFRESH_SECRET_KEY') return 'test-refresh-secret';
            return null;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signin', () => {
        it('should sign in a user and return tokens', async () => {
            const dto = { userName: 'testuser', password: 'password123' };
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                userName: 'testuser',
                hash: 'hashedpassword',
                role: 'USER',
            };

            mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
            (argon.verify as jest.Mock).mockResolvedValue(true);
            (argon.hash as jest.Mock).mockResolvedValue('hashedRefreshToken');
            mockJwtService.signAsync
                .mockResolvedValueOnce('access-token')
                .mockResolvedValueOnce('refresh-token');

            const result = await service.signin(dto);

            expect(result).toEqual({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                role: 'USER',
            });
            expect(mockPrismaService.users.findUnique).toHaveBeenCalledWith({
                where: { userName: dto.userName },
            });
        });

        it('should throw ForbiddenException if user not found', async () => {
            const dto = { userName: 'nonexistent', password: 'password123' };
            mockPrismaService.users.findUnique.mockResolvedValue(null);

            await expect(service.signin(dto)).rejects.toThrow(ForbiddenException);
        });

        it('should throw ForbiddenException if password is incorrect', async () => {
            const dto = { userName: 'testuser', password: 'wrongpassword' };
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                userName: 'testuser',
                hash: 'hashedpassword',
                role: 'USER',
            };

            mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
            (argon.verify as jest.Mock).mockResolvedValue(false);

            await expect(service.signin(dto)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('signup', () => {
        it('should create a new user and return tokens', async () => {
            const dto = {
                userName: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
            };
            const mockUser = {
                id: 1,
                email: dto.email,
                userName: dto.userName,
                hash: 'hashedpassword',
                role: 'USER',
            };

            (argon.hash as jest.Mock).mockResolvedValue('hashedpassword');
            mockPrismaService.users.create.mockResolvedValue(mockUser);
            mockJwtService.signAsync
                .mockResolvedValueOnce('access-token')
                .mockResolvedValueOnce('refresh-token');

            const result = await service.signup(dto);

            expect(result).toEqual({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
                role: 'USER',
            });
            expect(mockPrismaService.users.create).toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should clear refresh token hash', async () => {
            const userId = 1;
            mockPrismaService.users.updateMany.mockResolvedValue({ count: 1 });

            await service.logout(userId);

            expect(mockPrismaService.users.updateMany).toHaveBeenCalledWith({
                where: {
                    id: userId,
                    hashedRt: {
                        not: null,
                    },
                },
                data: {
                    hashedRt: null,
                },
            });
        });
    });
});
