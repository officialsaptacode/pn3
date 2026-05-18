// Mock Prisma Client to avoid ES module issues in Jest
import { mockUser, mockTrip, mockBlogPost, mockBooking } from "../test/api/mocks";

const mockPrismaClient = jest.fn().mockImplementation(() => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: mockUser,
  trip: mockTrip,
  blogPost: mockBlogPost,
  booking: mockBooking,
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
