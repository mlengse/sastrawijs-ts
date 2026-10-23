/**
 * Helper function to check and remove suffixes (including hyphenated suffixes) from a word.
 * @param word - The word to process.
 * @param suffixes - List of candidate suffixes in order of precedence.
 * @returns A tuple of [removed suffix (with hyphen if hyphenated), word without suffix].
 */
function checkAndRemoveSuffix(
  word: string,
  suffixes: string[],
): [string, string] {
  const len = word.length;
  for (let i = 0; i < suffixes.length; i++) {
    const suffix = suffixes[i];
    const suffixLen = suffix.length;
    if (len >= suffixLen && word.endsWith(suffix)) {
      const isHyphenated =
        len >= suffixLen + 1 && word.charCodeAt(len - suffixLen - 1) === 45;
      const totalCutLength = suffixLen + (isHyphenated ? 1 : 0);
      return [
        isHyphenated ? "-" + suffix : suffix,
        word.slice(0, len - totalCutLength),
      ];
    }
  }
  return ["", word];
}

/**
 * Removes a particle suffix (-lah, -kah, -tah, -pun) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed particle, word without particle].
 */
export function removeParticle(word: string): [string, string] {
  return checkAndRemoveSuffix(word, ["lah", "kah", "tah", "pun"]);
}

/**
 * Removes a possessive suffix (-ku, -mu, -nya) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed possessive, word without possessive].
 */
export function removePossessive(word: string): [string, string] {
  return checkAndRemoveSuffix(word, ["ku", "mu", "nya"]);
}

/**
 * Removes a suffix (-is, -isme, -isasi, -i, -kan, -an) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed suffix, word without suffix].
 */
export function removeSuffix(word: string): [string, string] {
  return checkAndRemoveSuffix(word, ["isasi", "isme", "kan", "is", "an", "i"]);
}
