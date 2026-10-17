import {
  removeParticle,
  removePossessive,
  removeSuffix,
} from "../suffix-removal";

describe("suffix-removal", () => {
  describe("removePossessive", () => {
    it("removes -ku, -mu, -nya possessive suffixes without hyphen", () => {
      expect(removePossessive("bajuku")).toEqual(["ku", "baju"]);
      expect(removePossessive("bajumu")).toEqual(["mu", "baju"]);
      expect(removePossessive("bajunya")).toEqual(["nya", "baju"]);
    });

    it("removes -ku, -mu, -nya possessive suffixes with hyphen", () => {
      expect(removePossessive("baju-ku")).toEqual(["-ku", "baju"]);
      expect(removePossessive("baju-mu")).toEqual(["-mu", "baju"]);
      expect(removePossessive("baju-nya")).toEqual(["-nya", "baju"]);
    });

    it("returns empty possessive if word does not end with possessive suffix", () => {
      expect(removePossessive("baju")).toEqual(["", "baju"]);
      expect(removePossessive("kucing")).toEqual(["", "kucing"]);
      expect(removePossessive("murni")).toEqual(["", "murni"]);
      expect(removePossessive("nyaris")).toEqual(["", "nyaris"]);
    });

    it("handles empty string", () => {
      expect(removePossessive("")).toEqual(["", ""]);
    });
  });

  describe("removeParticle", () => {
    it("removes -lah, -kah, -tah, -pun particle suffixes without hyphen", () => {
      expect(removeParticle("banyacklah")).toEqual(["lah", "banyack"]);
      expect(removeParticle("apakah")).toEqual(["kah", "apa"]);
      expect(removeParticle("siapatah")).toEqual(["tah", "siapa"]);
      expect(removeParticle("apapun")).toEqual(["pun", "apa"]);
    });

    it("removes particle suffixes with hyphen", () => {
      expect(removeParticle("allah-lah")).toEqual(["-lah", "allah"]);
      expect(removeParticle("apa-kah")).toEqual(["-kah", "apa"]);
      expect(removeParticle("siapa-tah")).toEqual(["-tah", "siapa"]);
      expect(removeParticle("apa-pun")).toEqual(["-pun", "apa"]);
    });

    it("returns empty particle if word does not end with particle suffix", () => {
      expect(removeParticle("rumah")).toEqual(["", "rumah"]);
      expect(removeParticle("puncak")).toEqual(["", "puncak"]);
      expect(removeParticle("tahanan")).toEqual(["", "tahanan"]);
      expect(removeParticle("lahir")).toEqual(["", "lahir"]);
    });

    it("handles empty string", () => {
      expect(removeParticle("")).toEqual(["", ""]);
    });
  });

  describe("removeSuffix", () => {
    it("removes inflectional suffixes (-is, -isme, -isasi, -i, -kan, -an)", () => {
      expect(removeSuffix("analisis")).toEqual(["is", "analis"]);
      expect(removeSuffix("mecanisme")).toEqual(["isme", "mecan"]);
      expect(removeSuffix("kanalisasi")).toEqual(["isasi", "kanal"]);
      expect(removeSuffix("mewarnai")).toEqual(["i", "mewarna"]);
      expect(removeSuffix("membagikan")).toEqual(["kan", "membagi"]);
      expect(removeSuffix("makanan")).toEqual(["an", "makan"]);
    });

    it("removes inflectional suffixes with hyphen", () => {
      expect(removeSuffix("makan-an")).toEqual(["-an", "makan"]);
    });

    it("returns empty suffix if word does not end with matching suffix", () => {
      expect(removeSuffix("kucing")).toEqual(["", "kucing"]);
    });
  });
});
