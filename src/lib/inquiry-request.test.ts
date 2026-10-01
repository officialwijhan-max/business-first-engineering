import { afterEach, describe, expect, it, vi } from "vitest";
import { submitInquiry } from "@/api/inquiry";
import { buildInquiryRequest, isScopingInquiry, toFormFieldErrors } from "@/lib/inquiry-request";

function formOf(fields: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

const base = {
  name: "Jane Roe",
  email: "jane@example.com",
  company: "Acme",
  phone: "+201000000000",
  description: "We need a platform.",
  projectType: "custom-software",
  budget: "EGP 100,000 – 250,000",
};

describe("buildInquiryRequest", () => {
  it("routes Project Scoping to a quote request with its own fields", () => {
    const request = buildInquiryRequest(formOf({ ...base, subject: "scoping" }), "en");

    expect(request).toEqual({
      kind: "quote",
      payload: {
        name: "Jane Roe",
        company: "Acme",
        email: "jane@example.com",
        phone: "+201000000000",
        project_type: "custom-software",
        budget_range: "EGP 100,000 – 250,000",
        description: "We need a platform.",
        locale: "en",
      },
    });
  });

  it("prepends the scoping summary to the description and keeps the Arabic locale", () => {
    const request = buildInquiryRequest(
      formOf({ ...base, subject: "scoping", description: "نُريدُ تطبيقًا 🚀" }),
      "ar",
      "ملخص متطلبات المشروع:\nالهدف الرئيسي: إطلاق منتج جديد",
    );

    expect(request.kind).toBe("quote");
    if (request.kind !== "quote") return;
    expect(request.payload.locale).toBe("ar");
    expect(request.payload.description).toBe(
      "ملخص متطلبات المشروع:\nالهدف الرئيسي: إطلاق منتج جديد\n\nنُريدُ تطبيقًا 🚀",
    );
  });

  it("falls back to not-sure when no service is picked and omits an empty budget", () => {
    const request = buildInquiryRequest(
      formOf({ ...base, subject: "scoping", projectType: "", budget: "" }),
      "en",
    );

    if (request.kind !== "quote") throw new Error("expected a quote request");
    expect(request.payload.project_type).toBe("not-sure");
    expect(request.payload.budget_range).toBeUndefined();
  });

  it.each(["call", "partnership", "support"])("routes %s to a contact message", (subject) => {
    const request = buildInquiryRequest(formOf({ ...base, subject }), "en");

    expect(request.kind).toBe("contact");
    if (request.kind !== "contact") return;
    expect(request.payload).toMatchObject({
      subject,
      message: "We need a platform.",
      project_type: "custom-software",
    });
    expect(request.payload).not.toHaveProperty("description");
  });

  it("treats a form with no subject as a contact message", () => {
    expect(isScopingInquiry(formOf(base))).toBe(false);
    expect(buildInquiryRequest(formOf(base), "en").kind).toBe("contact");
  });
});

describe("toFormFieldErrors", () => {
  it("re-keys quote description errors under message and leaves contact errors alone", () => {
    expect(toFormFieldErrors("quote", { description: ["bad"], email: ["e"] })).toEqual({
      email: ["e"],
      message: ["bad"],
    });
    const contact = { message: ["bad"] };
    expect(toFormFieldErrors("contact", contact)).toBe(contact);
  });
});

describe("submitInquiry", () => {
  afterEach(() => vi.unstubAllGlobals());

  function stubFetch() {
    const fn = vi.fn().mockImplementation(
      async () =>
        new Response(
          JSON.stringify({ success: true, message: "ok", data: { id: 1, status: "new" } }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          },
        ),
    );
    vi.stubGlobal("fetch", fn);
    return fn;
  }

  it("posts Project Scoping to /quote-requests and every other tab to /contact", async () => {
    const fetchMock = stubFetch();

    await submitInquiry(buildInquiryRequest(formOf({ ...base, subject: "scoping" }), "en"));
    for (const subject of ["call", "partnership", "support"]) {
      await submitInquiry(buildInquiryRequest(formOf({ ...base, subject }), "en"));
    }

    const urls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(urls.map((url) => url.replace(/^.*\/api\/v1/, ""))).toEqual([
      "/quote-requests",
      "/contact",
      "/contact",
      "/contact",
    ]);
  });
});
