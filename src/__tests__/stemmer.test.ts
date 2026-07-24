import Stemmer from "../stemmer";

const customDictionary = [
  "hancur", "benar", "apa", "siapa", "jubah", "baju", "beli", "celana",
  "hantu", "jual", "buku", "milik", "kulit", "sakit", "kasih", "buang",
  "suap", "nilai", "beri", "rambut", "adu", "suara", "daerah", "ajar",
  "kerja", "ternak", "asing", "raup", "gerak", "puruk", "terbang", "lipat",
  "ringkas", "warna", "yakin", "bangun", "fitnah", "vonis", "baru", "ajar",
  "tangkap", "kupas", "minum", "pukul", "cinta", "dua", "jauh", "ziarah",
  "nuklir", "gila", "hajar", "qasar", "udara", "populer", "warna", "yoga",
  "adil", "rumah", "muka", "labuh", "tarung", "tebar", "indah", "daya",
  "untung", "sepuluh", "ekonomi", "makmur", "telah", "serta", "percaya",
  "pengaruh", "kritik", "seko", "sekolah", "tahan", "capa", "capai", "mula",
  "mulai", "petan", "tani", "aba", "abai", "balas", "balik", "peran", "medan",
  "syukur", "syarat", "bom", "promosi", "proteksi", "prediksi", "kaji",
  "sembunyi", "langgan", "laku", "baik", "terang", "iman", "bisik", "taat",
  "puas", "makan", "nyala", "nyanyi", "nyata", "nyawa", "rata", "lembut",
  "ligas", "budaya", "karya", "ideal", "final", "taat", "tiru", "sepak",
  "kuasa", "malaikat", "nikmat", "lewat", "nganga", "allah",
];

