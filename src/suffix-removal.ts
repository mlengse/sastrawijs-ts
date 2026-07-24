/**
 * Removes a particle suffix (-lah, -kah, -tah, -pun) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed particle, word without particle].
 */
export function removeParticle(word: string): [string, string] {
  const result = word.replace(/-?(lah|kah|tah|pun)$/g, "");
  const particle = word.replace(result, "");
  return [particle, result];
}

/**
 * Removes a possessive suffix (-ku, -mu, -nya) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed possessive, word without possessive].
 */
export function removePossessive(word: string): [string, string] {
  const result = word.replace(/-?(ku|mu|nya)$/g, "");
  const possessive = word.replace(result, "");
  return [possessive, result];
}

/**
 * Removes a suffix (-is, -isme, -isasi, -i, -kan, -an) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed suffix, word without suffix].
 */
export function removeSuffix(word: string): [string, string] {
  const result = word.replace(/-?(is|isme|isasi|i|kan|an)$/g, "");
  const suffix = word.replace(result, "");
  return [suffix, result];
}
