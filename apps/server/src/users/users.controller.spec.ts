import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUsersService = {
        findAll: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
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
            ];

            mockUsersService.findAll.mockResolvedValue(mockUsers);

            const result = await controller.findAll();

            expect(result).toEqual(mockUsers);
            expect(service.findAll).toHaveBeenCalled();
        });
    });
});
