const fs = require("fs");
const path = require("path");
const { Stemmer } = require("../dist/sastrawijs-ts.cjs.js");

const stemmer = new Stemmer();
const defaultKbbiDir = path.join(
  __dirname,
  "../data/kbbi-harvester-cdn/word-details",
);
const kbbiDir = process.argv[2] || process.env.KBBI_DATA_DIR || defaultKbbiDir;

let total = 0;
let success = 0;
const failures = [];

function cleanRoot(rootWord) {
  if (!rootWord) return "";
  // Remove superscript numbers (e.g. ada¹) and spaces
  return rootWord
    .replace(/[\u00B2\u00B3\u00B9\u2070-\u2079\s]/g, "")
    .toLowerCase();
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith(".json")) {
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        if (data.entries && data.entries.length > 0) {
          const rootWord = cleanRoot(data.entries[0].rootWord);
          const word = (data.word || "").toLowerCase();

          // Skip if word is already the root word (we want to test stemming of derivations)
          if (word && rootWord && word !== rootWord) {
            total++;
            const stemmed = stemmer.stem(word).toLowerCase();
            if (stemmed === rootWord) {
              success++;
            } else {
              failures.push({ word, expected: rootWord, actual: stemmed });
            }
          }
        }
      } catch (err) {
        // ignore JSON parse errors
      }
    }
  }
}

console.log("Mengevaluasi stemmer Sastrawi menggunakan dataset KBBI...");

if (!fs.existsSync(kbbiDir)) {
  console.error(`Directory not found: ${kbbiDir}`);
  console.error("Usage: node scripts/evaluate-kbbi.js <path-to-word-details>");
  console.error("       or set the KBBI_DATA_DIR environment variable.");
  process.exit(1);
}

processDirectory(kbbiDir);

console.log("Evaluasi selesai.");
console.log(`Total kata turunan diuji: ${total}`);
console.log(`Berhasil: ${success}`);
console.log(`Gagal: ${failures.length}`);
if (total > 0) {
  console.log(`Akurasi: ${((success / total) * 100).toFixed(2)}%`);
}

fs.writeFileSync(
  path.join(__dirname, "../failed-stems.json"),
  JSON.stringify(failures, null, 2),
);
console.log(`Daftar kata yang gagal disimpan di failed-stems.json`);
