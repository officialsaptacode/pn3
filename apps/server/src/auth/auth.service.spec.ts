import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as argon from "argon2";
import { PrismaService } from "@/prisma/prisma.service";
import { AuthService } from "./auth.service";

jest.mock("argon2");

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue("token"),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue("secret"),
};

describe("AuthService", () => {
  let service: AuthService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signup", () => {
    // Add more detailed tests here if desired
    it("should return tokens on signup", async () => {
      (argon.hash as jest.Mock).mockResolvedValue("hashedPwd");
      prisma.user.create.mockResolvedValue({ id: 1, email: "test@test.com", role: "USER" });

      const result = await service.signup({
        email: "test@test.com",
        password: "pwd",
        userName: "user",
      });
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });
});
