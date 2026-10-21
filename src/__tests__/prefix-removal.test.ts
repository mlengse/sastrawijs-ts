import {
  removeMePrefix,
  removePePrefix,
  removeBePrefix,
  removeTePrefix,
  removeInfix,
  removePrefix,
} from "../prefix-removal";

describe("prefix-removal", () => {
  describe("removeMePrefix", () => {
    it("handles Pattern 01: me{l|r|w|y}V => me-{l|r|w|y}V", () => {
      expect(removeMePrefix("melawan")).toEqual(["lawan", null]);
      expect(removeMePrefix("merawat")).toEqual(["rawat", null]);
      expect(removeMePrefix("mewarnai")).toEqual(["warnai", null]);
      expect(removeMePrefix("meyakinkan")).toEqual(["yakinkan", null]);
    });

    it("handles Pattern 02: mem{b|f|v} => mem-{b|f|v}", () => {
      expect(removeMePrefix("membeli")).toEqual(["beli", null]);
      expect(removeMePrefix("memfasilitasi")).toEqual(["fasilitasi", null]);
      expect(removeMePrefix("memvariasikan")).toEqual(["variasikan", null]);
    });

    it("handles Pattern 03: mempe => mem-pe", () => {
      expect(removeMePrefix("mempengaruhi")).toEqual(["pengaruhi", null]);
      expect(removeMePrefix("memperagakan")).toEqual(["peragakan", null]);
    });

    it("handles Pattern 04: mem{rV|V} => mem-{rV|V} OR me-p{rV|V}", () => {
      expect(removeMePrefix("memakan")).toEqual(["akan", ["m", "p"]]);
      expect(removeMePrefix("memrasakan")).toEqual(["rasakan", ["m", "p"]]);
    });

    it("handles Pattern 05: men{c|d|j|s|t|z} => men-{c|d|j|s|t|z}", () => {
      expect(removeMePrefix("mencari")).toEqual(["cari", null]);
      expect(removeMePrefix("mendengar")).toEqual(["dengar", null]);
      expect(removeMePrefix("menjual")).toEqual(["jual", null]);
      expect(removeMePrefix("mensterilkan")).toEqual(["sterilkan", null]);
      expect(removeMePrefix("menterjemahkan")).toEqual(["terjemahkan", null]);
      expect(removeMePrefix("menziarahi")).toEqual(["ziarahi", null]);
    });

    it("handles Pattern 06: menV => nV OR tV", () => {
      expect(removeMePrefix("menulis")).toEqual(["ulis", ["n", "t"]]);
    });

    it("handles Pattern 07: meng{g|h|q|k} => meng-{g|h|q|k}", () => {
      expect(removeMePrefix("menggoreng")).toEqual(["goreng", null]);
      expect(removeMePrefix("menghirup")).toEqual(["hirup", null]);
      expect(removeMePrefix("mengqada")).toEqual(["qada", null]);
      expect(removeMePrefix("mengkritik")).toEqual(["kritik", null]);
    });

    it("handles Pattern 08: mengV => meng-V OR meng-kV OR me-ngV OR mengV- where V = 'e'", () => {
      expect(removeMePrefix("mengecat")).toEqual(["cat", null]);
      expect(removeMePrefix("mengambil")).toEqual(["ambil", ["ng", "k"]]);
    });

    it("handles Pattern 09: menyV => meny-sV OR me-nyV", () => {
      expect(removeMePrefix("menyala")).toEqual(["nyala", null]);
      expect(removeMePrefix("menyeberang")).toEqual(["seberang", null]);
    });

    it("handles Pattern 10: mempV => mem-pV where V != 'e'", () => {
      expect(removeMePrefix("mempunyai")).toEqual(["punyai", null]);
    });

    it("returns unchanged word when no me- pattern matches", () => {
      expect(removeMePrefix("mew")).toEqual(["mew", null]);
      expect(removeMePrefix("me")).toEqual(["me", null]);
    });
  });

  describe("removePePrefix", () => {
    it("handles Pattern 01: pe{w|y}V => pe-{w|y}V", () => {
      expect(removePePrefix("pewarna")).toEqual(["warna", null]);
      expect(removePePrefix("peyakin")).toEqual(["yakin", null]);
    });

    it("handles Pattern 02: perV => per-V OR pe-rV", () => {
      expect(removePePrefix("perabotan")).toEqual(["abotan", ["r"]]);
    });

    it("handles Pattern 03: perCAP => per-CAP", () => {
      expect(removePePrefix("perbedaan")).toEqual(["bedaan", null]);
    });

    it("handles Pattern 04: perCAerV => per-CAerV where C != 'r'", () => {
      expect(removePePrefix("perdaerah")).toEqual(["daerah", null]);
    });

    it("handles Pattern 05: pem{b|f|v} => pem-{b|f|v}", () => {
      expect(removePePrefix("pembeli")).toEqual(["beli", null]);
      expect(removePePrefix("pemfitnah")).toEqual(["fitnah", null]);
      expect(removePePrefix("pemvonis")).toEqual(["vonis", null]);
    });

    it("handles Pattern 06: pem{rV|V} => pe-m{rV|V} OR pe-p{rV|V}", () => {
      expect(removePePrefix("pemakan")).toEqual(["akan", ["m", "p"]]);
      expect(removePePrefix("pemrogram")).toEqual(["rogram", ["m", "p"]]);
    });

    it("handles Pattern 07: pen{c|d|j|s|t|z} => pen-{c|d|j|s|t|z}", () => {
      expect(removePePrefix("pencuri")).toEqual(["curi", null]);
      expect(removePePrefix("pendengar")).toEqual(["dengar", null]);
      expect(removePePrefix("penjual")).toEqual(["jual", null]);
      expect(removePePrefix("pensteril")).toEqual(["steril", null]);
      expect(removePePrefix("pentuduh")).toEqual(["tuduh", null]);
      expect(removePePrefix("penziarah")).toEqual(["ziarah", null]);
    });

    it("handles Pattern 08: penV => pe-nV OR pe-tV", () => {
      expect(removePePrefix("penulis")).toEqual(["ulis", ["n", "t"]]);
    });

    it("handles Pattern 09: pengC => peng-C", () => {
      expect(removePePrefix("pengganti")).toEqual(["ganti", null]);
    });

    it("handles Pattern 10: pengV", () => {
      expect(removePePrefix("pengecat")).toEqual(["cat", null]);
      expect(removePePrefix("pengambil")).toEqual(["ambil", ["k"]]);
    });

    it("handles Pattern 11: penyV => peny-sV OR pe-nyV", () => {
      expect(removePePrefix("penyapu")).toEqual(["apu", ["s", "ny"]]);
    });

    it("handles Pattern 12: pelV => pe-lV OR pel-V for pelajar", () => {
      expect(removePePrefix("pelajar")).toEqual(["ajar", null]);
      expect(removePePrefix("pelaut")).toEqual(["laut", null]);
    });

    it("handles Pattern 13: peCerV => per-erV where C != {r|w|y|l|m|n}", () => {
      expect(removePePrefix("peberang")).toEqual(["erang", null]);
    });

    it("handles Pattern 14: peCP => pe-CP", () => {
      expect(removePePrefix("petani")).toEqual(["tani", null]);
    });

    it("handles Pattern 15: peC1erC2 => pe-C1erC2", () => {
      expect(removePePrefix("pekerja")).toEqual(["kerja", null]);
    });

    it("returns unchanged word when no pe- pattern matches", () => {
      expect(removePePrefix("pe")).toEqual(["pe", null]);
    });
  });

  describe("removeBePrefix", () => {
    it("handles Pattern 01: berV => ber-V OR be-rV", () => {
      expect(removeBePrefix("berada")).toEqual(["ada", ["r"]]);
    });

    it("handles Pattern 02: berCAP => ber-CAP", () => {
      expect(removeBePrefix("berjalan")).toEqual(["jalan", null]);
    });

    it("handles Pattern 03: berCAerV => ber-CAerV", () => {
      expect(removeBePrefix("berdaerah")).toEqual(["daerah", null]);
    });

    it("handles Pattern 04: belajar => bel-ajar", () => {
      expect(removeBePrefix("belajar")).toEqual(["ajar", null]);
    });

    it("handles Pattern 05: beC1erC2 => be-C1erC2", () => {
      expect(removeBePrefix("bekerja")).toEqual(["kerja", null]);
    });

    it("returns unchanged word when no be- pattern matches", () => {
      expect(removeBePrefix("be")).toEqual(["be", null]);
    });
  });

  describe("removeTePrefix", () => {
    it("handles Pattern 01: terV => ter-V OR te-rV", () => {
      expect(removeTePrefix("terada")).toEqual(["ada", ["r"]]);
    });

    it("handles Pattern 02: terCerV => ter-CerV where C != 'r'", () => {
      expect(removeTePrefix("tercerita")).toEqual(["cerita", null]);
    });

    it("handles Pattern 03: terCP => ter-CP", () => {
      expect(removeTePrefix("terbawa")).toEqual(["bawa", null]);
    });

    it("handles Pattern 04: teC1erC2 => te-C1erC2", () => {
      expect(removeTePrefix("tepercaya")).toEqual(["percaya", null]);
    });

    it("handles Pattern 05: terC1erC2 => ter-C1erC2 where C1 != 'r'", () => {
      expect(removeTePrefix("terperam")).toEqual(["peram", null]);
    });

    it("returns unchanged word when no te- pattern matches", () => {
      expect(removeTePrefix("te")).toEqual(["te", null]);
    });
  });

  describe("removeInfix", () => {
    it("handles Pattern 01: CerV => CerV OR CV", () => {
      expect(removeInfix("rerata")).toEqual(["ata", ["rer", "r"]]);
      expect(removeInfix("telinjak")).toEqual(["injak", ["tel", "t"]]);
      expect(removeInfix("gemetar")).toEqual(["etar", ["gem", "g"]]);
    });

    it("handles Pattern 02: CinV => CinV OR CV", () => {
      expect(removeInfix("kinerja")).toEqual(["erja", ["kin", "k"]]);
    });

    it("returns unchanged word when no infix matches", () => {
      expect(removeInfix("kata")).toEqual(["kata", null]);
    });
  });

  describe("removePrefix", () => {
    it("removes simple prefixes: di, ke, se, ku, kau", () => {
      expect(removePrefix("dibatasi")).toEqual(["di", "batasi", []]);
      expect(removePrefix("kebiasaan")).toEqual(["ke", "biasaan", []]);
      expect(removePrefix("seorang")).toEqual(["se", "orang", []]);
      expect(removePrefix("kudapat")).toEqual(["ku", "dapat", []]);
      expect(removePrefix("kaudapat")).toEqual(["kau", "dapat", []]);
    });

    it("delegates to removeMePrefix for me- prefix", () => {
      expect(removePrefix("melihat")).toEqual(["me", "lihat", []]);
      expect(removePrefix("memakan")).toEqual(["me", "akan", ["m", "p"]]);
    });

    it("delegates to removePePrefix for pe- prefix", () => {
      expect(removePrefix("pelaut")).toEqual(["pe", "laut", []]);
      expect(removePrefix("pemakan")).toEqual(["pe", "akan", ["m", "p"]]);
    });

    it("delegates to removeBePrefix for be- prefix", () => {
      expect(removePrefix("berjalan")).toEqual(["be", "jalan", []]);
    });

    it("delegates to removeTePrefix for te- prefix", () => {
      expect(removePrefix("terbawa")).toEqual(["te", "bawa", []]);
    });

    it("delegates to removeInfix when no matching prefix found", () => {
      expect(removePrefix("kinerja")).toEqual(["", "erja", ["kin", "k"]]);
      expect(removePrefix("kata")).toEqual(["", "kata", []]);
    });
  });
});
