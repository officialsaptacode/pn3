import { describe, expect, it } from "vitest";
import { authorSchema, blogSchema, tripSchema } from "../schemas";

describe("Validation Schemas", () => {
  describe("tripSchema", () => {
    it("should allow creating a draft with only a title", () => {
      const draft = {
        title: "Island Peak Climbing",
        status: "INACTIVE",
      };
      const result = tripSchema.safeParse(draft);
      expect(result.success).toBe(true);
    });

    it("should allow optional fields to be empty strings", () => {
      const draft = {
        title: "Island Peak",
        description: "",
        slug: "",
        status: "INACTIVE",
      };
      const result = tripSchema.safeParse(draft);
      expect(result.success).toBe(true);
    });

    it("should fail if title is too short", () => {
      const draft = { title: "A" };
      const result = tripSchema.safeParse(draft);
      expect(result.success).toBe(false);
    });
  });

  describe("authorSchema", () => {
    it("should allow minimal author data", () => {
      const data = { name: "John Doe" };
      const result = authorSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should handle coerced numbers for experience", () => {
      const data = { name: "John Doe", yearsExperience: "5" };
      const result = authorSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.yearsExperience).toBe(5);
      }
    });
  });

  describe("blogSchema", () => {
    it("should allow draft blog posts without content", () => {
      const data = { title: "New Adventure", isPublished: false };
      const result = blogSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
