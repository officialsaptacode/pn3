// Mock Prisma Client to avoid ES module issues in Jest
const mockPrismaClient = jest.fn().mockImplementation(() => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}));

jest.mock("@/generated/client", () => ({
  PrismaClient: mockPrismaClient,
}));

jest.mock("@/generated", () => {
  const actual = jest.requireActual("@/generated");
  return {
    ...actual,
    PrismaClient: mockPrismaClient,
  };
});

// Mock Prisma adapter
jest.mock("@prisma/adapter-pg", () => ({
  PrismaPg: jest.fn(),
}));

// Mock argon2
jest.mock("argon2", () => ({
  hash: jest.fn().mockResolvedValue("hashed_data"),
  verify: jest.fn().mockResolvedValue(true),
}));

// @nestjs/bullmq v12 is ESM-only, which Jest's CJS runtime cannot parse.
// The InjectQueue stub keeps Nest's self-declared-dependency metadata so the
// queue token still resolves in unit tests.
jest.mock("@nestjs/bullmq", () => {
  const SELF_DECLARED_DEPS_METADATA = "self:paramtypes";
  const InjectQueue = (queue: string) => (target: any, key: any, index?: number) => {
    const types = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, target, key) || [];
    types.push({ index, param: queue });
    Reflect.defineMetadata(SELF_DECLARED_DEPS_METADATA, types, target, key);
  };

  return {
    BullModule: { registerQueue: jest.fn(() => ({})) },
    InjectQueue,
    Processor: () => () => undefined,
    WorkerHost: class {},
  };
});

// uuid v13 is ESM-only too.
jest.mock("uuid", () => ({ v4: () => "00000000-0000-4000-8000-000000000000" }));
