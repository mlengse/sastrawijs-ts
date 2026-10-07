const fs = require("fs");
const path = require("path");
const performance = require("perf_hooks").performance;

const { Stemmer } = require("../dist/sastrawijs-ts.cjs.js");
const Snowball = require("../../snowball-js/dist/Snowball.js");

const datasetPath = path.join(
  __dirname,
  "../../../data/kbbi-harvester-cdn/lexicon/derived_to_root.json",
);

function cleanRoot(rootWord) {
  if (!rootWord) return "";
  return rootWord
    .replace(/[\u00B2\u00B3\u00B9\u2070-\u2079\s]/g, "")
    .toLowerCase();
}

function runBenchmark() {
  console.log("Loading dataset from:", datasetPath);
  const rawData = JSON.parse(fs.readFileSync(datasetPath, "utf8"));

  // Filter single token derived words
  const testCases = [];
  for (const [word, rawRoot] of Object.entries(rawData)) {
    const cleanW = word.trim().toLowerCase();
    const cleanR = cleanRoot(rawRoot);
    if (
      !cleanW.includes(" ") &&
      cleanW !== cleanR &&
      cleanW.length > 0 &&
      cleanR.length > 0
    ) {
      testCases.push({ word: cleanW, expected: cleanR, original: word });
    }
  }

  console.log(`Total single-token test cases: ${testCases.length}`);

  // Benchmark 1: sastrawijs
  console.log("\n--- Running sastrawijs benchmark ---");
  const sastrawiStemmer = new Stemmer();

  // Warm up JS engine
  for (let i = 0; i < 100; i++) {
    sastrawiStemmer.stem("mempertanyakan");
  }

  const sastrawiStart = performance.now();
  let sastrawiCorrect = 0;
  const sastrawiFailures = [];
  let sastrawiTotalChars = 0;

  for (const tc of testCases) {
    sastrawiTotalChars += tc.word.length;
    const actual = sastrawiStemmer.stem(tc.word).toLowerCase();
    if (actual === tc.expected) {
      sastrawiCorrect++;
    } else {
      sastrawiFailures.push({ word: tc.word, expected: tc.expected, actual });
    }
  }
  const sastrawiEnd = performance.now();
  const sastrawiTimeMs = sastrawiEnd - sastrawiStart;
  const sastrawiSec = sastrawiTimeMs / 1000;
  const sastrawiOpsPerSec = testCases.length / sastrawiSec;
  const sastrawiAccuracy = (sastrawiCorrect / testCases.length) * 100;

  console.log(`sastrawijs completed in ${sastrawiSec.toFixed(3)}s`);
  console.log(
    `Accuracy: ${sastrawiCorrect}/${testCases.length} (${sastrawiAccuracy.toFixed(2)}%)`,
  );
  console.log(`Throughput: ${sastrawiOpsPerSec.toFixed(0)} words/sec`);

  // Benchmark 2: snowball-js
  console.log("\n--- Running snowball-js (Indonesian) benchmark ---");
  const snowballStemmer = Snowball("indonesian");

  // Warm up
  for (let i = 0; i < 100; i++) {
    snowballStemmer.setCurrent("mempertanyakan");
    snowballStemmer.stem();
    snowballStemmer.getCurrent();
  }

  const snowballStart = performance.now();
  let snowballCorrect = 0;
  const snowballFailures = [];

  for (const tc of testCases) {
    snowballStemmer.setCurrent(tc.word);
    snowballStemmer.stem();
    const actual = (snowballStemmer.getCurrent() || "").toLowerCase();
    if (actual === tc.expected) {
      snowballCorrect++;
    } else {
      snowballFailures.push({ word: tc.word, expected: tc.expected, actual });
    }
  }
  const snowballEnd = performance.now();
  const snowballTimeMs = snowballEnd - snowballStart;
  const snowballSec = snowballTimeMs / 1000;
  const snowballOpsPerSec = testCases.length / snowballSec;
  const snowballAccuracy = (snowballCorrect / testCases.length) * 100;

  console.log(`snowball-js completed in ${snowballSec.toFixed(3)}s`);
  console.log(
    `Accuracy: ${snowballCorrect}/${testCases.length} (${snowballAccuracy.toFixed(2)}%)`,
  );
  console.log(`Throughput: ${snowballOpsPerSec.toFixed(0)} words/sec`);

  // Categorize errors for sastrawijs & snowball
  function categorizeErrors(failures) {
    const cats = {
      reduplication: 0, // contains dash
      unchanged: 0, // actual === word (rule gap / under-stemming)
      other: 0,
    };
    for (const f of failures) {
      if (f.word.includes("-")) {
        cats.reduplication++;
      } else if (f.actual === f.word) {
        cats.unchanged++;
      } else {
        cats.other++;
      }
    }
    return cats;
  }

  const results = {
    totalTestCases: testCases.length,
    sastrawijs: {
      name: "sastrawijs",
      language: "JavaScript (Node.js)",
      correct: sastrawiCorrect,
      total: testCases.length,
      accuracyPct: parseFloat(sastrawiAccuracy.toFixed(2)),
      timeSeconds: parseFloat(sastrawiSec.toFixed(4)),
      timeMs: parseFloat(sastrawiTimeMs.toFixed(2)),
      wordsPerSec: parseFloat(sastrawiOpsPerSec.toFixed(2)),
      avgLatencyUs: parseFloat(
        ((sastrawiTimeMs * 1000) / testCases.length).toFixed(2),
      ),
      errorCategories: categorizeErrors(sastrawiFailures),
      sampleFailures: sastrawiFailures.slice(0, 20),
    },
    snowballjs: {
      name: "snowball-js",
      language: "JavaScript (Node.js)",
      correct: snowballCorrect,
      total: testCases.length,
      accuracyPct: parseFloat(snowballAccuracy.toFixed(2)),
      timeSeconds: parseFloat(snowballSec.toFixed(4)),
      timeMs: parseFloat(snowballTimeMs.toFixed(2)),
      wordsPerSec: parseFloat(snowballOpsPerSec.toFixed(2)),
      avgLatencyUs: parseFloat(
        ((snowballTimeMs * 1000) / testCases.length).toFixed(2),
      ),
      errorCategories: categorizeErrors(snowballFailures),
      sampleFailures: snowballFailures.slice(0, 20),
    },
  };

  const outputPath = path.join(__dirname, "js_stemmers_results.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nJS benchmark results written to ${outputPath}`);
}

runBenchmark();
