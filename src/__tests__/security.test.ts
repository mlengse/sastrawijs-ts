import Stemmer from "../stemmer";

describe("Stemmer Security Tests", () => {
  it("should not be vulnerable to prototype key collisions", () => {
    const stemmer = new Stemmer([]);

    expect(stemmer.find("toString")).toBe(false);
    expect(stemmer.find("constructor")).toBe(false);
    expect(stemmer.find("valueOf")).toBe(false);

    stemmer.addToDict(["toString"]);
    expect(stemmer.find("toString")).toBe(true);
    expect(stemmer.find("constructor")).toBe(false);
  });

  it("should use Set for dictionary (no prototype pollution risk)", () => {
    const stemmer = new Stemmer([]);
    expect(stemmer.internalDictionary).toBeInstanceOf(Set);
    expect(stemmer.internalDictionary.size).toBe(0);
  });
});

import Tokenizer from "../tokenizer";

describe("Tokenizer Security Tests", () => {
  it("should process large inputs without catastrophic backtracking (ReDoS)", () => {
    const tokenizer = new Tokenizer();
    const maliciousInput = "http" + "a".repeat(100000) + " &" + "b".repeat(100000);

    const start = Date.now();
    const result = tokenizer.tokenize(maliciousInput);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000); // Should finish in a few milliseconds
    expect(result).toBeDefined();
  });
});
