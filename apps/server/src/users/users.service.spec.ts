import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        users: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const mockUsers = [
                {
                    id: 1,
                    email: 'test@example.com',
                    userName: 'testuser',
                    role: 'USER',
                    createdAt: new Date(),
                },
                {
                    id: 2,
                    email: 'test2@example.com',
                    userName: 'testuser2',
                    role: 'ADMIN',
                    createdAt: new Date(),
                },
            ];

            mockPrismaService.users.findMany.mockResolvedValue(mockUsers);

            const result = await service.findAll();

            expect(result).toEqual(mockUsers);
            expect(prismaService.users.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    email: true,
                    userName: true,
                    role: true,
                    createdAt: true,
                },
            });
        });

        it('should return empty array when no users exist', async () => {
            mockPrismaService.users.findMany.mockResolvedValue([]);

            const result = await service.findAll();

            expect(result).toEqual([]);
        });
    });
});
