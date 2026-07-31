import Tokenizer from "../tokenizer";

describe("Tokenizer", () => {
  const tokenizer = new Tokenizer();

  describe("tokenize", () => {
    it("tokenizes basic sentences", () => {
      expect(tokenizer.tokenize("hello world")).toEqual(["hello", "world"]);
      expect(tokenizer.tokenize("saya pergi ke pasar")).toEqual([
        "saya",
        "pergi",
        "ke",
        "pasar",
      ]);
    });

    it("converts to lowercase", () => {
      expect(tokenizer.tokenize("Hello World")).toEqual(["hello", "world"]);
      expect(tokenizer.tokenize("INDONESIA")).toEqual(["indonesia"]);
    });

    it("strips URLs", () => {
      expect(
        tokenizer.tokenize("kunjungi https://example.com sekarang"),
      ).toEqual(["kunjungi", "sekarang"]);
      expect(tokenizer.tokenize("http://test.org dan www.google.com")).toEqual([
        "dan",
      ]);
    });

    it("strips email addresses", () => {
      expect(tokenizer.tokenize("email user@host.com untuk info")).toEqual([
        "email",
        "untuk",
        "info",
      ]);
    });

    it("strips mentions and hashtags", () => {
      expect(tokenizer.tokenize("@user menyukai #tag ini")).toEqual([
        "menyukai",
        "ini",
      ]);
    });

    it("strips named HTML entities", () => {
      expect(tokenizer.tokenize("hello &amp; world")).toEqual([
        "hello",
        "world",
      ]);
    });

    it("decodes numeric HTML entities", () => {
      expect(tokenizer.tokenize("&#72;ello")).toEqual(["hello"]);
    });

    it("strips special characters", () => {
      expect(tokenizer.tokenize("hello world$%^")).toEqual(["hello", "world"]);
    });

    it("normalizes multiple whitespace", () => {
      expect(tokenizer.tokenize("hello   world")).toEqual(["hello", "world"]);
      expect(tokenizer.tokenize("  hello  world  ")).toEqual([
        "hello",
        "world",
      ]);
    });

    it("strips HTML tags", () => {
      expect(tokenizer.tokenize("<b>hello</b> world")).toEqual([
        "hello",
        "world",
      ]);
      expect(tokenizer.tokenize("<p>saya pergi</p>")).toEqual([
        "saya",
        "pergi",
      ]);
    });

    it("strips &nbsp; entity", () => {
      expect(tokenizer.tokenize("hello&nbsp;world")).toEqual([
        "hello",
        "world",
      ]);
    });

    it("handles empty string", () => {
      expect(tokenizer.tokenize("")).toEqual([]);
    });

    it("handles whitespace-only string", () => {
      expect(tokenizer.tokenize("   ")).toEqual([]);
    });

    it("returns single-element array for non-string input", () => {
      expect(tokenizer.tokenize(null as unknown as string)).toEqual([]);
      expect(tokenizer.tokenize(undefined as unknown as string)).toEqual([]);
      expect(tokenizer.tokenize(123 as unknown as string)).toEqual([]);
    });
  });

  describe("parseHtmlEntities", () => {
    it("decodes numeric HTML entities", () => {
      expect(tokenizer.parseHtmlEntities("&#72;")).toBe("H");
      expect(tokenizer.parseHtmlEntities("&#104;")).toBe("h");
      expect(tokenizer.parseHtmlEntities("&#65;&#66;&#67;")).toBe("ABC");
    });

    it("decodes hexadecimal HTML entities", () => {
      expect(tokenizer.parseHtmlEntities("&#x27;")).toBe("'");
      expect(
        tokenizer.parseHtmlEntities("&#x48;&#x65;&#x6c;&#x6c;&#x6f;"),
      ).toBe("Hello");
    });

    it("leaves non-entity text unchanged", () => {
      expect(tokenizer.parseHtmlEntities("hello")).toBe("hello");
    });
  });
});
