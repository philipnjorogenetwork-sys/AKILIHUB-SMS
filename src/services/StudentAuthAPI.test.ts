import { afterEach, describe, expect, it, vi } from "vitest";
import { lookupStudentBySchoolCodeAndAdmissionNo } from "./StudentAuthAPI";

describe("lookupStudentBySchoolCodeAndAdmissionNo", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to local student data when the backend lookup fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await lookupStudentBySchoolCodeAndAdmissionNo("AKHUB001", "ADM2026001");

    expect(result.success).toBe(true);
    expect(result.student?.personId).toBe("S001");
  });
});
