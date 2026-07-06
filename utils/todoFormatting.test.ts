import { describe, it, expect } from "vitest";
import { getDisplayText, getFormattedDate } from "./todoFormatting";

describe("getDisplayText", () => {
  it("capitalizes the first letter and lowercases the rest", () => {
    expect(getDisplayText("hELLO wORLD")).toBe("Hello world");
  });

  it("trims leading and trailing whitespace", () => {
    expect(getDisplayText("   hello   ")).toBe("Hello");
  });

  it("returns an empty string when the text is only whitespace", () => {
    expect(getDisplayText("   ")).toBe("");
  });

  it("returns an empty string when the text is undefined or null", () => {
    expect(getDisplayText(undefined)).toBe("");
    expect(getDisplayText(null)).toBe("");
  });
});

describe("getFormattedDate", () => {
  it("formats a date into a long localized string", () => {
    const result = getFormattedDate("2026-06-09T08:00:00.000Z");
    expect(result).toContain("2026");
  });
});