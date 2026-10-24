import { Stemmer, Tokenizer } from "../index";
import DefaultStemmer from "../stemmer";
import DefaultTokenizer from "../tokenizer";

describe("index export module", () => {
  it("exports Stemmer and Tokenizer classes", () => {
    expect(Stemmer).toBeDefined();
    expect(Tokenizer).toBeDefined();
    expect(Stemmer).toBe(DefaultStemmer);
    expect(Tokenizer).toBe(DefaultTokenizer);
  });

  it("allows instantiating Stemmer and Tokenizer from index exports", () => {
    const stemmer = new Stemmer();
    const tokenizer = new Tokenizer();

    expect(stemmer).toBeInstanceOf(DefaultStemmer);
    expect(tokenizer).toBeInstanceOf(DefaultTokenizer);
  });

  it("functions as expected using the exported classes (example usage)", () => {
    const stemmer = new Stemmer();
    const tokenizer = new Tokenizer();

    const words = tokenizer.tokenize(
      "Perekonomian Indonesia sedang dalam pertumbuhan",
    );
    const stems = words.map(word => stemmer.stem(word));

    expect(words).toEqual([
      "perekonomian",
      "indonesia",
      "sedang",
      "dalam",
      "pertumbuhan",
    ]);
    expect(stems).toEqual([
      "ekonomi",
      "indonesia",
      "sedang",
      "dalam",
      "tumbuh",
    ]);
  });
});
