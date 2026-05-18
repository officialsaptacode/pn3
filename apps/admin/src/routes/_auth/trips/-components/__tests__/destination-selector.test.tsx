import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { destinationService } from "@workspace/api-client";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/utils/test-utils";
import { DestinationSelector } from "../destination-selector";

// Mock the destinationService
vi.mock("@workspace/api-client", () => {
  return {
    destinationService: {
      findAll: vi.fn(),
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

describe("DestinationSelector Component", () => {
  const mockDestinations = [
    { id: 1, name: "Nepal", type: "COUNTRY" },
    { id: 2, name: "Everest Region", type: "REGION" },
    { id: 3, name: "Annapurna Region", type: "REGION" },
  ];

  it("renders correctly and fetches destinations", async () => {
    // Setup mock return value
    (destinationService.findAll as any).mockResolvedValue(mockDestinations);

    const mockOnChange = vi.fn();

    renderWithProviders(<DestinationSelector selectedIds={[]} onChange={mockOnChange} />);

    // Initial state
    expect(screen.getByRole("combobox")).toHaveTextContent("Select destinations...");

    // Open the combobox
    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));

    // Verify it fetched and displays destinations
    await waitFor(() => {
      expect(destinationService.findAll).toHaveBeenCalledTimes(1);
    });

    // Check if destinations are rendered
    expect(screen.getByText("Nepal")).toBeInTheDocument();
    expect(screen.getByText("Everest Region")).toBeInTheDocument();
    expect(screen.getByText("Annapurna Region")).toBeInTheDocument();
  });

  it("allows selecting a destination and calls onChange", async () => {
    (destinationService.findAll as any).mockResolvedValue(mockDestinations);

    const mockOnChange = vi.fn();

    renderWithProviders(<DestinationSelector selectedIds={[]} onChange={mockOnChange} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));

    // Wait for options to render
    await waitFor(() => {
      expect(screen.getByText("Nepal")).toBeInTheDocument();
    });

    // Select Nepal
    await user.click(screen.getByText("Nepal"));

    // Ensure onChange is called with the correct id
    expect(mockOnChange).toHaveBeenCalledWith([1]);
  });

  it("displays previously selected destinations", async () => {
    (destinationService.findAll as any).mockResolvedValue(mockDestinations);

    const mockOnChange = vi.fn();

    renderWithProviders(<DestinationSelector selectedIds={[1, 3]} onChange={mockOnChange} />);

    await waitFor(() => {
      expect(destinationService.findAll).toHaveBeenCalled();
    });

    // Badges should be rendered for selected items
    await waitFor(() => {
      expect(screen.getByText(/2 destination\(s\) selected/i)).toBeInTheDocument();
    });

    // The individual badges should be visible
    expect(screen.getByText("Nepal")).toBeInTheDocument();
    expect(screen.getByText("Annapurna Region")).toBeInTheDocument();
  });
});
