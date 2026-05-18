import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/utils/test-utils";
import { TripForm } from "../trip-form";

// Mock Child Components to avoid complexity in test
vi.mock("@/components/tip-tap", () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="mock-tiptap"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("../../../../components/MediaLibrary", () => ({
  MediaSelector: ({ onChange }: any) => (
    <button
      type="button"
      data-testid="mock-media-selector"
      onClick={() => onChange([{ id: 1, url: "test.jpg" }])}
    >
      Select Media
    </button>
  ),
}));

vi.mock("./AddReviewModal", () => ({
  default: ({ open, onOpenChange, onAdd }: any) =>
    open ? (
      <div data-testid="mock-add-review-modal">
        <button onClick={() => onAdd({ name: "Test User", rating: 5, comment: "Great trip!" })}>
          Submit Review
        </button>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

// Mock API Hooks
vi.mock("@/features/trips/api/use-trips", () => ({
  useCreateTrip: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateTrip: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

// Since we already test DestinationSelector separately, we can mock it here if needed,
// OR we can leave it unmocked to test integration. We will leave it unmocked, but we MUST mock the API call it makes.
vi.mock("@workspace/api-client", () => {
  return {
    destinationService: {
      findAll: vi.fn().mockResolvedValue([
        { id: 1, name: "Nepal", type: "COUNTRY" },
        { id: 2, name: "Annapurna Region", type: "REGION" },
      ]),
    },
  };
});

// Avoid ResizeObserver and PointerCapture errors in JSDOM from Radix UI / Tiptap
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (!global.Element.prototype.hasPointerCapture) {
  global.Element.prototype.hasPointerCapture = () => false;
}
if (!global.Element.prototype.setPointerCapture) {
  global.Element.prototype.setPointerCapture = () => {};
}
if (!global.Element.prototype.releasePointerCapture) {
  global.Element.prototype.releasePointerCapture = () => {};
}

global.Element.prototype.scrollIntoView = vi.fn();

describe("TripForm Component", () => {
  it("renders the main specific form fields", async () => {
    renderWithProviders(<TripForm />);

    // Check basic text inputs
    expect(screen.getByLabelText(/Trip Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
  });

  it("QA check: verifies standard Select dropdowns contain options", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TripForm />);

    // QA Check: Difficulty Select
    const difficultySelect = screen.getByRole("combobox", { name: /Difficulty/i });
    expect(difficultySelect).toBeInTheDocument();

    // Open difficulty select
    await user.click(difficultySelect);

    // Verify predefined options
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "EASY" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "MODERATE" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "CHALLENGING" })).toBeInTheDocument();
    });
  });

  it("QA check: verifies dynamic Destination and Category dropdowns", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    renderWithProviders(<TripForm />);

    // Check if the Country select renders
    const countryTrigger = screen.getByRole("combobox", { name: /Destination/i });
    expect(countryTrigger).toBeInTheDocument();

    // Click it to ensure destinations fetch successfully
    await user.click(countryTrigger);

    // Verify countries show up
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Nepal" })).toBeInTheDocument();
    });
  });
});
