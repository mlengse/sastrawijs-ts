/**
 * Removes a particle suffix (-lah, -kah, -tah, -pun) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed particle, word without particle].
 */
export function removeParticle(word: string): [string, string] {
  const len = word.length;
  if (len >= 3) {
    if (
      word.endsWith("lah") ||
      word.endsWith("kah") ||
      word.endsWith("tah") ||
      word.endsWith("pun")
    ) {
      if (len >= 4 && word.charCodeAt(len - 4) === 45) {
        return [word.slice(len - 4), word.slice(0, len - 4)];
      }
      return [word.slice(len - 3), word.slice(0, len - 3)];
    }
  }
  return ["", word];
}

/**
 * Removes a possessive suffix (-ku, -mu, -nya) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed possessive, word without possessive].
 */
export function removePossessive(word: string): [string, string] {
  const len = word.length;
  if (len >= 2) {
    if (word.endsWith("ku")) {
      if (len >= 3 && word.charCodeAt(len - 3) === 45) {
        return [word.slice(len - 3), word.slice(0, len - 3)];
      }
      return ["ku", word.slice(0, len - 2)];
    }
    if (word.endsWith("mu")) {
      if (len >= 3 && word.charCodeAt(len - 3) === 45) {
        return [word.slice(len - 3), word.slice(0, len - 3)];
      }
      return ["mu", word.slice(0, len - 2)];
    }
  }
  if (len >= 3 && word.endsWith("nya")) {
    if (len >= 4 && word.charCodeAt(len - 4) === 45) {
      return [word.slice(len - 4), word.slice(0, len - 4)];
    }
    return ["nya", word.slice(0, len - 3)];
  }
  return ["", word];
}

/**
 * Removes a suffix (-is, -isme, -isasi, -i, -kan, -an) from a word.
 * @param word - The word to process.
 * @returns A tuple of [removed suffix, word without suffix].
 */
export function removeSuffix(word: string): [string, string] {
  const len = word.length;
  if (len >= 5 && word.endsWith("isasi")) {
    if (len >= 6 && word.charCodeAt(len - 6) === 45) {
      return [word.slice(len - 6), word.slice(0, len - 6)];
    }
    return ["isasi", word.slice(0, len - 5)];
  }
  if (len >= 4 && word.endsWith("isme")) {
    if (len >= 5 && word.charCodeAt(len - 5) === 45) {
      return [word.slice(len - 5), word.slice(0, len - 5)];
    }
    return ["isme", word.slice(0, len - 4)];
  }
  if (len >= 3 && word.endsWith("kan")) {
    if (len >= 4 && word.charCodeAt(len - 4) === 45) {
      return [word.slice(len - 4), word.slice(0, len - 4)];
    }
    return ["kan", word.slice(0, len - 3)];
  }
  if (len >= 2 && word.endsWith("is")) {
    if (len >= 3 && word.charCodeAt(len - 3) === 45) {
      return [word.slice(len - 3), word.slice(0, len - 3)];
    }
    return ["is", word.slice(0, len - 2)];
  }
  if (len >= 2 && word.endsWith("an")) {
    if (len >= 3 && word.charCodeAt(len - 3) === 45) {
      return [word.slice(len - 3), word.slice(0, len - 3)];
    }
    return ["an", word.slice(0, len - 2)];
  }
  if (len >= 1 && word.endsWith("i")) {
    if (len >= 2 && word.charCodeAt(len - 2) === 45) {
      return [word.slice(len - 2), word.slice(0, len - 2)];
    }
    return ["i", word.slice(0, len - 1)];
  }
  return ["", word];
}
