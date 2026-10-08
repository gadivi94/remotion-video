// OPOS365 by GADIVI · Vídeo de lanzamiento · © @gadivi
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const { fontFamily: anton } = loadAnton();
const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

// ================= TEXTOS (cámbialos aquí) =================
const TEXTOS = {
  alerta1: "ATENCIÓN",
  alerta2: "ASPIRANTES A MOSSOS",
  marca1: "OPOS",
  marca2: "365",
  firma: "by GADIVI",
  claim: "Tu plaza empieza hoy",
  titulo: "TODO EN UNA APP",
  ventajas: ["Temario completo", "Psicotécnicos", "Tests tipo examen", "Tutor con IA"],
  cta: "YA DISPONIBLE",
  plataformas: "iOS · Android · Web",
};
// ===========================================================

const ROJO = "#ff1f3d";
const AZUL = "#1f6bff";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Destello rápido (solo en las barras de luces de los coches)
const destello = (frame: number) => {
  const f = frame % 16;
  const on = (a: number) => (f === a || f === a + 1 ? 1 : 0);
  return { rojo: Math.max(on(0), on(4)), azul: Math.max(on(8), on(12)) };
};

// Pulso suave rojo/azul para el fondo (seguro para fotosensibilidad)
const pulso = (frame: number) => {
  const s = Math.sin((frame * 2 * Math.PI) / 40);
  return { rojo: Math.max(0, s), azul: Math.max(0, -s), s };
};

