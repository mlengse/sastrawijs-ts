import { newChar, isOneOf, isNotOneOf, hasPrefix, VOWEL, CONSONANT } from "./utils";

/**
 * Removes the me- prefix using pattern matching.
 *
 * Handles 10 patterns including me{l|r|w|y}V, mem{b|f|v}, men{c|d|j|s|t|z},
 * meng{g|h|q|k}, mengV, menyV, mempV, etc.
 *
 * @param word - The word starting with "me".
 * @returns A tuple of [result, recoding characters or null].
 */
export function removeMePrefix(word: string): [string, string[] | null] {
  const s3 = newChar(word, 2);
  const s4 = newChar(word, 3);
  const s5 = newChar(word, 4);

  // Pattern 01
  // me{l|r|w|y}V => me-{l|r|w|y}V
  if (isOneOf(s3, "lrwy") && isOneOf(s4, VOWEL)) {
    return [word.substring(2, word.length), null];
  }

  // Pattern 02
  // mem{b|f|v} => mem-{b|f|v}
  if (isOneOf(s3, "m") && isOneOf(s4, "bfv")) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 03
  // mempe => mem-pe
  if (
    isOneOf(s3, "m") &&
    isOneOf(s4, "p") &&
    isOneOf(s5, "e")
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 04
  // mem{rV|V} => mem-{rV|V} OR me-p{rV|V}
  if (
    isOneOf(s3, "m") &&
    (isOneOf(s4, VOWEL) ||
      (isOneOf(s4, "r") && isOneOf(s5, VOWEL)))
  ) {
    return [word.substring(3, word.length), ["m", "p"]];
  }

  // Pattern 05
  // men{c|d|j|s|t|z} => men-{c|d|j|s|t|z}
  if (isOneOf(s3, "n") && isOneOf(s4, "cdjstz")) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 06
  // menV => nV OR tV
  if (isOneOf(s3, "n") && isOneOf(s4, VOWEL)) {
    return [word.substring(3, word.length), ["n", "t"]];
  }

  // Pattern 07
  // meng{g|h|q|k} => meng-{g|h|q|k}
  if (
    isOneOf(s3, "n") &&
    isOneOf(s4, "g") &&
    isOneOf(s5, "ghqk")
  ) {
    return [word.substring(4, word.length), null];
  }

  // Pattern 08
  // mengV => meng-V OR meng-kV OR me-ngV OR mengV- where V = 'e'
  if (
    isOneOf(s3, "n") &&
    isOneOf(s4, "g") &&
    isOneOf(s5, VOWEL)
  ) {
    if (isOneOf(s5, "e")) {
      return [word.substring(5, word.length), null];
    }

    return [word.substring(4, word.length), ["ng", "k"]];
  }

  // Pattern 09
  // menyV => meny-sV OR me-nyV to stem menyala
  if (
    isOneOf(s3, "n") &&
    isOneOf(s4, "y") &&
    isOneOf(s5, VOWEL)
  ) {
    if (isOneOf(s5, "a")) {
      return [word.substring(2, word.length), null];
    }

    return ["s" + word.substring(4, word.length), null];
  }

  // Pattern 10
  // mempV => mem-pV where V != 'e'
  if (
    isOneOf(s3, "m") &&
    isOneOf(s4, "p") &&
    isNotOneOf(s5, "e")
  ) {
    return [word.substring(3, word.length), null];
  }

  return [word, null];
}

/**
 * Removes the pe- prefix using pattern matching.
 *
 * Handles 15 patterns including pe{w|y}V, perV, perCAP, pem{b|f|v},
 * pen{c|d|j|s|t|z}, pengC, pengV, penyV, pelV, peCerV, peCP, etc.
 *
 * @param word - The word starting with "pe".
 * @returns A tuple of [result, recoding characters or null].
 */
export function removePePrefix(word: string): [string, string[] | null] {
  const s3 = newChar(word, 2);
  const s4 = newChar(word, 3);
  const s5 = newChar(word, 4);
  const s6 = newChar(word, 5);
  const s7 = newChar(word, 6);
  const s8 = newChar(word, 7);

  // Pattern 01
  // pe{w|y}V => pe-{w|y}V
  if (isOneOf(s3, "wy") && isOneOf(s4, VOWEL)) {
    return [word.substring(2, word.length), null];
  }

  // Pattern 02
  // perV => per-V OR pe-rV
  if (isOneOf(s3, "r") && isOneOf(s4, VOWEL)) {
    return [word.substring(3, word.length), ["r"]];
  }

  // Pattern 03
  // perCAP => per-CAP where C != 'r' and P != 'er'
  if (
    isOneOf(s3, "r") &&
    isOneOf(s4, CONSONANT) &&
    isNotOneOf(s4, "r") &&
    isNotOneOf(s5, "") &&
    isNotOneOf(s6, "e")
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 4
  // perCAerV => per-CAerV where C != 'r'
  if (
    isOneOf(s3, "r") &&
    isOneOf(s4, CONSONANT) &&
    isNotOneOf(s4, "r") &&
    isNotOneOf(s5, "") &&
    isOneOf(s6, "e") &&
    isOneOf(s7, "r") &&
    isOneOf(s8, VOWEL)
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 05
  // pem{b|f|v} => pem-{b|f|v}
  if (isOneOf(s3, "m") && isOneOf(s4, "bfv")) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 06
  // pem{rV|V} => pe-m{rV|V} OR pe-p{rV|V}
  if (
    isOneOf(s3, "m") &&
    (isOneOf(s4, VOWEL) ||
      (isOneOf(s4, "r") && isOneOf(s5, VOWEL)))
  ) {
    return [word.substring(3, word.length), ["m", "p"]];
  }

  // Pattern 07
  // pen{c|d|j|s|t|z} => pen-{c|d|j|s|t|z}
  if (isOneOf(s3, "n") && isOneOf(s4, "cdjstz")) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 08
  // penV => pe-nV OR pe-tV
  if (isOneOf(s3, "n") && isOneOf(s4, VOWEL)) {
    return [word.substring(3, word.length), ["n", "t"]];
  }

  // Pattern 09
  // pengC => peng-C
  if (
    isOneOf(s3, "n") &&
    isOneOf(s4, "g") &&
    isOneOf(s5, CONSONANT)
  ) {
    return [word.substring(4, word.length), null];
  }

  // Pattern 10
  // pengV => peng-V OR peng-kV OR pengV- where V = 'e'
  if (
    isOneOf(s3, "n") &&
    isOneOf(s4, "g") &&
    isOneOf(s5, VOWEL)
  ) {
    if (isOneOf(s5, "e")) {
      return [word.substring(5, word.length), null];
    }

    return [word.substring(4, word.length), ["k"]];
  }

  // Pattern 11
  // penyV => peny-sV OR pe-nyV
  if (
    isOneOf(s3, "n") &&
    isOneOf(s4, "y") &&
    isOneOf(s5, VOWEL)
  ) {
    return [word.substring(4, word.length), ["s", "ny"]];
  }

  // Pattern 12
  // pelV => pe-lV OR pel-V for pelajar
  if (isOneOf(s3, "l") && isOneOf(s4, VOWEL)) {
    if (word === "pelajar") {
      return ["ajar", null];
    }

    return [word.substring(2, word.length), null];
  }

  // Pattern 13
  // peCerV => per-erV where C != {r|w|y|l|m|n}
  if (
    isOneOf(s3, CONSONANT) &&
    isNotOneOf(s3, "rwylmn") &&
    isOneOf(s4, "e") &&
    isOneOf(s5, "r") &&
    isOneOf(s6, VOWEL)
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 14
  // peCP => pe-CP where C != {r|w|y|l|m|n} and P != 'er'
  if (
    isOneOf(s3, CONSONANT) &&
    isNotOneOf(s3, "rwylmn") &&
    isNotOneOf(s3, "e")
  ) {
    return [word.substring(2, word.length), null];
  }

  // Pattern 15
  // peC1erC2 => pe-C1erC2 where C1 != {r|w|y|l|m|n}
  if (
    isOneOf(s3, CONSONANT) &&
    isNotOneOf(s3, "rwylmn") &&
    isOneOf(s4, "e") &&
    isOneOf(s5, "r") &&
    isOneOf(s6, CONSONANT)
  ) {
    return [word.substring(2, word.length), null];
  }

  return [word, null];
}

/**
 * Removes the be- prefix using pattern matching.
 *
 * Handles 5 patterns including berV, berCAP, berCAerV, belajar (special),
 * and beC1erC2.
 *
 * @param word - The word starting with "be".
 * @returns A tuple of [result, recoding characters or null].
 */
export function removeBePrefix(word: string): [string, string[] | null] {
  const s3 = newChar(word, 2);
  const s4 = newChar(word, 3);
  const s5 = newChar(word, 4);
  const s6 = newChar(word, 5);
  const s7 = newChar(word, 6);
  const s8 = newChar(word, 7);

  // Pattern 01
  // berV => ber-V OR be-rV
  if (isOneOf(s3, "r") && isOneOf(s4, VOWEL)) {
    return [word.substring(3, word.length), ["r"]];
  }

  // Pattern 02
  // berCAP => ber-CAP
  if (
    isOneOf(s3, "r") &&
    isOneOf(s4, CONSONANT) &&
    isNotOneOf(s4, "r") &&
    isNotOneOf(s5, "") &&
    isNotOneOf(s6, "e")
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 3
  // berCAerV => ber-CAerV where C != 'r'
  if (
    isOneOf(s3, "r") &&
    isOneOf(s4, CONSONANT) &&
    isNotOneOf(s4, "r") &&
    isNotOneOf(s5, "") &&
    isOneOf(s6, "e") &&
    isOneOf(s7, "r") &&
    isOneOf(s8, VOWEL)
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 04
  // belajar => bel-ajar
  if (word === "belajar") {
    return [word.substring(3, word.length), null];
  }

  // Pattern 5
  // beC1erC2 => be-C1erC2 where C1 != {'r'|'l'}
  if (
    isOneOf(s3, CONSONANT) &&
    isNotOneOf(s3, "r") &&
    isNotOneOf(s3, "l") &&
    isOneOf(s4, "e") &&
    isOneOf(s5, "r") &&
    isOneOf(s6, CONSONANT)
  ) {
    return [word.substring(2, word.length), null];
  }

  return [word, null];
}

/**
 * Removes the te- prefix using pattern matching.
 *
 * Handles 5 patterns including terV, terCerV, terCP, teC1erC2,
 * and terC1erC2.
 *
 * @param word - The word starting with "te".
 * @returns A tuple of [result, recoding characters or null].
 */
export function removeTePrefix(word: string): [string, string[] | null] {
  const s3 = newChar(word, 2);
  const s4 = newChar(word, 3);
  const s5 = newChar(word, 4);
  const s6 = newChar(word, 5);
  const s7 = newChar(word, 6);

  // Pattern 01
  // terV => ter-V OR te-rV
  if (isOneOf(s3, "r") && isOneOf(s4, VOWEL)) {
    return [word.substring(3, word.length), ["r"]];
  }

  // Pattern 02
  // terCerV => ter-CerV where C != 'r'
  if (
    isOneOf(s3, "r") &&
    isOneOf(s4, CONSONANT) &&
    isNotOneOf(s4, "r") &&
    isOneOf(s5, "e") &&
    isOneOf(s6, "r") &&
    isOneOf(s7, VOWEL)
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 3
  // terCP => ter-CP where C != 'r' and P != 'er'
  if (
    isOneOf(s3, "r") &&
    isOneOf(s4, CONSONANT) &&
    isNotOneOf(s4, "r") &&
    isNotOneOf(s5, "e")
  ) {
    return [word.substring(3, word.length), null];
  }

  // Pattern 04
  // teC1erC2 => te-C1erC2 where C1 != 'r'
  if (
    isOneOf(s3, CONSONANT) &&
    isNotOneOf(s3, "r") &&
    isOneOf(s4, "e") &&
    isOneOf(s5, "r") &&
    isOneOf(s6, CONSONANT)
  ) {
    return [word.substring(2, word.length), null];
  }

  // Pattern 05
  // terC1erC2 => ter-C1erC2 where C1 != 'r'
  if (
    isOneOf(s3, "r") &&
    isOneOf(s4, CONSONANT) &&
    isNotOneOf(s4, "r") &&
    isOneOf(s5, "e") &&
    isOneOf(s6, "r") &&
    isOneOf(s7, CONSONANT)
  ) {
    return [word.substring(3, word.length), null];
  }

  return [word, null];
}

/**
 * Removes an infix (er-, el-, em-, en-) from a word.
 *
 * Handles 2 patterns: CerV (e.g., rerata -> rata) and CinV (e.g., kinerja -> kerja).
 *
 * @param word - The word to process.
 * @returns A tuple of [result, recoding pair or null].
 */
export function removeInfix(word: string): [string, [string, string] | null] {
  const s1 = newChar(word, 0);
  const s2 = newChar(word, 1);
  const s3 = newChar(word, 2);
  const s4 = newChar(word, 3);

  // Pattern 01
  // CerV => CerV OR CV
  if (
    isOneOf(s1, CONSONANT) &&
    isOneOf(s2, "e") &&
    isOneOf(s3, "rlm") &&
    isOneOf(s4, VOWEL)
  ) {
    return [
      word.substring(3, word.length),
      [word.substring(0, 3), word.substring(0, 1)],
    ];
  }

  // Pattern 02
  // CinV => CinV OR CV
  if (
    isOneOf(s1, CONSONANT) &&
    isOneOf(s2, "i") &&
    isOneOf(s3, "n") &&
    isOneOf(s4, VOWEL)
  ) {
    return [
      word.substring(3, word.length),
      [word.substring(0, 3), word.substring(0, 1)],
    ];
  }

  return [word, null];
}

/**
 * Removes a single prefix from a word based on its type.
 *
 * Handles simple prefixes (di, ke, se, ku, kau) and delegates complex
 * prefixes (me, pe, be, te) and infixes to specialized methods.
 *
 * @param word - The word to process.
 * @returns A tuple of [prefix, result, recoding characters].
 */
export function removePrefix(word: string): [string, string, string[]] {
  let prefix = "";
  let result = word;
  let recoding: string[] = [];
  let funcret;

  if (
    hasPrefix("di", word) ||
    hasPrefix("ke", word) ||
    hasPrefix("se", word) ||
    hasPrefix("ku", word)
  ) {
    prefix = word.substring(0, 2);
    result = word.substring(2, word.length);
  } else if (hasPrefix("kau", word)) {
    prefix = "kau";
    result = word.substring(3, word.length);
  } else if (hasPrefix("me", word)) {
    prefix = "me";
    funcret = removeMePrefix(word);
    result = funcret[0];
    recoding = funcret[1] || [];
  } else if (hasPrefix("pe", word)) {
    prefix = "pe";
    funcret = removePePrefix(word);
    result = funcret[0];
    recoding = funcret[1] || [];
  } else if (hasPrefix("be", word)) {
    prefix = "be";
    funcret = removeBePrefix(word);
    result = funcret[0];
    recoding = funcret[1] || [];
  } else if (hasPrefix("te", word)) {
    prefix = "te";
    funcret = removeTePrefix(word);
    result = funcret[0];
    recoding = funcret[1] || [];
  } else {
    funcret = removeInfix(word);
    result = funcret[0];
    recoding = funcret[1] || [];
  }
  return [prefix, result, recoding];
}
