/**
 * SastrawiJs - Indonesian language stemming library.
 *
 * @module sastrawijs-ts
 *
 * @example
 * ```ts
 * import { Stemmer, Tokenizer } from "sastrawijs-ts";
 *
 * const stemmer = new Stemmer();
 * const tokenizer = new Tokenizer();
 *
 * const words = tokenizer.tokenize("Perekonomian Indonesia sedang dalam pertumbuhan");
 * const stems = words.map(word => stemmer.stem(word));
 * // ["ekonomi", "indonesia", "sedang", "dalam", "tumbuh"]
 * ```
 */
import Stemmer from "./stemmer";
import Tokenizer from "./tokenizer";

export { Stemmer, Tokenizer };
export type { AffixRemovalResult, PrefixRemovalResult } from "./types";
