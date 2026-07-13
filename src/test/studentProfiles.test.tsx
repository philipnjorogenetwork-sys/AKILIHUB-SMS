import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StudentProfiles from "@/pages/admin/sis/StudentProfiles";

describe("StudentProfiles", () => {
  it("renders the student directory and enrollment wizard entry point", () => {
    render(<StudentProfiles />);

    expect(screen.getByText(/student directory/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create student profile/i })).toBeInTheDocument();
  });
});
