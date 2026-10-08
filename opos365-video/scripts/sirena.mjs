import { writeFileSync } from "node:fs";

const SR = 44100;
const DUR = 15;
const N = SR * DUR;
const out = new Float32Array(N);

// Golpes graves (en segundos) sincronizados con el logo y el "YA DISPONIBLE"
const GOLPES = [5.0, 12.333];

let fase1 = 0;
let fase2 = 0;
let seed = 1;
const ruido = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed / 2147483647) * 2 - 1;
};

for (let i = 0; i < N; i++) {
  const t = i / SR;

  // 0-5 s: "wail" (subida/bajada lenta). Después: "yelp" (rápida)
  const wail = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 2.4);
  const yelp = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 0.36);
  const mezcla = Math.min(1, Math.max(0, (t - 4.6) / 0.4));
  const f = 650 + 750 * ((1 - mezcla) * wail + mezcla * yelp);

  fase1 += (2 * Math.PI * f) / SR;
  fase2 += (2 * Math.PI * f * 1.012) / SR; // segunda sirena ligeramente desafinada

  const tono = (p) => Math.sin(p) + 0.35 * Math.sin(3 * p) + 0.15 * Math.sin(5 * p);
  let sirena = (tono(fase1) + 0.6 * tono(fase2)) / 2.2;

  // Volumen: entra, baja con las ventajas, sube al final y se apaga
  let vol = Math.min(1, t / 0.4) * 0.45;
  if (t > 8 && t < 12.3) vol *= 0.45;
  vol *= Math.min(1, (DUR - t) / 1.2);
  sirena *= vol;

  // Golpes graves (impacto + ruido)
  let golpe = 0;
  for (const g of GOLPES) {
    const d = t - g;
    if (d >= 0 && d < 1.5) {
      golpe += Math.sin(2 * Math.PI * (48 + 40 * Math.exp(-d * 12)) * d) * Math.exp(-d * 3.2) * 0.95;
      golpe += ruido() * Math.exp(-d * 25) * 0.5;
    }
  }

  out[i] = Math.tanh((sirena + golpe) * 1.2) * 0.9;
}

// WAV 16 bits mono
const buf = Buffer.alloc(44 + N * 2);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 2, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(1, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2, 28);
buf.writeUInt16LE(2, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 2, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[i])) * 32767), 44 + i * 2);
}
writeFileSync(new URL("../public/sirena.wav", import.meta.url), buf);
console.log("✅ public/sirena.wav creado");
