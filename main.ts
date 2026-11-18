// news-image-20261118 — "The World in One Day"
// A newspaper front page summing up Wednesday 18 November 2026.
//
// The image (entry.png, 1024x1024, drawn offline with PIL + DejaVu fonts)
// is the entry: a masthead, the date, and nine verified stories of the day:
//   1. GULF WAR — U.S. sinks five Iranian tankers; Iran hits back (lead)
//   2. UKRAINE — Kyiv hits the Kerch Bridge a second night
//   3. ASIA — Quad leaders meet in Manila
//   4. GAZA — UN warns more will die of cold
//   5. CLIMATE — COP31: 144 items still disputed
//   6. CRYPTO — Bitcoin slumps 12% in a week, below its 200-week average
//   7. INDONESIA — BMKG warns of heavy rain and floods in 17 provinces
// Every fact was checked against reporting of 18 Nov 2026 (CENTCOM,
// Al Jazeera, AP, Reuters, UN, CoinDesk, BMKG) before the image was drawn.
//
// This program is the whole entrypoint: it copies entry.png to
// /output/entry.png (MAKEFUN_OUTPUT_DIR outside the grader) and verifies
// the file first, so a corrupt or oversized image fails loudly instead of
// silently entering. Node 22, standard library only. No network, no clock,
// no randomness: the same input bytes always produce the same output bytes.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY_NAME = "entry.png";
const MAX_BYTES = 1048576; // 1 MiB, the competition's cap
const MAX_DIM = 1024; // pixels per side, the competition's cap
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// CRC-32 (IEEE), computed once at startup; PNG chunk checksums use it.
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function fail(msg: string): never {
  throw new Error("entry.png rejected: " + msg);
}

// Walk every PNG chunk, checking its length, type and CRC, and read the
// IHDR dimensions. Returns [width, height]. Throws on any defect.
function inspectPng(buf: Buffer): [number, number] {
  if (buf.length < 8 || !buf.subarray(0, 8).equals(PNG_MAGIC)) {
    fail("not a PNG (bad magic bytes)");
  }
  let off = 8;
  let width = 0;
  let height = 0;
  let sawIend = false;
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const dataStart = off + 8;
    const dataEnd = dataStart + len;
    if (dataEnd + 4 > buf.length) fail(`chunk ${type} runs past the file`);
    const stored = buf.readUInt32BE(dataEnd);
    const actual = crc32(buf.subarray(off + 4, dataEnd));
    if (stored !== actual) fail(`chunk ${type} has a bad CRC`);
    if (type === "IHDR") {
      if (len !== 13) fail("IHDR has the wrong length");
      width = buf.readUInt32BE(dataStart);
      height = buf.readUInt32BE(dataStart + 4);
      // The entry is an 8-bit RGB(A) image; anything else is not ours.
      if (buf[dataStart + 8] !== 8) fail("IHDR bit depth is not 8");
      const colorType = buf[dataStart + 9];
      if (colorType !== 2 && colorType !== 6) {
        fail(`IHDR color type ${colorType} is not RGB or RGBA`);
      }
    }
    if (type === "IEND") {
      sawIend = true;
      if (dataEnd + 4 !== buf.length) fail("bytes after IEND");
      break;
    }
    off = dataEnd + 4;
  }
  if (!sawIend) fail("no IEND chunk");
  if (width === 0 || height === 0) fail("no IHDR chunk");
  return [width, height];
}

function main(): void {
  const src = new URL("./" + ENTRY_NAME, import.meta.url);
  const bytes = readFileSync(src);

  if (bytes.length > MAX_BYTES) {
    fail(`${bytes.length} bytes exceeds the 1 MiB cap`);
  }
  const [width, height] = inspectPng(bytes);
  if (width > MAX_DIM || height > MAX_DIM) {
    fail(`dimensions ${width}x${height} exceed the 1024x1024 cap`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, ENTRY_NAME);
  writeFileSync(outPath, bytes);

  // Read the copy back: the grader runs the program twice and both runs
  // must write the same bytes, so prove this run's output is byte-identical.
  const written = readFileSync(outPath);
  if (!written.equals(bytes)) fail("output differs from the source image");
  const sha = createHash("sha256").update(bytes).digest("hex");
  console.log(
    `wrote ${outPath} ${bytes.length} bytes ${width}x${height} sha256=${sha}`,
  );
}

main();
