/**
 * Result of removing an affix (suffix, particle, or possessive) from a word.
 */
export interface AffixRemovalResult {
  /** The affix that was removed. */
  removed: string;
  /** The word after affix removal. */
  word: string;
}

/**
 * Result of removing a prefix from a word.
 */
export interface PrefixRemovalResult {
  /** The prefix that was removed. */
  removed: string;
  /** The word after prefix removal. */
  word: string;
  /** Characters to recode when the root is not found directly. */
  recoding: string[] | null;
}
