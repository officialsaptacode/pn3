import { describe, expect, it } from "vitest";
import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photoUrl: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  yearsExperience: z.coerce.number().min(0, "Years of experience must be at least 0"),
  certifications: z.string().optional(),
  languages: z.string().optional(),
});

describe("authorSchema", () => {
  it("should validate valid author data", () => {
    const result = authorSchema.safeParse({
      name: "John Doe",
      bio: "Experienced mountain guide with 10 years of expertise",
      yearsExperience: 5,
    });
    expect(result.success).toBe(true);
  });

  it("should reject name that is too short", () => {
    const result = authorSchema.safeParse({
      name: "J",
      bio: "Experienced mountain guide",
      yearsExperience: 5,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Name must be at least 2 characters");
    }
  });

  it("should reject bio that is too short", () => {
    const result = authorSchema.safeParse({
      name: "John Doe",
      bio: "Short",
      yearsExperience: 5,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Bio must be at least 10 characters");
    }
  });

  it("should reject invalid email", () => {
    const result = authorSchema.safeParse({
      name: "John Doe",
      bio: "Experienced mountain guide",
      email: "invalid-email",
      yearsExperience: 5,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Invalid email");
    }
  });

  it("should accept empty string for email", () => {
    const result = authorSchema.safeParse({
      name: "John Doe",
      bio: "Experienced mountain guide",
      email: "",
      yearsExperience: 5,
    });
    expect(result.success).toBe(true);
  });

  it("should coerce years of experience from string to number", () => {
    const result = authorSchema.safeParse({
      name: "John Doe",
      bio: "Experienced mountain guide",
      yearsExperience: "10",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.yearsExperience).toBe(10);
      expect(typeof result.data.yearsExperience).toBe("number");
    }
  });

  it("should reject negative years of experience", () => {
    const result = authorSchema.safeParse({
      name: "John Doe",
      bio: "Experienced mountain guide",
      yearsExperience: -5,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Years of experience must be at least 0");
    }
  });
});
