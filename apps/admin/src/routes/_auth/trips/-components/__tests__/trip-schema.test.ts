import { describe, expect, it } from "vitest";
import { z } from "zod";

const tripSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  overview: z.string().min(10, "Overview must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "DIFFICULT", "EXTREME"]),
  status: z.enum(["ACTIVE", "ARCHIVE"]),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day"),
  maxAltitude: z.coerce.number().min(0),
  region: z.string().min(2),
  groupSizeMin: z.coerce.number().min(1),
  groupSizeMax: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
});

describe("tripSchema", () => {
  const validTripData = {
    title: "Everest Base Camp Trek",
    description: "Amazing trek to Everest Base Camp",
    overview: "Detailed overview of the trek to Everest Base Camp",
    difficulty: "MODERATE" as const,
    status: "ACTIVE" as const,
    duration: 14,
    maxAltitude: 5364,
    region: "Khumbu",
    groupSizeMin: 2,
    groupSizeMax: 12,
    price: 50000,
  };

  it("should validate valid trip data", () => {
    const result = tripSchema.safeParse(validTripData);
    expect(result.success).toBe(true);
  });

  it("should coerce numeric fields from strings", () => {
    const result = tripSchema.safeParse({
      ...validTripData,
      duration: "14",
      maxAltitude: "5364",
      groupSizeMin: "2",
      groupSizeMax: "12",
      price: "50000",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.duration).toBe(14);
      expect(result.data.maxAltitude).toBe(5364);
      expect(result.data.groupSizeMin).toBe(2);
      expect(result.data.groupSizeMax).toBe(12);
      expect(result.data.price).toBe(50000);
    }
  });

  it("should reject invalid difficulty level", () => {
    const result = tripSchema.safeParse({
      ...validTripData,
      difficulty: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("should reject duration less than 1", () => {
    const result = tripSchema.safeParse({
      ...validTripData,
      duration: 0,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Duration must be at least 1 day");
    }
  });

  it("should reject negative altitude", () => {
    const result = tripSchema.safeParse({
      ...validTripData,
      maxAltitude: -100,
    });
    expect(result.success).toBe(false);
  });

  it("should reject short title", () => {
    const result = tripSchema.safeParse({
      ...validTripData,
      title: "E",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Title must be at least 2 characters");
    }
  });

  it("should accept all valid difficulty levels", () => {
    const difficulties = ["EASY", "MODERATE", "CHALLENGING", "DIFFICULT", "EXTREME"] as const;

    for (const difficulty of difficulties) {
      const result = tripSchema.safeParse({
        ...validTripData,
        difficulty,
      });
      expect(result.success).toBe(true);
    }
  });

  it("should accept both ACTIVE and ARCHIVE status", () => {
    const activeResult = tripSchema.safeParse({
      ...validTripData,
      status: "ACTIVE",
    });
    expect(activeResult.success).toBe(true);

    const archiveResult = tripSchema.safeParse({
      ...validTripData,
      status: "ARCHIVE",
    });
    expect(archiveResult.success).toBe(true);
  });
});
