const HTML_ENTITY_REGEX = /&#(?:x([0-9a-fA-F]{1,6})|([0-9]{1,7}));/g;
const HTML_TAG_REGEX = /<[^>]*>/g;
const URL_REGEX = /(?:https?:\/\/|s?ftp:\/\/|www\.)\S+/gi;
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const MENTION_HASHTAG_REGEX = /(@|#)\S+/g;
const NBSP_REGEX = /&nbsp;/gi;
const NAMED_ENTITY_REGEX = /&[^;\s]+;/g;
const NON_ALPHA_SPACE_REGEX = /[^a-z\s]/g;
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
    return str.replace(HTML_ENTITY_REGEX, (_match, hex, dec) =>
      String.fromCodePoint(hex ? parseInt(hex, 16) : parseInt(dec, 10)),
    );
  }

  /**
   * Tokenizes an Indonesian sentence into an array of words.
   *
   * Performs the following processing:
   * 1. Decodes numeric HTML entities
   * 2. Converts to lowercase
   * 3. Strips HTML tags, URLs, emails, mentions, hashtags
   * 4. Strips named HTML entities and special characters
   * 5. Normalizes whitespace
   * 6. Splits into word array
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
    let sent = this.parseHtmlEntities(sentence);
    sent = sent.toLowerCase();
    sent = sent.replace(HTML_TAG_REGEX, " ");
    sent = sent.replace(URL_REGEX, "");
    sent = sent.replace(EMAIL_REGEX, "");
    sent = sent.replace(MENTION_HASHTAG_REGEX, "");
    sent = sent.replace(NBSP_REGEX, " ");
    sent = sent.replace(NAMED_ENTITY_REGEX, "");
    sent = sent.replace(NON_ALPHA_SPACE_REGEX, " ");
    sent = sent.replace(WHITESPACE_REGEX, " ");
    sent = sent.trim();
    if (sent === "") return [];
    return sent.split(WHITESPACE_REGEX);
  }
}
