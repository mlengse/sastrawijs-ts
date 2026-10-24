const { performance } = require("perf_hooks");
const Tokenizer =
  require("../dist/sastrawijs-ts.cjs.js").Tokenizer ||
  require("../dist/sastrawijs-ts.cjs.js").default;

const samples = [
  "Perekonomian Indonesia sedang dalam pertumbuhan yang sangat pesat di tahun 2024.",
  "Kunjungi https://example.com/test?query=123 dan hubungi support@example.co.id sekarang juga!",
  "<b>Sangat bagus!</b> @user123 menyukai #pembangunan #ekonomi &amp; &#72;ello &nbsp; world$%^",
  "   Beberapa   kata   dengan   banyak   spasi   dan   karakter   khusus   !!!   ",
  "Standard text without any HTML entities, URLs, or special characters to strip.",
];

// Repeat samples to create a realistic text batch
const textBatch = [];
for (let i = 0; i < 2000; i++) {
  textBatch.push(...samples);
}

console.log(`Benchmarking Tokenizer with ${textBatch.length} sentences...`);

const tokenizer = new Tokenizer();

// Warm up
for (let i = 0; i < 500; i++) {
  tokenizer.tokenize(textBatch[i % textBatch.length]);
}

const ITERATIONS = 10;
const times = [];

for (let iter = 0; iter < ITERATIONS; iter++) {
  const start = performance.now();
  let tokenCount = 0;
  for (let i = 0; i < textBatch.length; i++) {
    const tokens = tokenizer.tokenize(textBatch[i]);
    tokenCount += tokens.length;
  }
  const end = performance.now();
  times.push(end - start);
}

const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
const opsPerSec = (textBatch.length / (avgTime / 1000)).toFixed(2);

console.log(`Average time: ${avgTime.toFixed(2)} ms`);
console.log(`Throughput: ${opsPerSec} sentences/sec`);
