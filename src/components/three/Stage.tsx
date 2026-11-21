'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import {
  NOISE_GLSL,
  createGoldMaterial,
  createMarkGeometry,
  createSkyEnvironment,
  createStudioEnvironment,
  randomBetween,
} from './assets';

export type StageVariant = 'field' | 'coast' | 'aurora';

type Pointer = { x: number; y: number };

type SceneApi = {
  update: (dt: number, delta: number, ptr: Pointer, dragRotation: number) => void;
  resize?: (w: number, h: number) => void;
  dispose?: () => void;
};

type StageProps = {
  variant: StageVariant;
  className?: string;
  /** 0 → 1 progress of the owning section through the viewport. */
  onProgress?: (p: number) => void;
  /** Enable pointer-drag rotation on the gold mark (services scene). */
  draggable?: boolean;
};

/* ================================================================== *
 *  Stage
 * ================================================================== */
export default function Stage({ variant, className = '', onProgress, draggable }: StageProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const isSmall = window.innerWidth < 720;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.4 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      variant === 'field' ? 42 : 38,
      1,
      0.1,
      900,
    );

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { active: false, lastX: 0, delta: 0, rotation: 0 };

    const api =
      variant === 'field'
        ? buildField(renderer, scene, camera, isSmall)
        : variant === 'coast'
          ? buildCoast(renderer, scene, camera, isSmall)
          : buildAurora(renderer, scene, camera, isSmall);

    /* -------------------------------------------------- interaction */
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (drag.active) {
        drag.delta += (e.clientX - drag.lastX) * 0.006;
        drag.lastX = e.clientX;
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!draggable) return;
      drag.active = true;
      drag.lastX = e.clientX;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onPointerUp = () => {
      drag.active = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    /* ------------------------------------------------------ resize */
    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      api.resize?.(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* ------------------------------------------------- visibility */
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(mount);

    /* --------------------------------------------------- main loop */
    const clock = new THREE.Clock();
    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2.4);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2.4);

      if (drag.active) drag.rotation += drag.delta;
      else drag.rotation += (drag.delta - drag.rotation) * Math.min(1, dt * 1.6);
      drag.delta = drag.rotation;

      api.update(t, dt, pointer, drag.rotation);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      ro.disconnect();
      io.disconnect();
      api.dispose?.();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [variant, draggable]);

  return <div ref={mountRef} className={className} aria-hidden />;
}

/* ================================================================== *
 *  Shared helpers
 * ================================================================== */
