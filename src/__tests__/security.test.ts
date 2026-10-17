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
