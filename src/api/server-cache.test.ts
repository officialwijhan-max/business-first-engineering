import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./client", async () => {
  const actual = await vi.importActual<typeof import("./client")>("./client");
  return { ...actual, apiGet: vi.fn() };
});

import { ApiRequestError, apiGet } from "./client";
import {
  SERVER_CACHE_FRESH_MS,
  SERVER_CACHE_RETRY_MS,
  SERVER_CACHE_STALE_MS,
  cachedApiGet,
  clearServerCache,
} from "./server-cache";

const upstream = vi.mocked(apiGet);

describe("server-side API cache", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-01T10:00:00Z"));
    clearServerCache();
    upstream.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it("serves a fresh copy without calling the API again", async () => {
    upstream.mockResolvedValue({ data: 1 });
    expect(await cachedApiGet("/services?locale=en")).toEqual({ data: 1 });
    expect(await cachedApiGet("/services?locale=en")).toEqual({ data: 1 });
    expect(upstream).toHaveBeenCalledTimes(1);
  });

  it("keys by full path, so languages and slugs never mix", async () => {
    upstream.mockImplementation(async (path: string) => ({ path }));
    expect(await cachedApiGet("/work?locale=en")).toEqual({ path: "/work?locale=en" });
    expect(await cachedApiGet("/work?locale=ar")).toEqual({ path: "/work?locale=ar" });
    expect(upstream).toHaveBeenCalledTimes(2);
  });

  it("shares one upstream call between concurrent requests", async () => {
    upstream.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: "x" }), 50)),
    );
    const results = Promise.all([cachedApiGet("/a"), cachedApiGet("/a"), cachedApiGet("/a")]);
    await vi.advanceTimersByTimeAsync(60);
    expect(await results).toEqual([{ data: "x" }, { data: "x" }, { data: "x" }]);
    expect(upstream).toHaveBeenCalledTimes(1);
  });

  it("refetches once the copy is no longer fresh", async () => {
    upstream.mockResolvedValueOnce({ data: 1 }).mockResolvedValueOnce({ data: 2 });
    await cachedApiGet("/a");
    vi.advanceTimersByTime(SERVER_CACHE_FRESH_MS + 1);
    expect(await cachedApiGet("/a")).toEqual({ data: 2 });
    expect(upstream).toHaveBeenCalledTimes(2);
  });

  it("serves the last good copy when the API is down, for up to 10 minutes", async () => {
    upstream.mockResolvedValueOnce({ data: 1 });
    await cachedApiGet("/a");
    vi.advanceTimersByTime(SERVER_CACHE_FRESH_MS + 1);
    upstream.mockRejectedValue(new ApiRequestError("down", 502));
    expect(await cachedApiGet("/a")).toEqual({ data: 1 });

    vi.advanceTimersByTime(SERVER_CACHE_STALE_MS);
    await expect(cachedApiGet("/a")).rejects.toThrow("down");
  });

  it("does not re-wait for a dead API on every request while serving a stale copy", async () => {
    upstream.mockResolvedValueOnce({ data: 1 });
    await cachedApiGet("/a");
    vi.advanceTimersByTime(SERVER_CACHE_FRESH_MS + 1);
    upstream.mockRejectedValue(new ApiRequestError("down", 0));
    await cachedApiGet("/a"); // first request pays for one failed attempt
    await cachedApiGet("/a");
    await cachedApiGet("/a");
    expect(upstream).toHaveBeenCalledTimes(2); // initial fetch + one failed retry
    vi.advanceTimersByTime(SERVER_CACHE_RETRY_MS + 1);
    await cachedApiGet("/a");
    expect(upstream).toHaveBeenCalledTimes(3); // retry window elapsed: try the API again
  });

  it("never masks a 404: a deleted record must disappear", async () => {
    upstream.mockResolvedValueOnce({ data: 1 });
    await cachedApiGet("/work/x");
    vi.advanceTimersByTime(SERVER_CACHE_FRESH_MS + 1);
    upstream.mockRejectedValue(new ApiRequestError("missing", 404));
    await expect(cachedApiGet("/work/x")).rejects.toMatchObject({ status: 404 });
  });

  it("does not cache failures", async () => {
    upstream.mockRejectedValueOnce(new ApiRequestError("down", 500));
    await expect(cachedApiGet("/a")).rejects.toThrow();
    upstream.mockResolvedValueOnce({ data: 1 });
    expect(await cachedApiGet("/a")).toEqual({ data: 1 });
  });
});
