import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const approvedSvgSha256 = "87b76a9408c8c37d7357fa30656fb8479fccbc32bf8639f5a326c8be051f9c8c";

function crc32(input: Buffer) {
  let crc = 0xffffffff;
  for (const byte of input) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function parsePng(image: Buffer) {
  expect(image.subarray(0, 8)).toEqual(pngSignature);

  const chunks: string[] = [];
  let width = 0;
  let height = 0;
  let offset = 8;
  let sawHeader = false;
  let sawData = false;
  let sawEnd = false;

  while (offset < image.length) {
    expect(offset + 12).toBeLessThanOrEqual(image.length);
    const length = image.readUInt32BE(offset);
    const type = image.subarray(offset + 4, offset + 8).toString("ascii");
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const chunkEnd = dataEnd + 4;

    expect(chunkEnd).toBeLessThanOrEqual(image.length);
    expect(image.readUInt32BE(dataEnd)).toBe(
      crc32(image.subarray(offset + 4, dataEnd)),
    );

    expect(["IHDR", "IDAT", "IEND"]).toContain(type);

    if (type === "IHDR") {
      expect(sawHeader).toBe(false);
      expect(chunks).toHaveLength(0);
      expect(length).toBe(13);
      width = image.readUInt32BE(dataStart);
      height = image.readUInt32BE(dataStart + 4);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      expect(image[dataStart + 8]).toBe(8);
      expect(image[dataStart + 9]).toBe(6);
      expect(image[dataStart + 10]).toBe(0);
      expect(image[dataStart + 11]).toBe(0);
      expect(image[dataStart + 12]).toBe(0);
      sawHeader = true;
    } else if (type === "IDAT") {
      expect(sawHeader).toBe(true);
      expect(sawData || chunks.at(-1) === "IHDR").toBe(true);
      expect(sawEnd).toBe(false);
      expect(length).toBeGreaterThan(0);
      sawData = true;
    } else {
      expect(sawHeader).toBe(true);
      expect(sawData).toBe(true);
      expect(sawEnd).toBe(false);
      expect(length).toBe(0);
      sawEnd = true;
    }

    chunks.push(type);
    offset = chunkEnd;
    if (type === "IEND") break;
  }

  expect(chunks[0]).toBe("IHDR");
  expect(chunks.at(-1)).toBe("IEND");
  expect(sawHeader && sawData && sawEnd).toBe(true);
  expect(offset).toBe(image.length);
  return { width, height, chunks };
}

function parseIco(image: Buffer) {
  expect(image.length).toBeGreaterThanOrEqual(22);
  expect(image.readUInt16LE(0)).toBe(0);
  expect(image.readUInt16LE(2)).toBe(1);
  expect(image.readUInt16LE(4)).toBe(1);
  expect(image[8]).toBe(0);
  expect(image[9]).toBe(0);

  const width = image[6] || 256;
  const height = image[7] || 256;
  const planes = image.readUInt16LE(10);
  const bitDepth = image.readUInt16LE(12);
  const payloadSize = image.readUInt32LE(14);
  const payloadOffset = image.readUInt32LE(18);
  const payloadEnd = payloadOffset + payloadSize;
  const xorStride = Math.ceil((width * bitDepth) / 32) * 4;
  const andStride = Math.ceil(width / 32) * 4;
  const expectedPayloadSize = 40 + xorStride * height + andStride * height;

  expect(payloadOffset).toBe(22);
  expect(payloadSize).toBe(expectedPayloadSize);
  expect(payloadEnd).toBe(image.length);

  const dib = image.subarray(payloadOffset, payloadEnd);
  expect(dib.length).toBe(payloadSize);
  expect(dib.readUInt32LE(0)).toBe(40);
  expect(dib.readInt32LE(4)).toBe(width);
  expect(dib.readInt32LE(8)).toBe(height * 2);
  expect(dib.readUInt16LE(12)).toBe(planes);
  expect(dib.readUInt16LE(14)).toBe(bitDepth);
  expect(dib.readUInt32LE(16)).toBe(0);
  expect(dib.readUInt32LE(20)).toBe(width * height * 4);

  return { width, height, planes, bitDepth };
}

describe("favicon package", () => {
  it("matches the approved, inert Signal Seal vector artwork", async () => {
    const icon = await readFile(path.join(root, "app/icon.svg"));
    const svg = icon.toString("utf8");

    expect(createHash("sha256").update(icon).digest("hex")).toBe(
      approvedSvgSha256,
    );
    expect(svg).toMatch(/^<svg[^>]+viewBox="0 0 512 512"[^>]*>/);
    expect(svg).toContain("<title id=\"title\">Signal Seal JS favicon</title>");
    expect(svg).toContain("<desc id=\"desc\">");
    expect(svg.trimEnd().endsWith("</svg>")).toBe(true);
    expect(svg).not.toMatch(
      /<(?:script|foreignObject|image|use|iframe|object|embed|style)\b|\s(?:href|src|on[a-z]+)\s*=|url\s*\(/i,
    );
    expect(svg).not.toContain("<text");
  });

  it("fully parses the 32px ICO container", async () => {
    const favicon = await readFile(path.join(root, "app/favicon.ico"));
    expect(parseIco(favicon)).toEqual({
      width: 32,
      height: 32,
      planes: 1,
      bitDepth: 32,
    });
  });

  it("fully parses a metadata-clean 180px Apple PNG", async () => {
    const appleIcon = await readFile(path.join(root, "app/apple-icon.png"));
    const parsed = parsePng(appleIcon);

    expect({ width: parsed.width, height: parsed.height }).toEqual({
      width: 180,
      height: 180,
    });
    expect(parsed.chunks[0]).toBe("IHDR");
    expect(parsed.chunks.at(-1)).toBe("IEND");
    expect(parsed.chunks.filter((chunk) => chunk === "IDAT").length).toBeGreaterThan(0);
    expect(new Set(parsed.chunks)).toEqual(new Set(["IHDR", "IDAT", "IEND"]));
  });
});