// ---------------- Fondo con luces giratorias ----------------
const Luces: React.FC = () => {
  const frame = useCurrentFrame();
  const { rojo, azul } = pulso(frame);
  const entrada = interpolate(frame, [0, 20], [0, 1], CLAMP);
  const giro = frame * 8;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{ background: "radial-gradient(circle at 50% 40%, #0d1528 0%, #03050a 75%)" }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.55 * entrada,
          background: `conic-gradient(from ${giro}deg at 50% 36%, ${ROJO}00 0deg, ${ROJO}66 14deg, ${ROJO}00 32deg, ${ROJO}00 180deg, ${AZUL}66 194deg, ${AZUL}00 212deg, ${AZUL}00 360deg)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: rojo * 0.5 * entrada,
          background: `radial-gradient(circle at 0% 30%, ${ROJO} 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: azul * 0.5 * entrada,
          background: `radial-gradient(circle at 100% 30%, ${AZUL} 0%, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------- Coche patrulla (SVG) ----------------
const CochePatrulla: React.FC<{ frame: number; giroRuedas: number; espejo?: boolean }> = ({
  frame,
  giroRuedas,
  espejo,
}) => {
  const { rojo, azul } = destello(frame);
  const rueda = (cx: number) => (
    <g>
      <circle cx={cx} cy={200} r={52} fill="#05070c" />
      <circle cx={cx} cy={200} r={42} fill="#151a22" />
      <g transform={`rotate(${giroRuedas} ${cx} 200)`}>
        <circle cx={cx} cy={200} r={22} fill="#9aa4b5" />
        {[0, 72, 144, 216, 288].map((a) => (
          <rect
            key={a}
            x={cx - 3}
            y={180}
            width={6}
            height={20}
            fill="#4b5363"
            transform={`rotate(${a} ${cx} 200)`}
          />
        ))}
        <circle cx={cx} cy={200} r={6} fill="#2a303b" />
      </g>
    </g>
  );
  return (
    <svg
      width={620}
      height={270}
      viewBox="0 0 620 270"
      style={{ overflow: "visible", transform: espejo ? "scaleX(-1)" : undefined }}
    >
      <defs>
        <radialGradient id="gRojo">
          <stop offset="0" stopColor={ROJO} stopOpacity={1} />
          <stop offset="1" stopColor={ROJO} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="gAzul">
          <stop offset="0" stopColor={AZUL} stopOpacity={1} />
          <stop offset="1" stopColor={AZUL} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="gFaro" x1="0" x2="1">
          <stop offset="0" stopColor="#fff3c4" stopOpacity={0.55} />
          <stop offset="1" stopColor="#fff3c4" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Haz del faro */}
      <polygon points="595,142 980,90 980,215" fill="url(#gFaro)" />
      {/* Sombra */}
      <ellipse cx={315} cy={252} rx={300} ry={16} fill="rgba(0,0,0,0.7)" />
      {/* Resplandor de las luces */}
      <circle cx={295} cy={55} r={170} fill="url(#gRojo)" opacity={rojo * 0.9} />
      <circle cx={365} cy={55} r={170} fill="url(#gAzul)" opacity={azul * 0.9} />

      {/* Carrocería */}
      <path
        d="M30 205 L30 152 Q30 132 56 127 L172 118 L236 72 Q246 64 263 64 L420 64 Q440 64 452 74 L506 118 L576 128 Q602 133 604 156 L604 205 Z"
        fill="#eef1f6"
      />
      {/* Ventanillas */}
      <path d="M188 118 L245 78 L330 78 L330 118 Z" fill="#141b29" />
      <path d="M342 78 L418 78 Q430 78 438 86 L478 118 L342 118 Z" fill="#141b29" />
      {/* Franjas */}
      <rect x={30} y={142} width={574} height={34} fill="#0b3fd1" />
      <rect x={30} y={176} width={574} height={7} fill={ROJO} />
      <text
        x={318}
        y={168}
        textAnchor="middle"
        fontFamily={montserrat}
        fontWeight={800}
        fontSize={24}
        fill="#ffffff"
        letterSpacing={3}
        transform={espejo ? "translate(636 0) scale(-1 1)" : undefined}
      >
        OPOS365
      </text>
      {/* Faro y piloto */}
      <ellipse cx={592} cy={140} rx={12} ry={8} fill="#fff6d0" />
      <rect x={30} y={132} width={12} height={16} rx={3} fill={ROJO} />

      {/* Barra de luces */}
      <rect x={262} y={46} width={136} height={18} rx={6} fill="#1c2230" />
      <rect x={266} y={49} width={62} height={12} rx={4} fill={ROJO} opacity={0.3 + 0.7 * rojo} />
      <rect x={332} y={49} width={62} height={12} rx={4} fill={AZUL} opacity={0.3 + 0.7 * azul} />

      {rueda(148)}
      {rueda(492)}
    </svg>
  );
};

// ---------------- Escena: alerta inicial ----------------
const Alerta: React.FC = () => {
  const frame = useCurrentFrame();
  const parpadeo = frame < 24 ? (frame % 6 < 3 ? 1 : 0.25) : 1;
  const salida = interpolate(frame, [48, 60], [1, 0], CLAMP);
  const escala = interpolate(frame, [0, 60], [1.15, 1], CLAMP);
  const sub = interpolate(frame, [18, 30], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: salida }}>
      <div
        style={{
          fontFamily: anton,
          fontSize: 220,
          color: "white",
          opacity: parpadeo,
          transform: `scale(${escala})`,
          letterSpacing: 8,
          textShadow: `0 0 40px ${ROJO}, 0 0 90px ${AZUL}`,
        }}
      >
        {TEXTOS.alerta1}
      </div>
      <div
        style={{
          fontFamily: montserrat,
          fontWeight: 800,
          fontSize: 54,
          color: "#dbe4ff",
          letterSpacing: 10,
          opacity: sub,
          marginTop: 10,
        }}
      >
        {TEXTOS.alerta2}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Escena: coches que llegan ----------------
const Coches: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fondo = interpolate(frame, [0, 15], [0, 1], CLAMP) * interpolate(frame, [180, 200], [1, 0], CLAMP);

  const s1 = spring({ frame, fps, config: { damping: 15, mass: 0.9 } });
  const s2 = spring({ frame: frame - 12, fps, config: { damping: 15, mass: 0.9 } });
  const salida = interpolate(frame, [168, 200], [0, 1], { ...CLAMP, easing: Easing.in(Easing.cubic) });

  const x1 = interpolate(s1, [0, 1], [-760, 230]) + salida * 1400;
  const x2 = interpolate(s2, [0, 1], [1180, 230]) - salida * 1500;
  const desplazamientoLineas = (frame * 46) % 220;
  const { rojo, azul } = destello(frame);

  return (
    <AbsoluteFill>
      {/* Asfalto */}
      <div
        style={{
          position: "absolute",
          top: 1240,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fondo,
          background: "linear-gradient(180deg, #10141c 0%, #05070b 100%)",
          overflow: "hidden",
        }}
      >
        {/* Reflejos de las luces en el suelo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 40% 10%, ${ROJO}88 0%, transparent 55%)`,
            opacity: rojo,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 60% 10%, ${AZUL}88 0%, transparent 55%)`,
            opacity: azul,
          }}
        />
        {/* Líneas de carril */}
        {new Array(8).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 300,
              left: i * 220 - desplazamientoLineas,
              width: 120,
              height: 14,
              borderRadius: 7,
              background: "#e8c547",
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <div style={{ position: "absolute", top: 1060, left: x1 }}>
        <CochePatrulla frame={frame} giroRuedas={x1 * 0.9} />
      </div>
      <div style={{ position: "absolute", top: 1400, left: x2 }}>
        <CochePatrulla frame={frame + 6} giroRuedas={-x2 * 0.9} espejo />
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Escena: logo ----------------
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 130 } });
  const escala = interpolate(s, [0, 1], [3.4, 1]);
  const opacidad = interpolate(frame, [0, 4], [0, 1], CLAMP) * interpolate(frame, [80, 90], [1, 0], CLAMP);
  const { s: p } = pulso(frame + 150);
  const brillo = p > 0 ? ROJO : AZUL;
  const firma = interpolate(frame, [14, 28], [0, 1], CLAMP);
  const claim = spring({ frame: frame - 28, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ opacity: opacidad }}>
      <div style={{ position: "absolute", top: 330, width: "100%", textAlign: "center" }}>
        <div
          style={{
            fontFamily: anton,
            fontSize: 250,
            lineHeight: 1,
            color: "white",
            letterSpacing: 4,
            transform: `scale(${escala})`,
            textShadow: `0 0 30px ${brillo}, 0 0 90px ${brillo}`,
          }}
        >
          {TEXTOS.marca1}
          <span
            style={{
              background: `linear-gradient(90deg, ${ROJO}, ${AZUL})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "none",
              filter: `drop-shadow(0 0 24px ${brillo})`,
            }}
          >
            {TEXTOS.marca2}
          </span>
        </div>
        <div
          style={{
            fontFamily: montserrat,
            fontWeight: 800,
            fontSize: 50,
            letterSpacing: 16,
            color: "#cfd8ea",
            opacity: firma,
            marginTop: 20,
          }}
        >
          {TEXTOS.firma}
        </div>
        <div
          style={{
            fontFamily: montserrat,
            fontWeight: 600,
            fontSize: 66,
            color: "white",
            marginTop: 70,
            opacity: claim,
            transform: `translateY(${(1 - claim) * 40}px)`,
          }}
        >
          {TEXTOS.claim}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Escena: ventajas ----------------
