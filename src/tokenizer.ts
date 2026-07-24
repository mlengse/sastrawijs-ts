/**
 * Tokenizer for Indonesian text.
 *
 * Splits sentences into individual words while stripping URLs, emails,
 * mentions, hashtags, HTML entities, and special characters.
 *
 * @example
 * ```ts
 * import { Tokenizer } from "sastrawijs";
 *
 * const tokenizer = new Tokenizer();
 * tokenizer.tokenize("Perekonomian Indonesia sedang dalam pertumbuhan");
 * // ["perekonomian", "indonesia", "sedang", "dalam", "pertumbuhan"]
 * ```
 */
export default class Tokenizer {
  /**
   * Decodes numeric HTML character references (e.g., `&#72;` → `H`).
   * @param str - The string containing HTML entities.
   * @returns The string with entities decoded.
   */
  parseHtmlEntities(str: string): string {
    return str.replace(/&#([0-9]{1,3});/gi, (_match, numStr) =>
      String.fromCharCode(parseInt(numStr, 10))
    );
  }

  /**
   * Tokenizes an Indonesian sentence into an array of words.
   *
   * Performs the following processing:
   * 1. Decodes numeric HTML entities
   * 2. Converts to lowercase
   * 3. Strips URLs, emails, mentions, hashtags
   * 4. Strips named HTML entities and special characters
   * 5. Normalizes whitespace
   * 6. Splits into word array
   *
   * @param sentence - The sentence to tokenize.
   * @returns An array of cleaned words. Returns `[]` if input is not a string.
   *
   * @example
   * ```ts
   * tokenizer.tokenize("Hello World! https://example.com");
   * // ["hello", "world"]
   * ```
   */
  tokenize(sentence: string): string[] {
    if (typeof sentence !== "string") return [];
    let sent = this.parseHtmlEntities(sentence);
    sent = sent.toLowerCase();
    sent = sent.replace(/(www\.|https?|s?ftp)\S+/g, "");
    sent = sent.replace(/\S+@\S+/g, "");
    sent = sent.replace(/(@|#)\S+/g, "");
    sent = sent.replace(/&.*;/g, "");
    sent = sent.replace(/[^a-z\s]/g, " ");
    sent = sent.replace(/\s+/g, " ");
    sent = sent
      .trim()
      .replace(/&nbsp;/g, "")
      .replace(/<[^/>][^>]*><\/[^>]+>/g, "");
    return sent.split(/\s+/);
  }
}
