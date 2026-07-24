import defaultDictionary from "./dictionary.json";
import { removePrefix } from "./prefix-removal";
import { removeParticle, removePossessive, removeSuffix } from "./suffix-removal";

export type { AffixRemovalResult, PrefixRemovalResult } from "./types";

/**
 * Indonesian language stemmer based on the Sastrawi algorithm.
 *
 * Reduces inflected words to their base form (stem) by removing prefixes,
 * suffixes, particles, and possessive markers.
 *
 * @example
 * ```ts
 * import { Stemmer } from "sastrawijs";
 *
 * const stemmer = new Stemmer();
 * stemmer.stem("berlari");  // "lari"
 * stemmer.stem("pembelajaran"); // "ajar"
 * ```
 */
export default class Stemmer {
  /** The internal dictionary used for root word lookup. */
  public internalDictionary: Set<string>;

  /**
   * Creates a new Stemmer instance.
   * @param dictionary - Array of root words. Defaults to the built-in KBBI dictionary.
   */
  constructor(dictionary: string[] = defaultDictionary) {
    this.internalDictionary = new Set(dictionary);
  }

  /**
   * Adds words to the internal dictionary.
   * @param words - Array of words to add.
   */
  addToDict(words: string[]): void {
    if (!Array.isArray(words)) return;
    words.forEach(word => this.internalDictionary.add(word));
  }

  /**
   * Removes words from the internal dictionary.
   * @param words - Array of words to remove.
   */
  remove(words: string[]): void {
    if (!Array.isArray(words)) return;
    words.forEach(word => this.internalDictionary.delete(word));
  }

  /**
   * Checks if a word exists in the internal dictionary.
   * @param word - The word to look up.
   * @returns `true` if the word is in the dictionary.
   */
  find(word: string): boolean {
    return this.internalDictionary.has(word);
  }

  /**
   * Returns the internal dictionary as a Set.
   * @returns The full dictionary Set.
   */
  print(): Set<string> {
    return this.internalDictionary;
  }

  private returnIfFound(word: string): string | null {
    return this.find(word) ? word : null;
  }

  private removeAffixes(originalWord: string, prefixFirst: boolean): string | null {
    let suffix: string | undefined;
    let possessive: string | undefined;
    let particle: string | undefined;
    let w = originalWord;

    if (prefixFirst) {
      const pf = this.removePrefixes(w);
      if (pf[0]) return pf[1];
      w = pf[1];
    }

    [particle, w] = removeParticle(w);
    let r = this.returnIfFound(w);
    if (r) return r;

    [possessive, w] = removePossessive(w);
    r = this.returnIfFound(w);
    if (r) return r;

    [suffix, w] = removeSuffix(w);
    r = this.returnIfFound(w);
    if (r) return r;

    if (!prefixFirst) {
      const pf = this.removePrefixes(w);
      if (pf[0]) return pf[1];
    }

    const removedSuffixes = suffix === "kan"
      ? ["", "k", "an", possessive || "", particle || ""]
      : ["", suffix || "", possessive || "", particle || ""];

    const lr = this.lastReturnLoop(originalWord, removedSuffixes);
    if (lr[0]) return lr[1];

    return null;
  }

  /**
   * Stems an Indonesian word to its base form.
   *
   * Removes affixes (prefixes, suffixes, particles, possessive markers)
   * and returns the root word. If no stem is found, returns the original word.
   *
   * @param word - The inflected word to stem.
   * @returns The stemmed (root) word, or an empty string if input is not a string.
   *
   * @example
   * ```ts
   * stemmer.stem("berlari");     // "lari"
   * stemmer.stem("pembelajaran"); // "ajar"
   * stemmer.stem("hancurlah");   // "hancur"
   * ```
   */
  stem(word: string): string {
    if (typeof word !== "string") return "";
    word = word.toLowerCase();

    const originalWord = word;

    if (word.length < 3) {
      return word;
    }
    if (this.find(word)) {
      return word;
    }

    const prefixFirst = /^(be.+lah|be.+an|me.+i|di.+i|pe.+i|ter.+i)$/.test(word);
    const result = this.removeAffixes(word, prefixFirst);
    if (result) return result;

    return originalWord;
  }

  /**
   * Tries suffix combinations to find the root word when normal removal fails.
   *
   * Iteratively reconstructs the word with varying suffix combinations
   * and checks each against the dictionary.
   *
   * @param originalWord - The original inflected word.
   * @param suffixes - The suffix parts that were removed.
   * @returns A tuple of [found, root word]. `found` is true if a root was identified.
   */
  private lastReturnLoop(originalWord: string, suffixes: string[]): [boolean, string] {
    let lenSuffixes = 0;
    suffixes.forEach(suffix => {
      lenSuffixes += suffix.length;
    });
    const wordWithoutSuffix = originalWord.substring(
      0,
      originalWord.length - lenSuffixes
    );

    for (let i = 0; i < suffixes.length; i++) {
      let suffixCombination = "";
      for (let j = 0; j <= i; j++) {
        suffixCombination += suffixes[j];
      }

      let word = wordWithoutSuffix + suffixCombination;
      if (this.find(word)) {
        return [true, word];
      }

      const funcret = this.removePrefixes(word);
      const rootFound = funcret[0];
      word = funcret[1];
      if (rootFound) {
        return [true, word];
      }
    }
    return [false, originalWord];
  }

  /**
   * Iteratively removes prefixes from a word (up to 3 rounds).
   *
   * After each prefix removal, checks the dictionary and tries recoding.
   * Stops when the root is found or no more prefixes can be removed.
   *
   * @param word - The word to process.
   * @returns A tuple of [found, result]. `found` is true if a root was identified.
   */
  private removePrefixes(word: string): [boolean, string] {
    const originalWord = word;
    let currentPrefix = "";
    let removedPrefix = "";
    let recodingChar = [];

    for (let i = 0; i < 3; i++) {
      if (word.length < 3) {
        return [false, originalWord];
      }

      currentPrefix = word.substring(0, 2);
      if (currentPrefix === removedPrefix) {
        break;
      }

      const funcret = removePrefix(word);
      removedPrefix = funcret[0];
      word = funcret[1];
      recodingChar = funcret[2];
      if (this.find(word)) {
        return [true, word];
      }
      for (const char of recodingChar) {
        if (this.find(char + word)) {
          return [true, char + word];
        }
      }
    }

    return [false, word];
  }
}
