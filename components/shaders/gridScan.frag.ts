export const gridScanFrag = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec3  iResolution;
uniform float iTime;

uniform float uGridScale;
uniform float uLineThickness;
uniform vec3  uLinesColor;
uniform vec3  uScanColor;
uniform float uScanOpacity;
uniform float uScanDuration;

varying vec2 vUv;

/* ------------------ GRID ------------------ */
float grid(vec2 uv, float scale, float thickness) {
  vec2 g = abs(fract(uv * scale) - 0.5);
  float line = min(g.x, g.y);
  #ifdef GL_OES_standard_derivatives
float fw = fwidth(line);
#else
float fw = 1.0 / iResolution.y; // fallback: pixel-size-based anti-alias
#endif

  return smoothstep(thickness + fw, thickness - fw, line);
}

/* ------------------ WALL GRID ------------------ */
float wallGrid(vec2 uv, float scale, float thickness) {
  vec2 g = abs(fract(uv * scale) - 0.5);
  float line = min(g.x, g.y);
  #ifdef GL_OES_standard_derivatives
float fw = fwidth(line);
#else
float fw = 1.0 / iResolution.y; // fallback: pixel-size-based anti-alias
#endif

  return smoothstep(thickness + fw, thickness - fw, line);
}

/* ------------------ MAIN IMAGE ------------------ */
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = vUv - 0.5;
  uv.x *= iResolution.x / iResolution.y;

  /* -------- Tunnel depth -------- */
  float z = 1.0 / (1.0 + uv.y * 1.6);
  vec2 p = uv * z;

  /* -------- Center grid -------- */
  float center = grid(p, uGridScale, uLineThickness);
  vec3 color = center * uLinesColor;

  /* -------- Tunnel walls -------- */
  float wallL = wallGrid(vec2(p.y, p.x + 1.0), uGridScale, uLineThickness);
  float wallR = wallGrid(vec2(p.y, p.x - 1.0), uGridScale, uLineThickness);
  float wallT = wallGrid(vec2(p.x, p.y + 1.0), uGridScale, uLineThickness);
  float wallB = wallGrid(vec2(p.x, p.y - 1.0), uGridScale, uLineThickness);

  color += (wallL + wallR + wallT + wallB) * uLinesColor * 0.8;

  /* -------- Ping-pong scan -------- */
  float t = mod(iTime, uScanDuration * 2.0) / uScanDuration;
  float phase = t < 1.0 ? t : 2.0 - t;
  float scanPos = mix(-1.2, 1.2, phase);

  float scan =
    exp(-pow(abs(p.y - scanPos), 2.0) * 14.0) * uScanOpacity;

  color += scan * uScanColor;

  /* -------- Vignette -------- */
  float vignette = smoothstep(1.4, 0.2, length(uv));
  color *= vignette;

  fragColor = vec4(color, max(center, scan));
}

/* ------------------ REQUIRED MAIN ------------------ */
void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;