function skyDome(
  top: string,
  horizon: string,
  bottom: string,
  sunDir: THREE.Vector3,
  sunColor = '#ffe9c4',
  sunPower = 1,
) {
  const geo = new THREE.SphereGeometry(400, 32, 24);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTop: { value: new THREE.Color(top) },
      uHorizon: { value: new THREE.Color(horizon) },
      uBottom: { value: new THREE.Color(bottom) },
      uSun: { value: new THREE.Color(sunColor) },
      uSunDir: { value: sunDir.clone().normalize() },
      uSunPower: { value: sunPower },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main(){
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop, uHorizon, uBottom, uSun, uSunDir;
      uniform float uSunPower;
      varying vec3 vDir;
      void main(){
        float y = vDir.y;
        vec3 col = y > 0.0
          ? mix(uHorizon, uTop, pow(clamp(y, 0.0, 1.0), 0.62))
          : mix(uHorizon, uBottom, pow(clamp(-y, 0.0, 1.0), 0.5));
        float d = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
        col += uSun * pow(d, 900.0) * 3.4 * uSunPower;
        col += uSun * pow(d, 12.0) * 0.16 * uSunPower;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}

function goldMark(envMap: THREE.Texture, scale: number, roughness = 0.19) {
  const mesh = new THREE.Mesh(createMarkGeometry(), createGoldMaterial(envMap, roughness));
  mesh.scale.setScalar(scale);
  return mesh;
}

/* ------------------------------------------------------------------ *
 *  A single blade of grass: a tapered, slightly curved strip.
 * ------------------------------------------------------------------ */
function createBladeGeometry(segments = 7) {
  const geo = new THREE.PlaneGeometry(1, 1, 1, segments);
  const pos = geo.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i) + 0.5; // 0 at the root, 1 at the tip
    const taper = Math.pow(1 - y, 0.55);
    pos.setX(i, x * taper);
    pos.setY(i, y - 0.5);
    pos.setZ(i, y * y * 0.09); // gentle forward curve
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();

  return geo;
}

/** Mottled earth — dry soil with patches of stubble. */
function earthTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#6f5a2c';
  ctx.fillRect(0, 0, 1024, 1024);

  // broad tonal patches
  for (let i = 0; i < 420; i++) {
    const r = randomBetween(18, 62);
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const warm = Math.random() > 0.5;
    g.addColorStop(0, warm ? 'rgba(138,110,54,0.16)' : 'rgba(70,55,25,0.15)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // stubble flecks
  for (let i = 0; i < 22000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const l = randomBetween(2, 7);
    ctx.strokeStyle = `rgba(${Math.random() > 0.45 ? '160,138,74' : '58,46,22'},${randomBetween(0.1, 0.4).toFixed(2)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + randomBetween(-2, 2), y - l);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(22, 22);
  tex.anisotropy = 8;
  return tex;
}

/* ================================================================== *
 *  1 — FIELD : sunlit grass, teal sky, floating mark
 * ================================================================== */
function buildField(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  isSmall: boolean,
): SceneApi {
  const envMap = createSkyEnvironment(renderer, {
    top: '#1f6f96',
    horizon: '#c8dde2',
    ground: '#6d5730',
    sun: '#ffdcb0',
    sunX: 0.68,
    sunY: 0.6,
    intensity: 1,
  });
  scene.environment = envMap;
  const goldEnv = createStudioEnvironment(renderer, '#ffeccd');

  const sunDir = new THREE.Vector3(0.62, 0.26, -0.74);
  scene.add(skyDome('#2b7fa4', '#cfe2e6', '#7a5f33', sunDir, '#ffe6c0', 1));

  scene.fog = new THREE.Fog('#b9d2da', 32, 150);

  camera.position.set(0, 1.15, 10);
  camera.lookAt(0, 1.35, -26);

  /* ------------------------------------------------------- grass */
  const blade = createBladeGeometry(6);
  blade.scale(0.155, 1, 1);

  const uniforms = {
    uTime: { value: 0 },
    uBase: { value: new THREE.Color('#58471f') },
    uMid: { value: new THREE.Color('#c49a3c') },
    uTip: { value: new THREE.Color('#fbeec2') },
  };

  const grassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.82,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  grassMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uBase = uniforms.uBase;
    shader.uniforms.uMid = uniforms.uMid;
    shader.uniforms.uTip = uniforms.uTip;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         varying float vH;
         varying float vSeed;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec3 iPos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
         float h = length(vec3(instanceMatrix[1][0], instanceMatrix[1][1], instanceMatrix[1][2]));
         float phase = iPos.x * 0.42 + iPos.z * 0.26;
         float gust  = sin(uTime * 0.62 + phase) * 0.62
                     + sin(uTime * 1.31 + phase * 2.1) * 0.26
                     + sin(uTime * 2.45 + phase * 0.7) * 0.11;
         float bend = pow(clamp(position.y, 0.0, 1.0), 1.85) * h;
         transformed.x += gust * bend * 0.55;
         transformed.z += gust * bend * 0.22;
         transformed.y -= abs(gust) * bend * 0.05;
         vH = clamp(position.y, 0.0, 1.0);
         vSeed = fract(iPos.x * 0.173 + iPos.z * 0.311);`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform vec3 uBase, uMid, uTip;
         varying float vH;
         varying float vSeed;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
         vec3 bladeCol = mix(uBase, uMid, smoothstep(0.0, 0.55, vH));
         bladeCol = mix(bladeCol, uTip, smoothstep(0.55, 1.0, vH));
         bladeCol *= 0.72 + vSeed * 0.62;
         diffuseColor.rgb *= bladeCol;`,
      );
  };

  const COUNT = isSmall ? 13000 : 30000;
  const grass = new THREE.InstancedMesh(blade, grassMat, COUNT);
  grass.frustumCulled = false;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();

  for (let i = 0; i < COUNT; i++) {
    const spread = Math.pow(Math.random(), 0.6);
    const x = (Math.random() - 0.5) * 92;
    const z = -Math.random() * 142 + 4;
    const near = 1 - Math.min(1, Math.abs(z - 0) / 26);
    const height = randomBetween(0.44, 0.86) + near * randomBetween(0, 0.5) + spread * 0.34;
    const width = randomBetween(0.68, 1.24);

    e.set(randomBetween(-0.1, 0.1), Math.random() * Math.PI * 2, randomBetween(-0.14, 0.14));
    q.setFromEuler(e);
    p.set(x, -0.22, z);
    s.set(width, height, 1);
    m.compose(p, q, s);
    grass.setMatrixAt(i, m);
  }
  grass.instanceMatrix.needsUpdate = true;
  scene.add(grass);

  /* -------------------------------------------------------- earth */
  const earth = new THREE.Mesh(
    new THREE.CircleGeometry(240, 64),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: earthTexture(),
      roughness: 1,
      metalness: 0,
    }),
  );
  earth.rotation.x = -Math.PI / 2;
  earth.position.y = -0.24;
  scene.add(earth);

  /* -------------------------------------------------------- sun */
  // (the sky shader already paints the sun, so no extra mesh is needed)

  /* ------------------------------------------------------- mark */
  const mark = goldMark(goldEnv, 3.5, 0.14);
  mark.position.set(0, 6.4, -17);
  scene.add(mark);

  const markLight = new THREE.PointLight(0xffd9a0, 60, 70, 2);
  markLight.position.set(-9, 14, -10);
  scene.add(markLight);

  const rim = new THREE.DirectionalLight(0xbfd8e6, 1.3);
  rim.position.set(-8, 6, -14);
  scene.add(rim);

  const key = new THREE.DirectionalLight(0xffe2b4, 2.1);
  key.position.set(9, 12, -6);
  scene.add(key);

  const fill = new THREE.HemisphereLight(0xcfe6f0, 0x7a6230, 1.15);
  scene.add(fill);

  let t = 0;
  return {
    update(_dt: number, delta: number, ptr: Pointer, _dragRotation: number) {
      t += delta;
      uniforms.uTime.value = t;

      mark.rotation.y = t * 0.24 + ptr.x * 0.3;
      mark.rotation.x = Math.sin(t * 0.4) * 0.14 - ptr.y * 0.14;
      mark.position.y = 6.4 + Math.sin(t * 0.7) * 0.28;

      camera.position.x = ptr.x * 0.85;
      camera.position.y = 1.15 - ptr.y * 0.22;
      camera.lookAt(0, 1.35, -26);
    },
  };
}

/* ================================================================== *
 *  2 — COAST : grey shore, rolling water, gold bars
 * ================================================================== */
function buildCoast(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  isSmall: boolean,
): SceneApi {
  const envMap = createSkyEnvironment(renderer, {
    top: '#7e93a1',
    horizon: '#c6d1d6',
    ground: '#3d3b36',
    sun: '#e9f0f4',
    sunX: 0.4,
    sunY: 0.74,
    intensity: 0.55,
  });
  scene.environment = envMap;
  const goldEnv = createStudioEnvironment(renderer, '#f2f6f8');

  scene.add(skyDome('#8397a5', '#c9d4d9', '#8d9497', new THREE.Vector3(-0.4, 0.5, -0.7), '#eef4f7', 0.5));
  scene.fog = new THREE.Fog('#c2cdd3', 90, 470);

  camera.position.set(0, 3.4, 14);
  camera.lookAt(0, 2.2, -40);

  /* -------------------------------------------------------- ocean */
  const oceanGeo = new THREE.PlaneGeometry(700, 700, isSmall ? 120 : 220, isSmall ? 120 : 220);
  oceanGeo.rotateX(-Math.PI / 2);

  const oceanUniforms = {
    uTime: { value: 0 },
    uDeep: { value: new THREE.Color('#16232c') },
    uShallow: { value: new THREE.Color('#35525c') },
    uSky: { value: new THREE.Color('#b9c7cd') },
    uSun: { value: new THREE.Color('#f2f7f8') },
    uSunDir: { value: new THREE.Vector3(-0.35, 0.42, -0.84).normalize() },
    uCam: { value: new THREE.Vector3() },
  };

  const WAVE = /* glsl */ `
    float waveH(vec2 p, float t){
      float h = 0.0;
      h += sin(dot(p, normalize(vec2(1.0, 0.22))) * 0.085 + t * 0.85) * 0.44;
      h += sin(dot(p, normalize(vec2(-0.35, 1.0))) * 0.135 + t * 1.15) * 0.26;
      h += sin(dot(p, normalize(vec2(0.72, -0.68))) * 0.31 + t * 1.75) * 0.11;
      h += sin(dot(p, normalize(vec2(0.1, 1.0))) * 0.62 + t * 2.6) * 0.045;
      return h;
    }
  `;

  const oceanMat = new THREE.ShaderMaterial({
    uniforms: oceanUniforms,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uCam;
      varying vec3 vWorld;
      varying float vH;
      ${WAVE}
      void main(){
        vec3 p = position;
        float h = waveH(p.xz, uTime);
        p.y += h;
        vH = h;
        vec4 world = modelMatrix * vec4(p, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uDeep, uShallow, uSky, uSun, uSunDir, uCam;
      varying vec3 vWorld;
      varying float vH;
      ${WAVE}
      void main(){
        float e = 0.55;
        float hx = waveH(vWorld.xz + vec2(e, 0.0), uTime) - waveH(vWorld.xz - vec2(e, 0.0), uTime);
        float hz = waveH(vWorld.xz + vec2(0.0, e), uTime) - waveH(vWorld.xz - vec2(0.0, e), uTime);
        vec3 n = normalize(vec3(-hx, 2.0 * e, -hz));

        vec3 viewDir = normalize(uCam - vWorld);
        float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.4);

        float depthFade = smoothstep(0.0, 120.0, length(vWorld.xz - uCam.xz));
        vec3 base = mix(uShallow, uDeep, depthFade);
        vec3 col = mix(base, uSky, fres * 0.86);

        vec3 h = normalize(uSunDir + viewDir);
        float spec = pow(max(dot(n, h), 0.0), 180.0);
        col += uSun * spec * 1.4;

        float crest = smoothstep(0.42, 0.72, vH);
        col += vec3(0.55, 0.62, 0.66) * crest * 0.34;

        float dist = length(vWorld.xz - vec2(uCam.x, 12.0));
        float foam = smoothstep(26.0, 6.0, dist) * (0.35 + crest * 0.9);
        foam *= smoothstep(0.35, 0.62, noise(vWorld.xz * 0.22 + uTime * 0.12));
        col = mix(col, vec3(0.86, 0.89, 0.9), clamp(foam, 0.0, 0.75));

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    fog: false,
  });

  // noise helper needed by the fragment shader
  oceanMat.fragmentShader = NOISE_GLSL + oceanMat.fragmentShader;

  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.position.y = 0;
  scene.add(ocean);

  /* --------------------------------------------------------- shore */
  const sandGeo = new THREE.PlaneGeometry(120, 90, 60, 45);
  sandGeo.rotateX(-Math.PI / 2);
  const sandPos = sandGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < sandPos.count; i++) {
    const x = sandPos.getX(i);
    const z = sandPos.getZ(i);
    const edge = THREE.MathUtils.clamp((z + 22) / 34, 0, 1);
    sandPos.setY(
      i,
      Math.sin(x * 0.18) * 0.16 + Math.cos(z * 0.31) * 0.12 + (1 - edge) * -0.9,
    );
  }
  sandGeo.computeVertexNormals();
  const sand = new THREE.Mesh(
    sandGeo,
    new THREE.MeshStandardMaterial({ color: 0x2b2a26, roughness: 0.96, metalness: 0.02 }),
  );
  sand.position.set(0, 0.05, 22);
  scene.add(sand);

  /* --------------------------------------------------------- rocks */
  const rockGeo = new THREE.IcosahedronGeometry(1, 1);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x33322d, roughness: 0.94 });
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, isSmall ? 70 : 150);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  for (let i = 0; i < rocks.count; i++) {
    e.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    q.setFromEuler(e);
    p.set(randomBetween(-34, 34), randomBetween(-0.4, 0.2), randomBetween(-4, 26));
    const sc = randomBetween(0.16, 0.85);
    s.set(sc * randomBetween(0.8, 1.6), sc * randomBetween(0.5, 1), sc * randomBetween(0.8, 1.5));
    m.compose(p, q, s);
    rocks.setMatrixAt(i, m);
  }
  rocks.instanceMatrix.needsUpdate = true;
  scene.add(rocks);

  /* ----------------------------------------------------- mountains */
  // Irregular low-poly peaks with a vertical value gradient, so they read as
  // land rather than flat cardboard triangles.
  const peakMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0,
    flatShading: false,
  });

  const makePeak = (radius: number, height: number, seed: number) => {
    const geo = new THREE.ConeGeometry(radius, height, 9, 4);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      if (r > 0.001) {
        // wobble the silhouette, strongest near the base
        const k = 1 + Math.sin(Math.atan2(z, x) * 3 + seed) * 0.16 * (1 - (y + height / 2) / height);
        pos.setX(i, x * k);
        pos.setZ(i, z * k);
      }
    }
    const cols: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const t = Math.max(0, Math.min(1, (pos.getY(i) + height / 2) / height));
      // snow-lit crest fading into a cool shadowed base
      cols.push(0.86 + t * 0.14, 0.89 + t * 0.11, 0.92 + t * 0.08);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    return geo;
  };

  const peaks: [number, number, number, number][] = [
    [-150, -300, 96, 72],
    [-72, -268, 62, 46],
    [-8, -300, 118, 88],
    [78, -262, 70, 52],
    [152, -296, 104, 66],
    [230, -330, 130, 94],
  ];
  peaks.forEach(([x, z, w, h], i) => {
    const cone = new THREE.Mesh(makePeak(w, h, i * 2.3), peakMat);
    cone.position.set(x, h / 2 - 16, z);
    cone.rotation.y = i * 1.7;
    scene.add(cone);
  });

  /* -------------------------------------------------- gold bars */
  const gold = createGoldMaterial(goldEnv, 0.26, 1.7);
  const bars: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, 0.3), gold);
    bar.geometry.translate(0, 2.3, 0);
    bar.position.set(randomBetween(-16, 16), -0.4, randomBetween(-36, -13));
    bar.rotation.z = randomBetween(-0.14, 0.14);
    bars.push(bar);
    scene.add(bar);
  }

  /* ------------------------------------------------------- mark */
  const mark = goldMark(goldEnv, 2.5, 0.16);
  mark.position.set(0, 7.4, -8);
  scene.add(mark);

  scene.add(new THREE.HemisphereLight(0xc9d7de, 0x1b1a17, 0.85));
  const sun = new THREE.DirectionalLight(0xf2f7fa, 1.5);
  sun.position.set(-40, 46, -60);
  scene.add(sun);

  let t = 0;
  const basePos = bars.map((b) => b.position.clone());

  return {
    update(_dt: number, delta: number, ptr: Pointer, _dragRotation: number) {
      t += delta;
      oceanUniforms.uTime.value = t;
      oceanUniforms.uCam.value.copy(camera.position);

      mark.rotation.y = t * 0.3 + ptr.x * 0.4;
      mark.rotation.z = Math.sin(t * 0.5) * 0.12;
      mark.position.y = 7.4 + Math.sin(t * 0.68) * 0.36;

      bars.forEach((bar, i) => {
        const target = basePos[i];
        bar.position.x = target.x + Math.sin(t * 0.5 + i) * 0.6;
        bar.position.z = target.z + Math.cos(t * 0.42 + i) * 0.5;
        bar.rotation.y = t * (0.18 + i * 0.05) + i;
        bar.rotation.z = Math.sin(t * 0.7 + i * 1.7) * 0.16;
      });

      camera.position.x = ptr.x * 1.4;
      camera.position.y = 3.4 - ptr.y * 0.7;
      camera.lookAt(0, 2.6, -40);
    },
  };
}

/* ================================================================== *
 *  3 — AURORA : night shore, curtains of light, draggable mark
 * ================================================================== */
function buildAurora(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  isSmall: boolean,
): SceneApi {
  const envMap = createSkyEnvironment(renderer, {
    top: '#03111b',
    horizon: '#06202c',
    ground: '#05090c',
    sun: '#9fd8ff',
    sunX: 0.78,
    sunY: 0.42,
    intensity: 0.35,
  });
  scene.environment = envMap;
  const goldEnv = createStudioEnvironment(renderer, '#fff0cf');

  scene.add(skyDome('#020a12', '#062231', '#01050a', new THREE.Vector3(0.7, 0.3, -0.6), '#bfe4ff', 0.7));
  scene.fog = new THREE.FogExp2('#03090f', 0.0075);

  camera.position.set(0, 2.6, 13);
  camera.lookAt(0, 8.4, -22);

  /* ------------------------------------------------------- stars */
  const starCount = isSmall ? 900 : 2000;
  const starPos = new Float32Array(starCount * 3);
  const starSeed = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    const r = randomBetween(120, 330);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(randomBetween(-0.05, 1));
    starPos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    starPos[i * 3 + 1] = Math.cos(phi) * r * 0.72 + 30;
    starPos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    starSeed[i] = Math.random();
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('aSeed', new THREE.BufferAttribute(starSeed, 1));
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSize: { value: window.innerWidth < 720 ? 110 : 180 } },
    vertexShader: /* glsl */ `
      uniform float uTime, uSize;
      attribute float aSeed;
      varying float vTwinkle;
      void main(){
        vTwinkle = 0.55 + 0.45 * sin(uTime * (0.7 + aSeed * 1.6) + aSeed * 30.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * (0.25 + aSeed * 0.75) / -mv.z * 12.0;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vTwinkle;
      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(0.86, 0.93, 1.0), a * vTwinkle);
      }
    `,
  });
  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  scene.add(stars);

  /* ------------------------------------------------------ aurora */
  const auroraUniforms = {
    uTime: { value: 0 },
    uLow: { value: new THREE.Color('#12d18a') },
    uHigh: { value: new THREE.Color('#2f6bd8') },
  };
  const auroraMat = new THREE.ShaderMaterial({
    uniforms: auroraUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uLow, uHigh;
      varying vec2 vUv;
      ${NOISE_GLSL}
      void main(){
        float n1 = fbm(vec2(vUv.x * 4.2 + uTime * 0.035, vUv.y * 1.6 - uTime * 0.055));
        float n2 = fbm(vec2(vUv.x * 9.5 - uTime * 0.06, vUv.y * 2.4 + uTime * 0.03));
        float curtain = smoothstep(0.36, 0.78, n1 * 0.68 + n2 * 0.32);
        float fade = smoothstep(0.0, 0.22, vUv.y) * (1.0 - smoothstep(0.5, 1.0, vUv.y));
        float rays = 0.55 + 0.45 * sin(vUv.x * 120.0 + n2 * 8.0);
        vec3 col = mix(uLow, uHigh, smoothstep(0.05, 0.85, vUv.y));
        float a = curtain * fade * (0.55 + rays * 0.45);
        gl_FragColor = vec4(col * (0.85 + curtain), a * 1.25);
      }
    `,
  });

  const auroraGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const geo = new THREE.PlaneGeometry(620, 300, 1, 1);
    const mesh = new THREE.Mesh(geo, auroraMat);
    mesh.position.set((i - 1.5) * 46, 84 + i * 16, -190 - i * 52);
    mesh.rotation.z = (i - 1.5) * 0.026;
    auroraGroup.add(mesh);
  }
  scene.add(auroraGroup);

  /* ------------------------------------------------------ ground */
  const groundGeo = new THREE.PlaneGeometry(300, 300, 80, 80);
  groundGeo.rotateX(-Math.PI / 2);
  const groundPos = groundGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < groundPos.count; i++) {
    const x = groundPos.getX(i);
    const z = groundPos.getZ(i);
    groundPos.setY(i, Math.sin(x * 0.14) * 0.22 + Math.cos(z * 0.19) * 0.17);
  }
  groundGeo.computeVertexNormals();
  const ground = new THREE.Mesh(
    groundGeo,
    new THREE.MeshStandardMaterial({ color: 0x0a0f14, roughness: 0.62, metalness: 0.12 }),
  );
  ground.position.y = -1.1;
  scene.add(ground);

  /* ------------------------------------------------------- ridge */
  // A silhouetted mountain range between the aurora and the plain — it
  // turns the lower band of the frame into landscape instead of a black bar.
  const ridgeGeo = new THREE.PlaneGeometry(620, 90, 220, 1);
  const ridgePos = ridgeGeo.attributes.position as THREE.BufferAttribute;
  const ridgeColors: number[] = [];
  for (let i = 0; i < ridgePos.count; i++) {
    const x = ridgePos.getX(i);
    const top = ridgePos.getY(i) > 0;
    if (top) {
      const h =
        Math.sin(x * 0.031) * 13 +
        Math.sin(x * 0.077 + 1.7) * 7.5 +
        Math.sin(x * 0.161 + 0.4) * 3.4 +
        Math.sin(x * 0.41 + 2.2) * 1.2;
      ridgePos.setY(i, 8 + h * 0.5 + 20);
    }
  }
  // vertical gradient: a faint aurora bounce on the peaks
  for (let i = 0; i < ridgePos.count; i++) {
    const y = ridgePos.getY(i);
    const t = Math.max(0, Math.min(1, (y + 25) / 70));
    ridgeColors.push(0.03 + t * 0.09, 0.07 + t * 0.18, 0.1 + t * 0.2);
  }
  ridgeGeo.setAttribute('color', new THREE.Float32BufferAttribute(ridgeColors, 3));
  ridgeGeo.computeVertexNormals();
  const ridge = new THREE.Mesh(
    ridgeGeo,
    new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide }),
  );
  ridge.position.set(0, 6, -132);
  scene.add(ridge);

  const ridge2 = ridge.clone();
  ridge2.scale.set(0.78, 0.62, 1);
  ridge2.position.set(28, 2, -96);
  ridge2.material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    fog: false,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.88,
  });
  scene.add(ridge2);

  /* -------------------------------------------------------- rocks */
  const rockGeo = new THREE.IcosahedronGeometry(1, 1);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x39424a, roughness: 0.88, metalness: 0.06 });
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, isSmall ? 60 : 130);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  for (let i = 0; i < rocks.count; i++) {
    e.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    q.setFromEuler(e);
    p.set(randomBetween(-26, 26), randomBetween(-1.3, -0.8), randomBetween(-8, 24));
    const sc = randomBetween(0.2, 1.05);
    s.set(sc * randomBetween(0.8, 1.7), sc * randomBetween(0.5, 1), sc * randomBetween(0.8, 1.4));
    m.compose(p, q, s);
    rocks.setMatrixAt(i, m);
  }
  rocks.instanceMatrix.needsUpdate = true;
  scene.add(rocks);

  /* --------------------------------------------------------- moon */
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xdfeaf2, fog: false }),
  );
  moon.position.set(64, 44, -150);
  scene.add(moon);

  /* --------------------------------------------------------- mark */
  const mark = goldMark(goldEnv, 2.6, 0.14);
  mark.position.set(0, 11.4, -7);
  scene.add(mark);

  const key = new THREE.PointLight(0xffd9a4, 34, 60, 2);
  key.position.set(-8, 9, 6);
  scene.add(key);
  const fill = new THREE.HemisphereLight(0x1d5f7a, 0x05080b, 0.6);
  scene.add(fill);

  let t = 0;
  return {
    update(_dt: number, delta: number, ptr: Pointer, dragRotation: number) {
      t += delta;
      starMat.uniforms.uTime.value = t;
      auroraUniforms.uTime.value = t;

      auroraGroup.rotation.y = Math.sin(t * 0.03) * 0.04;
      auroraGroup.children.forEach((c, i) => {
        c.position.x = (i - 1) * 40 + Math.sin(t * 0.07 + i) * 8;
      });

      mark.rotation.y = t * 0.24 + dragRotation + ptr.x * 0.3;
      mark.rotation.x = Math.sin(t * 0.38) * 0.14 - ptr.y * 0.12;
      mark.position.y = 5.4 + Math.sin(t * 0.62) * 0.3;

      camera.position.x = ptr.x * 1.1;
      camera.position.y = 2.6 - ptr.y * 0.55;
      camera.lookAt(0, 8.4, -22);
    },
  };
}
