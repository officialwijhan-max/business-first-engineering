import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ApiRequestError } from "@/api/client";
import { isNotFound } from "@tanstack/react-router";
import { rethrowAsNotFound } from "./route-data";

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const png = (path: string) => {
  const buffer = readFileSync(new URL(`../../${path}`, import.meta.url));
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

describe("public/robots.txt", () => {
  const robots = read("public/robots.txt");

  it("allows public content and blocks admin and api", () => {
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toMatch(/^Disallow: \/admin$/m);
    expect(robots).toMatch(/^Disallow: \/api$/m);
  });

  it("never blocks the whole site or the assets Google needs to render pages", () => {
    expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);
    expect(robots).not.toMatch(/^Disallow:.*(\.js|\.css|\/assets|\/og|\/data)/m);
  });

  it("points at the www sitemap and never at localhost", () => {
    expect(robots).toMatch(/^Sitemap: https:\/\/www\.wijhan\.com\/sitemap\.xml$/m);
    expect(robots).not.toMatch(/localhost|127\.0\.0\.1/);
  });

  it("has no static sitemap that would shadow the dynamic route", () => {
    expect(existsSync(new URL("../../public/sitemap.xml", import.meta.url))).toBe(false);
  });
});

describe("static SEO assets", () => {
  it("ships 1200x630 Open Graph cards for both languages", () => {
    expect(png("public/og/wijhan-en.png")).toEqual({ width: 1200, height: 630 });
    expect(png("public/og/wijhan-ar.png")).toEqual({ width: 1200, height: 630 });
  });

  it("ships touch and manifest icons at the declared sizes", () => {
    expect(png("public/apple-touch-icon.png")).toEqual({ width: 180, height: 180 });
    expect(png("public/icon-192.png")).toEqual({ width: 192, height: 192 });
    expect(png("public/icon-512.png")).toEqual({ width: 512, height: 512 });
  });

  it("has a valid web manifest whose icons exist", () => {
    const manifest = JSON.parse(read("public/site.webmanifest")) as {
      name: string;
      start_url: string;
      theme_color: string;
      icons: { src: string }[];
    };
    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBe("/");
    expect(manifest.theme_color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    for (const icon of manifest.icons) {
      expect(existsSync(new URL(`../../public${icon.src}`, import.meta.url))).toBe(true);
    }
  });

  it("caches content-hashed assets as immutable", () => {
    expect(read("public/_headers")).toMatch(
      /\/assets\/\*\s+Cache-Control: public, max-age=31536000, immutable/,
    );
  });
});

describe("loader error policy", () => {
  it("turns an API 404 into the router's notFound (HTTP 404)", () => {
    let thrown: unknown;
    try {
      rethrowAsNotFound(new ApiRequestError("not found", 404));
    } catch (error) {
      thrown = error;
    }
    expect(isNotFound(thrown)).toBe(true);
  });

  it("rethrows everything else so it renders as a 500, not an empty 200 page", () => {
    for (const status of [0, 500, 502, 503]) {
      const error = new ApiRequestError("boom", status);
      expect(() => rethrowAsNotFound(error)).toThrow(error);
    }
    const plain = new Error("network");
    expect(() => rethrowAsNotFound(plain)).toThrow(plain);
  });
});
