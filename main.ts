// news-image-20261118 — "The World in One Day"
// A newspaper front page summing up Wednesday 18 November 2026.
//
// The image (entry.png, 1024x1024, JPEG) is the entry: a masthead, the
// date, 12 featured stories (numbered 1-12 and marked on the dotted world
// map) plus 24 more in a numbered list — 36 stories in one page:
//   1. GULF WAR — U.S. sinks five Iranian tankers; Iran hits back (lead)
//   2. UKRAINE — Kyiv hits the Kerch Bridge a second night
//   3. ASIA — Quad leaders meet in Manila
//   4. NVIDIA — $115.8bn quarter
//   5. CYCLONE AKVAN — bears down on India
//   6. KNESSET — Kahana elected speaker, blow to Netanyahu
//   7. EU LOAN — €45bn for Ukraine proposed
//   8. CHINA–CANADA — Xi, Carney extend trade deals
//   9. GAZA — UN warns more will die of cold
//  10. CLIMATE — COP31: 144 items still disputed
//  11. CRYPTO — Bitcoin slumps 12% in a week, below its 200-week average
//  12. INDONESIA — BMKG warns of heavy rain and floods in 17 provinces
//  13-36. Romania quake, An-12 crash, U.S. measles, Dhoni retires,
//  APEC trilateral, Apple outage, India GDP, Amazon $7bn, Japan
//  scrambles, Pope Leo, Grammys, Baidu, Taiwan, Serbia, Mongolia,
//  Pattinson as Bond, N. Korea missile, France M51.3, Voyager 1,
//  Australia sanctions, DR Congo, Ecuador, France strikes, Spain strike.
// Every fact was checked against reporting of 18 Nov 2026 (CENTCOM,
// Al Jazeera, AP, Reuters, AFP, BBC, UN, CoinDesk, BMKG, IMD) before the
// image was drawn. Disputed claims are attributed, not stated as fact.
//
// How the image was made: the poster was composed offline with
// Python/PIL and DejaVu fonts, then enhanced with Gemini at the entrant's
// direction (richer colours, stronger contrast, sharper illustrations;
// all text kept exactly the same), then resized to 1024x1024 and saved
// as JPEG quality 90. The file keeps the name entry.png, as the rules
// require: the format is told apart by its first bytes, not its name.
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

function fail(msg: string): never {
  throw new Error("entry.png rejected: " + msg);
}

// Markers with no length field after them.
function isStandalone(code: number): boolean {
  return code === 0x01 || (code >= 0xd0 && code <= 0xd9);
}

// A frame (start-of-frame) marker carries the image dimensions.
function isSof(code: number): boolean {
  return code === 0xc0 || code === 0xc1 || code === 0xc2;
}

// Walk the JPEG segments, reading the dimensions from the frame header,
// then scan the entropy data to the end marker. Returns [width, height].
// Throws on any defect: bad magic, a segment running past the file, no
// frame header, dimensions over the cap, a stray marker inside the scan
// data, or no end marker at the very end of the file.
function inspectJpeg(buf: Buffer): [number, number] {
  if (
    buf.length < 4 ||
    buf[0] !== 0xff ||
    buf[1] !== 0xd8 ||
    buf[2] !== 0xff
  ) {
    fail("not a JPEG (bad magic bytes)");
  }
  let off = 2;
  let width = 0;
  let height = 0;
  let sawSof = false;
  while (off + 4 <= buf.length) {
    if (buf[off] !== 0xff) fail(`expected a marker at offset ${off}`);
    let code = buf[off + 1];
    // Skip fill bytes (0xFF padding between markers).
    while (code === 0xff) {
      off += 1;
      if (off + 1 >= buf.length) fail("file ends inside a marker");
      code = buf[off + 1];
    }
    if (code === 0xd9) fail("end marker before the scan data");
    if (isStandalone(code)) {
      off += 2;
      continue;
    }
    const len = buf.readUInt16BE(off + 2);
    if (len < 2) fail(`segment 0x${code.toString(16)} has a bad length`);
    const dataStart = off + 4;
    const dataEnd = dataStart + len - 2;
    if (dataEnd > buf.length) {
      fail(`segment 0x${code.toString(16)} runs past the file`);
    }
    if (isSof(code)) {
      if (len < 7) fail("frame header is too short");
      // Frame data: precision (1), height (2), width (2), components.
      if (buf[dataStart] !== 8) fail("frame precision is not 8-bit");
      height = buf.readUInt16BE(dataStart + 1);
      width = buf.readUInt16BE(dataStart + 3);
      sawSof = true;
    }
    if (code === 0xda) {
      // Start of scan: entropy data follows. Walk it byte by byte; a
      // 0xFF inside it is always an escape (0x00), a restart (0xD0-0xD7)
      // or the end marker (0xD9), which must sit at the file's last
      // two bytes.
      let i = dataEnd;
      while (i + 1 < buf.length) {
        if (buf[i] !== 0xff) {
          i += 1;
          continue;
        }
        const next = buf[i + 1];
        if (next === 0x00 || (next >= 0xd0 && next <= 0xd7)) {
          i += 2;
          continue;
        }
        if (next === 0xd9) {
          if (i !== buf.length - 2) fail("bytes after the end marker");
          if (!sawSof) fail("no frame header before the scan data");
          return [width, height];
        }
        fail(`unexpected marker 0x${next.toString(16)} in the scan data`);
      }
      fail("no end marker");
    }
    off = dataEnd;
  }
  fail("no scan data");
}

function main(): void {
  const src = new URL("./" + ENTRY_NAME, import.meta.url);
  const bytes = readFileSync(src);

  if (bytes.length > MAX_BYTES) {
    fail(`${bytes.length} bytes exceeds the 1 MiB cap`);
  }
  const [width, height] = inspectJpeg(bytes);
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