const IconoCheck: React.FC<{ color: string }> = ({ color }) => (
  <svg width={84} height={84} viewBox="0 0 84 84">
    <circle cx={42} cy={42} r={40} fill={color} />
    <path
      d="M24 43 L37 56 L61 30"
      stroke="white"
      strokeWidth={9}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Ventajas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titulo = spring({ frame, fps, config: { damping: 200 } });
  const salida = interpolate(frame, [118, 130], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity: salida }}>
      <div
        style={{
          position: "absolute",
          top: 300,
          width: "100%",
          textAlign: "center",
          fontFamily: anton,
          fontSize: 130,
          color: "white",
          letterSpacing: 4,
          opacity: titulo,
          transform: `translateY(${(1 - titulo) * -60}px)`,
          textShadow: `0 0 40px ${AZUL}`,
        }}
      >
        {TEXTOS.titulo}
      </div>
      {TEXTOS.ventajas.map((texto, i) => {
        const s = spring({ frame: frame - 14 - i * 14, fps, config: { damping: 14 } });
        const desdeIzq = i % 2 === 0;
        const color = desdeIzq ? ROJO : AZUL;
        const x = interpolate(s, [0, 1], [desdeIzq ? -1200 : 1200, 0]);
        return (
          <div
            key={texto}
            style={{
              position: "absolute",
              top: 640 + i * 230,
              left: 90,
              width: 900,
              height: 190,
              transform: `translateX(${x}px)`,
              display: "flex",
              alignItems: "center",
              gap: 40,
              padding: "0 50px",
              boxSizing: "border-box",
              borderRadius: 32,
              background: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.15)",
              borderLeft: `14px solid ${color}`,
              boxShadow: `0 0 50px ${color}55`,
            }}
          >
            <IconoCheck color={color} />
            <div style={{ fontFamily: montserrat, fontWeight: 800, fontSize: 62, color: "white" }}>
              {texto}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------- Escena final ----------------
const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const golpe = spring({ frame, fps, config: { damping: 10, stiffness: 140 } });
  const logo = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const plataformas = interpolate(frame, [22, 36], [0, 1], CLAMP);
  const { s: p } = pulso(frame);
  const borde = p > 0 ? ROJO : AZUL;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: anton,
          fontSize: 150,
          color: "white",
          letterSpacing: 4,
          opacity: logo,
          transform: `translateY(${(1 - logo) * -50}px)`,
        }}
      >
        {TEXTOS.marca1}
        <span style={{ color: borde }}>{TEXTOS.marca2}</span>
      </div>
      <div
        style={{
          marginTop: 40,
          padding: "30px 60px",
          borderRadius: 30,
          border: `8px solid ${borde}`,
          boxShadow: `0 0 80px ${borde}, inset 0 0 40px ${borde}88`,
          transform: `scale(${interpolate(golpe, [0, 1], [2.2, 1])})`,
          opacity: interpolate(frame, [0, 3], [0, 1], CLAMP),
        }}
      >
        <div style={{ fontFamily: anton, fontSize: 170, color: "white", letterSpacing: 6, lineHeight: 1.1 }}>
          {TEXTOS.cta}
        </div>
      </div>
      <div
        style={{
          marginTop: 60,
          fontFamily: montserrat,
          fontWeight: 800,
          fontSize: 58,
          letterSpacing: 6,
          color: "#dbe4ff",
          opacity: plataformas,
        }}
      >
        {TEXTOS.plataformas}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: montserrat,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 10,
          color: "#8e9bb5",
          opacity: plataformas,
        }}
      >
        {TEXTOS.firma}
      </div>
    </AbsoluteFill>
  );
};

// ---------------- Composición principal ----------------
const IMPACTOS = [150, 370];

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Temblor de cámara y destello blanco en cada impacto
  let tx = 0;
  let ty = 0;
  let flash = 0;
  for (const i of IMPACTOS) {
    const d = frame - i;
    if (d >= 0 && d < 18) {
      const amp = 26 * (1 - d / 18);
      tx += Math.sin(d * 2.7) * amp;
      ty += Math.cos(d * 3.3) * amp;
    }
    flash = Math.max(flash, interpolate(frame, [i - 1, i + 1, i + 12], [0, 0.85, 0], CLAMP));
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#03050a", overflow: "hidden" }}>
      <Audio src={staticFile("sirena.wav")} />
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(1.04)` }}>
        <Luces />
        <Sequence from={0} durationInFrames={60}>
          <Alerta />
        </Sequence>
        <Sequence from={40} durationInFrames={200}>
          <Coches />
        </Sequence>
        <Sequence from={150} durationInFrames={90}>
          <Logo />
        </Sequence>
        <Sequence from={240} durationInFrames={130}>
          <Ventajas />
        </Sequence>
        <Sequence from={370}>
          <Final />
        </Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