describe("Stemmer", () => {
  const stemmer = new Stemmer(customDictionary);

  describe("particle removal", () => {
    it("removes -lah particle", () => {
      expect(stemmer.stem("hancurlah")).toBe("hancur");
      expect(stemmer.stem("kasihilah")).toBe("kasih");
      expect(stemmer.stem("allah-lah")).toBe("allah");
    });

    it("removes -kah particle", () => {
      expect(stemmer.stem("benarkah")).toBe("benar");
    });

    it("removes -tah particle", () => {
      expect(stemmer.stem("apatah")).toBe("apa");
    });

    it("removes -pun particle", () => {
      expect(stemmer.stem("siapapun")).toBe("siapa");
    });
  });

  describe("possessive removal", () => {
    it("removes -ku possessive", () => {
      expect(stemmer.stem("jubahku")).toBe("jubah");
      expect(stemmer.stem("kulitkupun")).toBe("kulit");
      expect(stemmer.stem("berikanku")).toBe("beri");
      expect(stemmer.stem("nikmat-Ku")).toBe("nikmat");
    });

    it("removes -mu possessive", () => {
      expect(stemmer.stem("bajumu")).toBe("baju");
      expect(stemmer.stem("sakitimu")).toBe("sakit");
      expect(stemmer.stem("keberuntunganmu")).toBe("untung");
    });

    it("removes -nya possessive", () => {
      expect(stemmer.stem("celananya")).toBe("celana");
      expect(stemmer.stem("beriannya")).toBe("beri");
      expect(stemmer.stem("miliknyalah")).toBe("milik");
      expect(stemmer.stem("pelakunyalah")).toBe("laku");
      expect(stemmer.stem("kebaikannya")).toBe("baik");
      expect(stemmer.stem("medannya")).toBe("medan");
      expect(stemmer.stem("menyatakannya")).toBe("nyata");
    });
  });

  describe("suffix removal", () => {
    it("removes -i suffix", () => {
      expect(stemmer.stem("hantui")).toBe("hantu");
      expect(stemmer.stem("mencintai")).toBe("cinta");
      expect(stemmer.stem("menduakan")).toBe("dua");
      expect(stemmer.stem("menjauhi")).toBe("jauh");
      expect(stemmer.stem("menggilai")).toBe("gila");
    });

    it("removes -kan suffix", () => {
      expect(stemmer.stem("belikan")).toBe("beli");
      expect(stemmer.stem("bukumukah")).toBe("buku");
      expect(stemmer.stem("bisikan")).toBe("bisik");
      expect(stemmer.stem("terasingkan")).toBe("asing");
      expect(stemmer.stem("membangunkan")).toBe("bangun");
      expect(stemmer.stem("pelangganmukah")).toBe("langgan");
      expect(stemmer.stem("menyanyikan")).toBe("nyanyi");
      expect(stemmer.stem("mempromosikan")).toBe("promosi");
      expect(stemmer.stem("mensyaratkan")).toBe("syarat");
    });

    it("removes -an suffix", () => {
      expect(stemmer.stem("jualan")).toBe("jual");
      expect(stemmer.stem("kesakitan")).toBe("sakit");
      expect(stemmer.stem("perbaikan")).toBe("baik");
      expect(stemmer.stem("bermakanan")).toBe("makan");
      expect(stemmer.stem("pembangunan")).toBe("bangun");
      expect(stemmer.stem("peranan")).toBe("peran");
      expect(stemmer.stem("penyawaan")).toBe("nyawa");
      expect(stemmer.stem("bertebaran")).toBe("tebar");
    });
  });

  describe("me- prefix", () => {
    it("me{l|r|w|y}V", () => {
      expect(stemmer.stem("melipat")).toBe("lipat");
    });

    it("mem{b|f|v}", () => {
      expect(stemmer.stem("membangun")).toBe("bangun");
      expect(stemmer.stem("memfitnah")).toBe("fitnah");
      expect(stemmer.stem("memvonis")).toBe("vonis");
    });

    it("mempe", () => {
      expect(stemmer.stem("memperbaru")).toBe("baru");
      expect(stemmer.stem("mempelajar")).toBe("ajar");
      expect(stemmer.stem("mempopulerkan")).toBe("populer");
      expect(stemmer.stem("mempengaruhi")).toBe("pengaruh");
      expect(stemmer.stem("mempromosikan")).toBe("promosi");
      expect(stemmer.stem("memproteksi")).toBe("proteksi");
      expect(stemmer.stem("memprediksi")).toBe("prediksi");
    });

    it("mem{rV|V}", () => {
      expect(stemmer.stem("meminum")).toBe("minum");
      expect(stemmer.stem("memukul")).toBe("pukul");
      expect(stemmer.stem("memuaskan")).toBe("puas");
    });

    it("men{c|d|j|s|t|z}", () => {
      expect(stemmer.stem("mencinta")).toBe("cinta");
      expect(stemmer.stem("mendua")).toBe("dua");
      expect(stemmer.stem("menjauh")).toBe("jauh");
      expect(stemmer.stem("menziarah")).toBe("ziarah");
      expect(stemmer.stem("menuklir")).toBe("nuklir");
      expect(stemmer.stem("menangkap")).toBe("tangkap");
    });

    it("menV", () => {
      expect(stemmer.stem("menahan")).toBe("tahan");
    });

    it("meng{g|h|q|k}", () => {
      expect(stemmer.stem("menggila")).toBe("gila");
      expect(stemmer.stem("menghajar")).toBe("hajar");
      expect(stemmer.stem("mengqasar")).toBe("qasar");
      expect(stemmer.stem("mengupas")).toBe("kupas");
      expect(stemmer.stem("mengkritik")).toBe("kritik");
      expect(stemmer.stem("mengudara")).toBe("udara");
    });

    it("mengV", () => {
      expect(stemmer.stem("menganga")).toBe("nganga");
    });

    it("menyV", () => {
      expect(stemmer.stem("menyala")).toBe("nyala");
      expect(stemmer.stem("menyanyikan")).toBe("nyanyi");
      expect(stemmer.stem("menyatakannya")).toBe("nyata");
      expect(stemmer.stem("menyuarakan")).toBe("suara");
      expect(stemmer.stem("mensyukuri")).toBe("syukur");
    });

    it("mempV", () => {
      expect(stemmer.stem("mewarnai")).toBe("warna");
      expect(stemmer.stem("meyakinkan")).toBe("yakin");
    });
  });

  describe("pe- prefix", () => {
    it("pe{w|y}V", () => {
      expect(stemmer.stem("pewarna")).toBe("warna");
      expect(stemmer.stem("peyoga")).toBe("yoga");
    });

    it("perV", () => {
      expect(stemmer.stem("peradilan")).toBe("adil");
      expect(stemmer.stem("perumahan")).toBe("rumah");
      expect(stemmer.stem("permuka")).toBe("muka");
      expect(stemmer.stem("perdaerah")).toBe("daerah");
    });

    it("pem{b|f|v}", () => {
      expect(stemmer.stem("pembangun")).toBe("bangun");
      expect(stemmer.stem("pemfitnah")).toBe("fitnah");
      expect(stemmer.stem("pemvonis")).toBe("vonis");
      expect(stemmer.stem("peminum")).toBe("minum");
      expect(stemmer.stem("pemukul")).toBe("pukul");
    });

    it("pen{c|d|j|s|t|z}", () => {
      expect(stemmer.stem("pencinta")).toBe("cinta");
      expect(stemmer.stem("pendua")).toBe("dua");
      expect(stemmer.stem("penjauh")).toBe("jauh");
      expect(stemmer.stem("penziarah")).toBe("ziarah");
      expect(stemmer.stem("penuklir")).toBe("nuklir");
      expect(stemmer.stem("penangkap")).toBe("tangkap");
    });

    it("penV", () => {
      expect(stemmer.stem("penyuara")).toBe("suara");
    });

    it("pengC", () => {
      expect(stemmer.stem("penggila")).toBe("gila");
      expect(stemmer.stem("penghajar")).toBe("hajar");
      expect(stemmer.stem("pengqasar")).toBe("qasar");
      expect(stemmer.stem("pengudara")).toBe("udara");
      expect(stemmer.stem("pengupas")).toBe("kupas");
      expect(stemmer.stem("pengkajian")).toBe("kaji");
      expect(stemmer.stem("pengebom")).toBe("bom");
    });

    it("pelV", () => {
      expect(stemmer.stem("pelajar")).toBe("ajar");
      expect(stemmer.stem("pelabuh")).toBe("labuh");
    });

    it("peCerV", () => {
      expect(stemmer.stem("pekerja")).toBe("kerja");
    });

    it("peC1erC2", () => {
      expect(stemmer.stem("peserta")).toBe("serta");
    });

    it("peCP", () => {
      expect(stemmer.stem("petarung")).toBe("tarung");
    });

    it("pelanggan and pelaku", () => {
      expect(stemmer.stem("pelanggan")).toBe("langgan");
      expect(stemmer.stem("pelaku")).toBe("laku");
    });
  });

  describe("be- prefix", () => {
    it("berV", () => {
      expect(stemmer.stem("beradu")).toBe("adu");
      expect(stemmer.stem("berambut")).toBe("rambut");
      expect(stemmer.stem("bersuara")).toBe("suara");
      expect(stemmer.stem("berdaerah")).toBe("daerah");
    });

    it("belajar", () => {
      expect(stemmer.stem("belajar")).toBe("ajar");
    });

    it("berCAP", () => {
      expect(stemmer.stem("bekerja")).toBe("kerja");
      expect(stemmer.stem("beternak")).toBe("ternak");
    });

    it("berC1erC2", () => {
      expect(stemmer.stem("bersekolah")).toBe("sekolah");
      expect(stemmer.stem("bertahan")).toBe("tahan");
    });
  });

  describe("te- prefix", () => {
    it("terV", () => {
      expect(stemmer.stem("terasing")).toBe("asing");
      expect(stemmer.stem("teraup")).toBe("raup");
      expect(stemmer.stem("tergerak")).toBe("gerak");
      expect(stemmer.stem("terpuruk")).toBe("puruk");
    });

    it("terCP", () => {
      expect(stemmer.stem("terpercaya")).toBe("percaya");
    });
  });

  describe("infix removal", () => {
    it("rerata (CerV)", () => {
      expect(stemmer.stem("rerata")).toBe("rata");
    });

    it("lelembut (CerV)", () => {
      expect(stemmer.stem("lelembut")).toBe("lembut");
    });

    it("lemigas (CerV)", () => {
      expect(stemmer.stem("lemigas")).toBe("ligas");
    });

    it("kinerja (CinV)", () => {
      expect(stemmer.stem("kinerja")).toBe("kerja");
    });
  });

  describe("combined affixes", () => {
    it("prefix + suffix combinations", () => {
      expect(stemmer.stem("meringkas")).toBe("ringkas");
      expect(stemmer.stem("bersembunyi")).toBe("sembunyi");
      expect(stemmer.stem("bersembunyilah")).toBe("sembunyi");
      expect(stemmer.stem("membangunkan")).toBe("bangun");
      expect(stemmer.stem("terasingkan")).toBe("asing");
      expect(stemmer.stem("bertebaran")).toBe("tebar");
    });

    it("kau- prefix", () => {
      expect(stemmer.stem("kupukul")).toBe("pukul");
      expect(stemmer.stem("kauhajar")).toBe("hajar");
    });

    it("ku- prefix", () => {
      expect(stemmer.stem("kuasa-Mu")).toBe("kuasa");
    });

    it("complex combinations", () => {
      expect(stemmer.stem("mencapai")).toBe("capai");
      expect(stemmer.stem("dimulai")).toBe("mulai");
      expect(stemmer.stem("memberdayakan")).toBe("daya");
      expect(stemmer.stem("persemakmuran")).toBe("makmur");
      expect(stemmer.stem("kesepersepuluhnya")).toBe("sepuluh");
    });
  });

  describe("custom dictionary", () => {
    it("stems with custom dictionary", () => {
      const custom = new Stemmer(["lari", "tulis"]);
      custom.addToDict(["cepat"]);
      expect(custom.stem("berlari")).toBe("lari");
      expect(custom.stem("menulis")).toBe("tulis");
      expect(custom.stem("bercepatan")).toBe("cepat");
    });

    it("removes from dictionary", () => {
      const custom = new Stemmer(["lari", "tulis"]);
      custom.remove(["lari"]);
      expect(custom.stem("berlari")).toBe("berlari");
    });
  });

  describe("edge cases", () => {
    it("returns short words as-is", () => {
      expect(stemmer.stem("mei")).toBe("mei");
      expect(stemmer.stem("bui")).toBe("bui");
    });

    it("returns unknown words as-is", () => {
      expect(stemmer.stem("marwan")).toBe("marwan");
      expect(stemmer.stem("subarkah")).toBe("subarkah");
    });

    it("handles case insensitivity", () => {
      expect(stemmer.stem("Perekonomian")).toBe("ekonomi");
    });

    it("returns empty string for non-string input", () => {
      expect(stemmer.stem(null as unknown as string)).toBe("");
      expect(stemmer.stem(undefined as unknown as string)).toBe("");
      expect(stemmer.stem(123 as unknown as string)).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(stemmer.stem("")).toBe("");
    });

    it("returns single character as-is", () => {
      expect(stemmer.stem("a")).toBe("a");
    });

    it("returns two character word as-is", () => {
      expect(stemmer.stem("ab")).toBe("ab");
    });

    it("handles words in dictionary directly", () => {
      expect(stemmer.stem("nilai")).toBe("nilai");
      expect(stemmer.stem("hancur")).toBe("hancur");
    });
  });

  describe("additional stems", () => {
    it("prefix-only removals", () => {
      expect(stemmer.stem("menerangi")).toBe("terang");
      expect(stemmer.stem("berimanlah")).toBe("iman");
      expect(stemmer.stem("berpelanggan")).toBe("langgan");
      expect(stemmer.stem("terabai")).toBe("abai");
      expect(stemmer.stem("mengebom")).toBe("bom");
    });

    it("suffix + prefix combinations", () => {
      expect(stemmer.stem("petani")).toBe("tani");
      expect(stemmer.stem("finalisasi")).toBe("final");
      expect(stemmer.stem("idealis")).toBe("ideal");
      expect(stemmer.stem("idealisme")).toBe("ideal");
      expect(stemmer.stem("mentaati")).toBe("taat");
      expect(stemmer.stem("melewati")).toBe("lewat");
    });
  });
});
