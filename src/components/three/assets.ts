import * as THREE from 'three';

/* ------------------------------------------------------------------ *
 *  Environment map — a painted sky, generated at runtime so the
 *  repository ships without a multi-megabyte .hdr file.
 * ------------------------------------------------------------------ */
export function createSkyEnvironment(
  renderer: THREE.WebGLRenderer,
  opts: {
    top: string;
    horizon: string;
    ground: string;
    sun: string;
    sunX?: number;
    sunY?: number;
    intensity?: number;
  },
) {
  const { top, horizon, ground, sun, sunX = 0.62, sunY = 0.68, intensity = 1 } = opts;

  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, top);
  grad.addColorStop(0.42, horizon);
  grad.addColorStop(0.5, horizon);
  grad.addColorStop(0.58, ground);
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // soft cloud / reflector bands — these are what give metal its highlights
  const blobs: [number, number, number, number][] = [
    [0.18, 0.24, 210, 0.5],
    [0.62, 0.16, 160, 0.4],
    [0.86, 0.34, 250, 0.55],
    [0.36, 0.08, 120, 0.3],
    [0.05, 0.44, 140, 0.35],
  ];
  blobs.forEach(([bx, by, r, a]) => {
    const g = ctx.createRadialGradient(bx * 1024, by * 512, 0, bx * 1024, by * 512, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 512);
  });

  // sun bloom
  const sx = sunX * 1024;
  const sy = (1 - sunY) * 512 * 0.52;
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 300);
  glow.addColorStop(0, sun);
  glow.addColorStop(0.1, sun);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = intensity;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envMap = pmrem.fromEquirectangular(tex).texture;

  tex.dispose();
  pmrem.dispose();

  return envMap;
}

/* ------------------------------------------------------------------ *
 *  Studio environment — three soft-boxes over a dark room.
 *  This is what gives the cast-gold mark its crisp highlights and
 *  dark banding (a flat sky reflection looks like orange plastic).
 * ------------------------------------------------------------------ */
export function createStudioEnvironment(
  renderer: THREE.WebGLRenderer,
  warm = '#fff0d0',
) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  // A lit studio backdrop rather than a black void — polished metal with
  // metalness 1 reflects *only* the environment, so a dark room gives a
  // dead, black mark.
  const base = ctx.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0, '#8e9aa6');
  base.addColorStop(0.46, '#cfd6dc');
  base.addColorStop(0.62, '#f2ead9');
  base.addColorStop(1, '#b39a6e');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 512);

  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    strength: number,
    radius = 26,
  ) => {
    ctx.save();
    ctx.globalAlpha = strength;
    ctx.filter = `blur(${radius / 3}px)`;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
    ctx.restore();
  };

  // key light (large, warm, above)
  box(250, 10, 420, 200, warm, 1);
  // fill (cool, left)
  box(10, 130, 200, 240, '#e6f2fb', 0.9);
  // rim (small, bright, right)
  box(820, 60, 160, 320, '#ffffff', 1);
  // floor bounce
  box(150, 380, 740, 120, '#d8bf8c', 0.8);
  // narrow hot strip — gives the bevel a crisp highlight line
  box(430, 0, 60, 250, '#ffffff', 0.95, 10);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envMap = pmrem.fromEquirectangular(tex).texture;

  tex.dispose();
  pmrem.dispose();

  return envMap;
}

/* ------------------------------------------------------------------ *
 *  The brand mark, extruded into 3D.
 *  Two opposing chevrons — same geometry as the SVG logo.
 * ------------------------------------------------------------------ */
export function createMarkGeometry(depth = 0.22, bevel = 0.022) {
  const s = 1 / 48;

  const left = new THREE.Shape();
  left.moveTo(3 * s, 24 * s);
  left.lineTo(17.5 * s, 7.5 * s);
  left.lineTo(24 * s, 14 * s);
  left.lineTo(14 * s, 24 * s);
  left.lineTo(24 * s, 34 * s);
  left.lineTo(17.5 * s, 40.5 * s);
  left.closePath();

  const right = new THREE.Shape();
  right.moveTo(45 * s, 24 * s);
  right.lineTo(30.5 * s, 7.5 * s);
  right.lineTo(24 * s, 14 * s);
  right.lineTo(34 * s, 24 * s);
  right.lineTo(24 * s, 34 * s);
  right.lineTo(30.5 * s, 40.5 * s);
  right.closePath();

  const geo = new THREE.ExtrudeGeometry([left, right], {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 2,
  });

  geo.center();
  geo.computeVertexNormals();

  return geo;
}

/** Polished cast gold. */
export function createGoldMaterial(
  envMap: THREE.Texture,
  roughness = 0.2,
  intensity = 2.9,
) {
  return new THREE.MeshStandardMaterial({
    color: 0xe3b649,
    metalness: 1,
    roughness,
    envMap,
    envMapIntensity: intensity,
  });
}

/* ------------------------------------------------------------------ *
 *  Small helpers
 * ------------------------------------------------------------------ */
export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else mat?.dispose();
  });
}

/** Shared GLSL: cheap 2D value noise + fbm, used by the ocean & aurora. */
export const NOISE_GLSL = /* glsl */ `
  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++){
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
`;
