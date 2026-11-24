import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Shipped fix: one cheek bite became the default route for later chews.
const line =
  "v1.7.4: fixed a regression that sent every chew back into the same cheek bite.";

const dir = process.env.MAKEFUN_OUTPUT_DIR;
if (!dir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const codePoints = Array.from(line).length;
const utf16 = line.length;
const utf8 = Buffer.byteLength(line, "utf8");
if (
  line.length === 0 ||
  line !== line.trim() ||
  line.includes("\n") ||
  codePoints > 160 ||
  utf16 > 160 ||
  utf8 > 160
) {
  console.error(
    `refusing line code_points=${codePoints} utf16=${utf16} utf8_bytes=${utf8}`,
  );
  process.exit(1);
}

const file = join(dir, "entry.txt");
writeFileSync(file, line, { encoding: "utf8" });

const written = readFileSync(file);
const sha256 = createHash("sha256").update(written).digest("hex");
console.log(`code_points=${codePoints}`);
console.log(`utf16=${utf16}`);
console.log(`utf8_bytes=${utf8}`);
console.log(`sha256=${sha256}`);
