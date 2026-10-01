import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApiRequestError,
  ApiValidationError,
  apiGet,
  assertSubmissionAccepted,
} from "@/api/client";
import { submitContact } from "@/api/contact";
import { runSubmission } from "@/lib/form-submit";

const payload = { name: "n", email: "a@b.co", message: "m", locale: "ar" } as const;

function mockFetch(status: number, body: unknown) {
  const fn = vi.fn().mockResolvedValue(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("submitContact through the real client", () => {
  it("succeeds only on a 201 with a success body", async () => {
    mockFetch(201, { success: true, message: "ok", data: { id: 7, status: "new" } });
    expect((await runSubmission("ar", () => submitContact(payload))).kind).toBe("success");
  });

  it.each([
    [422, { success: false, message: "x", errors: { email: ["bad"] } }],
    [429, { success: false, message: "Too many" }],
    [500, { success: false, message: "boom" }],
  ])("is an error for status %i", async (status, body) => {
    mockFetch(status, body);
    const outcome = await runSubmission("en", () => submitContact(payload));
    expect(outcome.kind).toBe("error");
  });

  it("is an error when fetch itself fails (API down)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const outcome = await runSubmission("ar", () => submitContact(payload));
    expect(outcome).toMatchObject({
      kind: "error",
      generalError: "تعذّر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
    });
  });

  it("is an error for a 200 with an empty or foreign body", async () => {
    mockFetch(200, undefined);
    expect((await runSubmission("en", () => submitContact(payload))).kind).toBe("error");
    mockFetch(200, { hello: "captive portal" });
    expect((await runSubmission("en", () => submitContact(payload))).kind).toBe("error");
  });

  it("throws typed errors", async () => {
    mockFetch(422, { success: false, message: "x", errors: { email: ["bad"] } });
    await expect(submitContact(payload)).rejects.toBeInstanceOf(ApiValidationError);
    mockFetch(429, { success: false, message: "x" });
    await expect(submitContact(payload)).rejects.toMatchObject({ status: 429 });
    expect(() => assertSubmissionAccepted(null)).toThrow(ApiRequestError);
  });
});

describe("preflight avoidance", () => {
  it("does not send Content-Type on GET, but does on POST", async () => {
    const get = mockFetch(200, { success: true, message: "", data: [] });
    await apiGet("/services?locale=en");
    expect(get.mock.calls[0]![1].headers).not.toHaveProperty("Content-Type");

    const post = mockFetch(201, { success: true, message: "", data: { id: 1, status: "new" } });
    await submitContact(payload);
    expect(post.mock.calls[0]![1].headers).toHaveProperty("Content-Type", "application/json");
  });
});
