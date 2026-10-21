import { describe, expect, test } from "bun:test";
import { resolveSiteLanguage } from "./site-language";

describe("candidate language preference", () => {
  test("new visitors start in Romanian", () => {
    expect(resolveSiteLanguage(null)).toBe("ro");
  });
  test("an English selection is preserved", () => {
    expect(resolveSiteLanguage("en")).toBe("en");
  });
  test("invalid stored values fall back to Romanian", () => {
    expect(resolveSiteLanguage("invalid")).toBe("ro");
  });
});
