import {
  VOWEL,
  CONSONANT,
  newChar,
  getChars,
  isOneOf,
  isNotOneOf,
  hasPrefix,
} from "../utils";

describe("utils", () => {
  describe("constants", () => {
    it("exports VOWEL and CONSONANT constants", () => {
      expect(VOWEL).toBe("aiueo");
      expect(CONSONANT).toBe("bcdfghjklmnpqrstvwxyz");
    });
  });

  describe("newChar", () => {
    it("returns character at specified index if within bounds", () => {
      expect(newChar("hello", 0)).toBe("h");
      expect(newChar("hello", 2)).toBe("l");
      expect(newChar("hello", 4)).toBe("o");
    });

    it("returns empty string if index is out of bounds or empty string", () => {
      expect(newChar("hello", 5)).toBe("");
      expect(newChar("hello", 10)).toBe("");
      expect(newChar("", 0)).toBe("");
      expect(newChar("", 1)).toBe("");
    });

    it("returns empty string for negative index", () => {
      expect(newChar("hello", -1)).toBe("");
    });
  });

  describe("getChars", () => {
    it("returns requested number of characters starting from index", () => {
      expect(getChars("pemakan", 2, 3)).toEqual(["m", "a", "k"]);
      expect(getChars("pelajar", 2, 6)).toEqual(["l", "a", "j", "a", "r", ""]);
    });

    it("handles out of bounds indices by returning empty strings", () => {
      expect(getChars("cat", 2, 3)).toEqual(["t", "", ""]);
      expect(getChars("cat", 5, 2)).toEqual(["", ""]);
    });
  });

  describe("isOneOf", () => {
    it("returns true when character is found in target string", () => {
      expect(isOneOf("a", VOWEL)).toBe(true);
      expect(isOneOf("k", CONSONANT)).toBe(true);
    });

    it("returns false when character is not found in target string", () => {
      expect(isOneOf("z", VOWEL)).toBe(false);
      expect(isOneOf("a", CONSONANT)).toBe(false);
    });

    it("returns false if character parameter length is not 1", () => {
      expect(isOneOf("", VOWEL)).toBe(false);
      expect(isOneOf("ai", VOWEL)).toBe(false);
    });

    it("returns false when target chars string is empty", () => {
      expect(isOneOf("a", "")).toBe(false);
    });
  });

  describe("isNotOneOf", () => {
    it("returns true when character is not found in target string", () => {
      expect(isNotOneOf("z", VOWEL)).toBe(true);
      expect(isNotOneOf("a", CONSONANT)).toBe(true);
    });

    it("returns false when character is found in target string", () => {
      expect(isNotOneOf("a", VOWEL)).toBe(false);
      expect(isNotOneOf("k", CONSONANT)).toBe(false);
    });

    it("returns true if character parameter length is not 1 (since isOneOf returns false)", () => {
      expect(isNotOneOf("", VOWEL)).toBe(true);
      expect(isNotOneOf("ai", VOWEL)).toBe(true);
    });
  });

  describe("hasPrefix", () => {
    it("returns true if haystack starts with needle", () => {
      expect(hasPrefix("ma", "makan")).toBe(true);
      expect(hasPrefix("ber", "brmain")).toBe(false);
    });
  });
});
