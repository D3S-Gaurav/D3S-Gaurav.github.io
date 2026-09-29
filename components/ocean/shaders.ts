// All scene shaders. The water column is a single full-screen pass; particles
// are positioned directly in screen space with per-particle distance so they
// parallax correctly without a full 3D scene graph.

const NOISE = /* glsl */ `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
`;

export const waterVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const waterFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uDepth;
uniform float uAspect;
uniform float uRays;
uniform vec2 uMouse;
varying vec2 vUv;
${NOISE}

vec3 grade(float d, vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4, vec3 c5){
  vec3 c = mix(c0, c1, smoothstep(0.0, 0.14, d));
  c = mix(c, c2, smoothstep(0.12, 0.34, d));
  c = mix(c, c3, smoothstep(0.30, 0.55, d));
  c = mix(c, c4, smoothstep(0.50, 0.75, d));
  c = mix(c, c5, smoothstep(0.72, 0.97, d));
  return c;
}

void main(){
  vec2 uv = vUv;
  float d = uDepth;
  vec2 m = uMouse * 0.02;

  vec3 top = grade(d,
    vec3(0.16, 0.50, 0.60), vec3(0.07, 0.30, 0.42), vec3(0.035, 0.15, 0.24),
    vec3(0.018, 0.075, 0.13), vec3(0.008, 0.03, 0.055), vec3(0.002, 0.006, 0.012));
  vec3 bottom = grade(d,
    vec3(0.03, 0.17, 0.26), vec3(0.018, 0.10, 0.17), vec3(0.01, 0.05, 0.09),
    vec3(0.006, 0.025, 0.05), vec3(0.003, 0.01, 0.022), vec3(0.0, 0.0015, 0.004));
  vec3 col = mix(bottom, top, pow(uv.y, 1.35));

  // Slow drifting haze gives the water volume.
  float haze = fbm(vec2(uv.x * uAspect * 1.6 + uTime * 0.012, uv.y * 2.2 - uTime * 0.008));
  float light = 1.0 - smoothstep(0.0, 0.7, d);
  col += (haze - 0.5) * mix(0.05, 0.012, d) * (0.4 + light);

  // The surface seen from below, rising out of view as we descend.
  float sy = 0.8 + d * 3.2 - m.y;
  float w = fbm(vec2(uv.x * uAspect * 2.6 + uTime * 0.05, (uv.y - sy) * 9.0 + uTime * 0.12));
  float surf = smoothstep(sy - 0.015, sy + 0.05, uv.y + (w - 0.5) * 0.035);
  vec3 surfCol = vec3(0.30, 0.66, 0.74) * (0.55 + 0.75 * w);
  col = mix(col, surfCol, surf * 0.85 * uRays);

  // Sun and light shafts.
  vec2 sun = vec2(0.5 + m.x + 0.12, sy + 0.18);
  vec2 dp = vec2((uv.x - sun.x) * uAspect, uv.y - sun.y);
  float glow = exp(-length(dp) * 3.2);
  float shallow = 1.0 - smoothstep(0.0, 0.3, d);
  float ang = atan(dp.x, -dp.y);
  float rays = fbm(vec2(ang * 7.0, uTime * 0.05));
  rays = pow(smoothstep(0.35, 0.85, rays), 2.0);
  float fall = exp(-max(0.0, sun.y - uv.y) * 1.6);
  col += vec3(0.45, 0.78, 0.82) * (rays * 0.22 * fall + glow * 0.28) * shallow * uRays;

  // Faint caustic web just beneath the surface.
  float c = abs(noise(uv * vec2(uAspect, 1.0) * 14.0 + uTime * 0.25) - noise(uv * vec2(uAspect, 1.0) * 14.0 - uTime * 0.2));
  col += vec3(0.4, 0.75, 0.8) * pow(1.0 - c, 14.0) * 0.08 * smoothstep(sy - 0.45, sy, uv.y) * shallow * uRays;

  // In the dark zones the cursor stirs a faint glow in the water.
  float bio = smoothstep(0.45, 0.62, d) * (1.0 - smoothstep(0.9, 1.0, d));
  vec2 mp = vec2((uv.x - (uMouse.x * 0.5 + 0.5)) * uAspect, uv.y - (uMouse.y * 0.5 + 0.5));
  col += vec3(0.0, 0.22, 0.26) * exp(-length(mp) * 6.0) * 0.14 * bio;

  // Vignette and dither against banding in the dark gradients.
  vec2 v = uv - 0.5;
  col *= 1.0 - 0.6 * pow(length(v * vec2(1.0, 1.15)) * 1.3, 2.4);
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0 * 1.6;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

export const particleVertex = /* glsl */ `
attribute vec4 aSeed; // x: size, y: phase, z: glow chance, w: density rank
uniform float uTime;
uniform float uCam;
uniform float uAspect;
uniform float uDepth;
uniform float uDensity;
uniform float uPixelRatio;
uniform float uScale;
uniform vec2 uMouse;
uniform float uParallax;
varying float vAlpha;
varying float vGlow;

void main(){
  float z = mix(1.2, 12.0, position.z);
  float inv = 1.0 / z;

  // Particles sink slowly and sway; the camera descending moves them up.
  float y = position.y + (uCam * 14.0 - uTime * 0.03) * inv;
  y = mod(y, 1.3) - 0.65;
  float sway = sin(uTime * 0.25 + aSeed.y * 6.2831) * 0.015;
  float x = position.x + sway;

  vec2 p = vec2(x * 2.2, y * 2.0);
  p += uMouse * -0.06 * inv * uParallax;

  // Fewer particles the deeper we go; rarer ones glow in the bioluminescent zone.
  float keep = step(aSeed.w, uDensity);
  float bio = smoothstep(0.4, 0.62, uDepth) * (1.0 - smoothstep(0.92, 1.0, uDepth));
  float glows = step(0.86, aSeed.z) * bio;

  vec2 toMouse = (p - uMouse) * vec2(uAspect, 1.0);
  float nearMouse = exp(-dot(toMouse, toMouse) * 8.0);
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed.y) + aSeed.y * 40.0);

  float ambient = mix(0.75, 0.10, smoothstep(0.0, 0.65, uDepth)) * (1.0 - 0.6 * smoothstep(0.85, 1.0, uDepth));
  vGlow = glows * (twinkle + nearMouse * 1.5);
  vAlpha = keep * (ambient * (0.35 + 0.65 * inv * 1.2) + vGlow * 0.9);

  gl_Position = vec4(p, 0.0, 1.0);
  gl_PointSize = keep * (aSeed.x * 7.0 * inv + 1.0 + glows * 1.5) * uPixelRatio * uScale;
}
`;

export const particleFragment = /* glsl */ `
precision mediump float;
varying float vAlpha;
varying float vGlow;
void main(){
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, r);
  a *= a;
  vec3 snow = vec3(0.72, 0.86, 0.9);
  vec3 glow = vec3(0.25, 0.95, 0.9);
  vec3 col = mix(snow, glow, clamp(vGlow, 0.0, 1.0));
  gl_FragColor = vec4(col, a * vAlpha);
}
`;

export const bubbleVertex = /* glsl */ `
attribute vec3 aSeed; // x: size, y: speed, z: phase
uniform float uTime;
uniform float uCam;
uniform float uAspect;
uniform float uVisible;
uniform float uPixelRatio;
varying float vAlpha;
void main(){
  float y = mod(position.y + uTime * (0.04 + aSeed.y * 0.06) + uCam * 12.0, 1.3) - 0.65;
  float x = position.x + sin(uTime * 1.6 + aSeed.z * 6.2831 + y * 8.0) * 0.012;
  vec2 p = vec2(x * 2.2, y * 2.0);
  vAlpha = uVisible * (0.25 + 0.35 * aSeed.x);
  gl_Position = vec4(p, 0.0, 1.0);
  gl_PointSize = (3.0 + aSeed.x * 9.0) * uPixelRatio * uVisible;
}
`;

export const bubbleFragment = /* glsl */ `
precision mediump float;
varying float vAlpha;
void main(){
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q);
  float ring = smoothstep(0.5, 0.42, r) * smoothstep(0.2, 0.42, r);
  float spec = smoothstep(0.16, 0.0, length(q - vec2(-0.14, -0.14)));
  gl_FragColor = vec4(vec3(0.8, 0.95, 1.0), (ring * 0.7 + spec) * vAlpha);
}
`;
