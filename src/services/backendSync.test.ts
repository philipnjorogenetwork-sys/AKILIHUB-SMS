import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStudent } from "./backendSync";

describe("createStudent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts new student payload to the backend when available", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, token: "demo-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ success: true, student: { id: 42 } }),
      });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await createStudent({
      personId: 999,
      schoolCode: "AKHUB001",
      admissionNo: "ADM-001",
      gradeLevel: "Form 1",
      section: "East",
    });

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain("/auth/login");
    expect(JSON.parse(fetchMock.mock.calls[1][1].body as string)).toMatchObject({
      admissionNo: "ADM-001",
      gradeLevel: "Form 1",
      section: "East",
    });
  });
});
