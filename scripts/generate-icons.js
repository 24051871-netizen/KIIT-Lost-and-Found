const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create PNG with modern emerald theme
function createEmeraldPng(width, height) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw Image Data (with filter byte 0 at start of each scanline)
  const rowBytes = width * 4;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = width * 0.44;
  const innerR = width * 0.16;
  const glowR = width * 0.26;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter byte: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 1. Center Emerald Beacon Core: #34d399 (52, 211, 153)
      if (dist <= innerR) {
        rawData[offset++] = 52;
        rawData[offset++] = 211;
        rawData[offset++] = 153;
        rawData[offset++] = 255;
      }
      // 2. Center Emerald Glow Ring
      else if (dist <= glowR) {
        const glowFactor = (glowR - dist) / (glowR - innerR);
        rawData[offset++] = Math.round(16 + (52 - 16) * glowFactor);
        rawData[offset++] = Math.round(185 + (211 - 185) * glowFactor);
        rawData[offset++] = Math.round(129 + (153 - 129) * glowFactor);
        rawData[offset++] = Math.round(140 * glowFactor + 50);
      }
      // 3. Outer Emerald Ring / Squircle Accent: #10b981
      else if (dist <= outerR && dist >= outerR - Math.max(2, width * 0.04)) {
        rawData[offset++] = 16;
        rawData[offset++] = 185;
        rawData[offset++] = 129;
        rawData[offset++] = 255;
      }
      // 4. Subtle Outer Aura
      else if (dist <= outerR + 2 && dist >= outerR - 4) {
        rawData[offset++] = 16;
        rawData[offset++] = 185;
        rawData[offset++] = 129;
        rawData[offset++] = 90;
      }
      // 5. Deep Obsidian Background (#07090e)
      else if (dist <= width * 0.48) {
        rawData[offset++] = 7;
        rawData[offset++] = 9;
        rawData[offset++] = 14;
        rawData[offset++] = 255;
      }
      // Transparent corners
      else {
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
        rawData[offset++] = 0;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createIcoFromPng(pngBuffer, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type = 1
  header.writeUInt16LE(1, 4); // 1 image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(width >= 256 ? 0 : width, 0);
  entry.writeUInt8(height >= 256 ? 0 : height, 1);
  entry.writeUInt8(0, 2); // No color palette
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // Size of image
  entry.writeUInt32LE(6 + 16, 12); // Offset = 22

  return Buffer.concat([header, entry, pngBuffer]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(12 + length);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.slice(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

// 1. Generate PNGs (32x32, 192x192, 512x512)
console.log('Generating 32x32 emerald PNG for favicon.ico...');
const png32 = createEmeraldPng(32, 32);
const ico32 = createIcoFromPng(png32, 32, 32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32);
fs.writeFileSync(path.join(appDir, 'favicon.ico'), ico32);

console.log('Generating emerald theme icon-192.png...');
const icon192 = createEmeraldPng(192, 192);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);

console.log('Generating emerald theme icon-512.png...');
const icon512 = createEmeraldPng(512, 512);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);

// 2. Generate SVG Favicons (Vector perfect for browser tabs)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1726" />
      <stop offset="100%" stop-color="#06080d" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Outer Obsidian Card -->
  <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#bgGrad)" stroke="#10b981" stroke-width="2.5" stroke-opacity="0.6" />
  
  <!-- Sleek Emerald Shield -->
  <path d="M32 13 L47 18 V31 C47 41.5 39.5 49 32 52 C24.5 49 17 41.5 17 31 V18 Z" 
        fill="url(#emeraldGrad)" 
        fill-opacity="0.2" 
        stroke="url(#emeraldGrad)" 
        stroke-width="2.8" 
        stroke-linejoin="round" />
        
  <!-- Verified Checkmark -->
  <path d="M25 31.5 L30 36.5 L39 26.5" 
        fill="none" 
        stroke="#34d399" 
        stroke-width="3.5" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        filter="url(#emeraldGlow)" />
        
  <!-- Glowing Emerald Active Beacon on Top Right -->
  <circle cx="50" cy="14" r="5" fill="#10b981" filter="url(#emeraldGlow)" />
  <circle cx="50" cy="14" r="2.5" fill="#ecfdf5" />
</svg>`;

console.log('Generating public/icon.svg...');
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('Generating src/app/icon.svg...');
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent);

console.log('All icons and favicon.ico generated with emerald theme successfully!');
