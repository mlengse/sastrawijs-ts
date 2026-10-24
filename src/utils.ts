/** Vowel characters used in affix removal patterns. */
export const VOWEL = "aiueo";

/** Consonant characters used in affix removal patterns. */
export const CONSONANT = "bcdfghjklmnpqrstvwxyz";

/**
 * Safely retrieves a character from a word by index.
 * @param word - The word to get a character from.
 * @param index - The character index.
 * @returns The character at the index, or an empty string if out of bounds.
 */
export function newChar(word: string, index: number): string {
  if (index < 0 || index >= word.length) {
    return "";
  }
  return word[index];
}

/**
 * Safely retrieves a sequence of characters starting from startIndex.
 * @param word - The word to extract characters from.
 * @param startIndex - The starting character index.
 * @param count - The number of characters to retrieve.
 * @returns An array of characters of length `count`.
 */
export function getChars(
  word: string,
  startIndex: number,
  count: number,
): string[] {
  const chars: string[] = [];
  for (let i = 0; i < count; i++) {
    chars.push(newChar(word, startIndex + i));
  }
  return chars;
}

/**
 * Checks if a character is one of the given characters.
 * @param c - Single character to check.
 * @param chars - String of characters to match against.
 * @returns `true` if c is found in chars.
 */
export function isOneOf(c: string, chars: string): boolean {
  if (c.length !== 1) return false;
  return chars.includes(c);
}

/**
 * Checks if a character is NOT one of the given characters.
 * @param c - Single character to check.
 * @param chars - String of characters to match against.
 * @returns `true` if c is NOT found in chars.
 */
export function isNotOneOf(c: string, chars: string): boolean {
  return !isOneOf(c, chars);
}

/**
 * Checks if a string starts with a given prefix.
 * @param needle - The prefix to check for.
 * @param haystack - The string to search in.
 * @returns `true` if haystack starts with needle.
 */
export function hasPrefix(needle: string, haystack: string): boolean {
  return haystack.startsWith(needle);
}
