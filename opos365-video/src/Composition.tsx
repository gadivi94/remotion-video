// OPOS365 by GADIVI · Vídeo de lanzamiento · © @gadivi
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
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

// Pulso suave rojo/azul para el fondo (seguro para fotosensibilidad)
const pulso = (frame: number) => {
  const s = Math.sin((frame * 2 * Math.PI) / 40);
  return { rojo: Math.max(0, s), azul: Math.max(0, -s), s };
};

// ---------------- Luces giratorias (sobre el vídeo real) ----------------
const Luces: React.FC = () => {
  const frame = useCurrentFrame();
  const { rojo, azul } = pulso(frame);
  const giro = frame * 8;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity: 0.35,
          background: `conic-gradient(from ${giro}deg at 50% 30%, ${ROJO}00 0deg, ${ROJO}55 14deg, ${ROJO}00 32deg, ${ROJO}00 180deg, ${AZUL}55 194deg, ${AZUL}00 212deg, ${AZUL}00 360deg)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: rojo * 0.35,
          background: `radial-gradient(circle at 0% 25%, ${ROJO} 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: azul * 0.35,
          background: `radial-gradient(circle at 100% 25%, ${AZUL} 0%, transparent 55%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------- Vídeo real de fondo ----------------
const Clip: React.FC<{
  src: string;
  duracion: number;
  oscuro?: number;
  desenfoque?: number;
  velocidad?: number;
  fundido?: boolean;
}> = ({ src, duracion, oscuro = 0, desenfoque = 0, velocidad = 1, fundido = true }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, duracion], [1.06, 1.16], CLAMP);
  const opacidad = fundido ? interpolate(frame, [0, 8], [0, 1], CLAMP) : 1;
  return (
    <AbsoluteFill style={{ opacity: opacidad, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(`clips/${src}.mp4`)}
        muted
        playbackRate={velocidad}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          filter: `brightness(${1 - oscuro}) contrast(1.15) saturate(1.25) blur(${desenfoque}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Viñeta oscura para que los textos se lean bien
const Vineta: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%), linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)",
    }}
  />
);

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
              background: "rgba(5,8,15,0.62)",
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
          padding: "26px 48px",
          borderRadius: 30,
          border: `8px solid ${borde}`,
          boxShadow: `0 0 80px ${borde}, inset 0 0 40px ${borde}88`,
          transform: `scale(${interpolate(golpe, [0, 1], [2.2, 1])})`,
          opacity: interpolate(frame, [0, 3], [0, 1], CLAMP),
        }}
      >
        <div style={{ fontFamily: anton, fontSize: 132, color: "white", letterSpacing: 5, lineHeight: 1.1, whiteSpace: "nowrap" }}>
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
        {/* Planos reales de fondo */}
        <Sequence from={0} durationInFrames={68}>
          <Clip src="intro" duracion={68} oscuro={0.35} fundido={false} />
        </Sequence>
        <Sequence from={60} durationInFrames={98}>
          <Clip src="convoy" duracion={98} velocidad={1.2} />
        </Sequence>
        <Sequence from={150} durationInFrames={98}>
          <Clip src="logo" duracion={98} oscuro={0.4} desenfoque={2} />
        </Sequence>
        <Sequence from={240} durationInFrames={138}>
          <Clip src="suv" duracion={138} oscuro={0.5} desenfoque={8} />
        </Sequence>
        <Sequence from={370}>
          <Clip src="final" duracion={80} oscuro={0.45} desenfoque={10} />
        </Sequence>

        <Luces />
        <Vineta />

        {/* Textos */}
        <Sequence from={0} durationInFrames={60}>
          <Alerta />
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
