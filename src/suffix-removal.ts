const PARTICLE_REGEX = /-?(lah|kah|tah|pun)$/;
const POSSESSIVE_REGEX = /-?(ku|mu|nya)$/;
const SUFFIX_REGEX = /-?(is|isme|isasi|i|kan|an)$/;

/**
 * Removes a particle suffix (-lah, -kah, -tah, -pun) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed particle, word without particle].
 */
export function removeParticle(word: string): [string, string] {
  const match = word.match(PARTICLE_REGEX);
  if (match) {
    const particle = match[0];
    const result = word.slice(0, word.length - particle.length);
    return [particle, result];
  }
  return ["", word];
}

/**
 * Removes a possessive suffix (-ku, -mu, -nya) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed possessive, word without possessive].
 */
export function removePossessive(word: string): [string, string] {
  const match = word.match(POSSESSIVE_REGEX);
  if (match) {
    const possessive = match[0];
    const result = word.slice(0, word.length - possessive.length);
    return [possessive, result];
  }
  return ["", word];
}

/**
 * Removes a suffix (-is, -isme, -isasi, -i, -kan, -an) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed suffix, word without suffix].
 */
export function removeSuffix(word: string): [string, string] {
  const match = word.match(SUFFIX_REGEX);
  if (match) {
    const suffix = match[0];
    const result = word.slice(0, word.length - suffix.length);
    return [suffix, result];
  }
  return ["", word];
}
