#!/usr/bin/env bash
# Descarga los clips reales (licencia libre Pexels / Mixkit) y los recorta a vertical 1080x1920.
# Uso: bash scripts/preparar-clips.sh   (desde la carpeta opos365-video)
set -euo pipefail
cd "$(dirname "$0")/.."

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
SRC=.clips-originales
OUT=public/clips
mkdir -p "$SRC" "$OUT"

FFMPEG="npx remotion ffmpeg"
command -v ffmpeg >/dev/null && FFMPEG=ffmpeg

descargar() { # id url
  [ -s "$SRC/$1.mp4" ] || curl -fsSL -A "$UA" -o "$SRC/$1.mp4" "$2"
}

# Pexels: luces de patrulla (7714378), patrullas de noche en avenida (6397833), todoterreno policial (27974750)
descargar 7714378  "https://www.pexels.com/download/video/7714378/"
descargar 6397833  "https://www.pexels.com/download/video/6397833/"
descargar 27974750 "https://www.pexels.com/download/video/27974750/"

recortar() { # salida id inicio duracion centroX(0-1)
  local out=$1 id=$2 ss=$3 dur=$4 cx=$5
  $FFMPEG -v error -y -ss "$ss" -t "$dur" -i "$SRC/$id.mp4" \
    -vf "crop=ih*9/16:ih:min(max(iw*$cx-ih*9/32\,0)\,iw-ih*9/16):0,scale=1080:1920,fps=30,format=yuv420p" \
    -an -c:v libx264 -preset veryfast -crf 18 "$OUT/$out.mp4"
  echo "✅ $OUT/$out.mp4"
}

recortar intro  7714378  10.3 3.0 0.38
recortar convoy 6397833  11.3 4.5 0.66
recortar logo   6397833  22.5 4.0 0.40
recortar suv    27974750 0.5  5.0 0.55
recortar final  7714378  12.0 3.2 0.40
