const HTML_ENTITY_REGEX = /&#(?:x([0-9a-fA-F]{1,6})|([0-9]{1,7}));/g;
const TOKEN_CLEAN_REGEX =
  /(?:https?:\/\/|s?ftp:\/\/|www\.)\S+|\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b|[@#]\S+|<[^>]*>|&[^;\s]+;|[^a-z\s]/gi;
const WHITESPACE_REGEX = /\s+/g;

/**
 * Tokenizer for Indonesian text.
 *
 * Splits sentences into individual words while stripping URLs, emails,
 * mentions, hashtags, HTML entities, and special characters.
 *
 * @example
 * ```ts
 * import { Tokenizer } from "sastrawijs-ts";
 *
 * const tokenizer = new Tokenizer();
 * tokenizer.tokenize("Perekonomian Indonesia sedang dalam pertumbuhan");
 * // ["perekonomian", "indonesia", "sedang", "dalam", "pertumbuhan"]
 * ```
 */
export default class Tokenizer {
  /**
   * Decodes numeric HTML character references (e.g., `&#72;` → `H`, `&#x27;` → `'`).
   * @param str - The string containing HTML entities.
   * @returns The string with entities decoded.
   */
  parseHtmlEntities(str: string): string {
    return str.replace(HTML_ENTITY_REGEX, (match, hex, dec) => {
      const codePoint = hex ? parseInt(hex, 16) : parseInt(dec, 10);
      if (Number.isNaN(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
        return match;
      }
      return String.fromCodePoint(codePoint);
    });
  }

  /**
   * Tokenizes an Indonesian sentence into an array of words.
   *
   * Performs the following processing:
   * 1. Decodes numeric HTML entities
   * 2. Converts to lowercase
   * 3. Strips HTML tags, URLs, emails, mentions, hashtags, named HTML entities, and special characters in a single pass
   * 4. Normalizes whitespace and splits into word array
   *
   * @param sentence - The sentence to tokenize.
   * @returns An array of cleaned words. Returns `[]` if input is not a string or is empty/whitespace-only.
   *
   * @example
   * ```ts
   * tokenizer.tokenize("Hello World! https://example.com");
   * // ["hello", "world"]
   * ```
   */
  tokenize(sentence: string): string[] {
    if (typeof sentence !== "string") return [];
    const sent = this.parseHtmlEntities(sentence)
      .toLowerCase()
      .replace(TOKEN_CLEAN_REGEX, " ")
      .trim();
    if (sent === "") return [];
    return sent.split(WHITESPACE_REGEX);
  }
}
