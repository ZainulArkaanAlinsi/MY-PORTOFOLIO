'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { profile } from '@/data/portfolio';
import { useApp } from '@/i18n/provider';

/**
 * Interactive 3D retro computer — a boxy CRT monitor on a desktop case with a
 * floppy slot, keyboard and mouse. Drag to orbit; idles with a gentle sway.
 *
 * Realism (desktop): image-based lighting (RoomEnvironment) + a contrasted
 * three-point key/fill/rim rig, procedural micro-surface on the plastic (bump +
 * roughness noise so it reads as molded, slightly-aged plastic instead of flat
 * toy plastic), and a real soft grounded shadow (PCFSoft shadow map onto a
 * transparent ShadowMaterial catcher) so it sits on the page.
 *
 * Kept light: the shadow map runs on desktop only — phones fall back to a cheap
 * fake contact shadow, cap DPR + ~60fps, build the env map once, render straight
 * to the canvas (transparent bg), and pause the loop entirely off-screen.
 */
export default function RetroComputer3D({ active = true }: { active?: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { t } = useApp();
  const tRef = useRef(t);
  const redrawRef = useRef<((cursor?: boolean) => void) | null>(null);
  const [showHint, setShowHint] = useState(true);
  // Orbiting is a mouse-only affordance: a one-finger drag on a phone has to
  // stay a page scroll (see `canOrbit` below), so the hint would be a lie.
  const [canOrbit, setCanOrbit] = useState(false);
  const [booted, setBooted] = useState(false);

  // Mouse pointers get the grab cursor and the "drag to rotate" chip; touch
  // devices get neither, because orbiting is disabled there so swipes scroll.
  // Deferred a frame so this never sets state straight from an effect body.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setCanOrbit(!window.matchMedia('(pointer: coarse)').matches)
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // Booting the scene (env map + two procedural textures + ~60 meshes) is a
  // solid block of main-thread work. Running it during load starved every timer
  // and animation frame on the page — the preloader could not even finish
  // counting. It now waits for `active` (the preloader being gone) and then for
  // an idle slot, so the CRT fades in over an already-interactive hero.
  useEffect(() => {
    if (!active) return;
    const ric = (window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    });
    const go = () => setBooted(true);
    if (ric.requestIdleCallback) {
      const id = ric.requestIdleCallback(go, { timeout: 800 });
      return () => ric.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(go, 200);
    return () => clearTimeout(id);
  }, [active]);

  useEffect(() => {
    if (!booted) return;
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Touch devices never orbit: OrbitControls takes a pointer capture and sets
    // `touch-action: none`, which turned this 330px-tall block into a dead zone
    // where the page could not be scrolled at all.
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const isMobile = coarse || window.innerWidth < 768;

    let width = mount.clientWidth;
    let height = mount.clientHeight;
    // a zero-size mount would make camera.aspect NaN and blank the canvas
    if (width < 1 || height < 1) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(1.2, 1.85, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // The canvas is small (and paused off-screen), so a crisp DPR is affordable
    // even on phones — DPR 1.3 made it look pixelated ("pecah") on hi-DPI screens.
    // Cap at 2 (mobile) / 1.75 (desktop): sharp, still no realtime shadow pass.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 1.75));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02; // bright, playful — sits on a light warm page
    mount.appendChild(renderer.domElement);

    // ---- image-based lighting (generated once) ----
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRT = pmrem.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    envScene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry?.dispose?.();
        const m = o.material;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else m?.dispose?.();
      }
    });
    pmrem.dispose();

    // ---- three-point rig: warm key + cool fill + rim (no shadow map) ----
    const key = new THREE.DirectionalLight(0xfff0dc, 1.55);
    key.position.set(2.2, 9, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xbfd4e6, 0.35);
    fill.position.set(-5, 2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xd9885a, 0.5);
    rim.position.set(-3, 3, -5);
    scene.add(rim);
    const screenGlow = new THREE.PointLight(0xffaa4d, 0.65, 4.5, 2);
    screenGlow.position.set(0, 1.6, 1.6);
    scene.add(screenGlow);

    // ---- procedural micro-surface: fine bump + roughness variation so the
    // plastic reads as molded/aged instead of a flat matte toy ----
    const makeNoise = (
      size: number,
      base: number,
      spread: number,
      grain: number,
    ) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = size;
      const c = cv.getContext('2d')!;
      const img = c.createImageData(size, size);
      for (let i = 0; i < size * size; i++) {
        // low-freq mottle + high-freq grain
        const gx = (i % size) / size;
        const gy = Math.floor(i / size) / size;
        const low =
          Math.sin(gx * 6.283 * 2 + 1.3) * Math.cos(gy * 6.283 * 2) * 0.5;
        const v = base + low * spread + (Math.random() - 0.5) * grain;
        const g = Math.max(0, Math.min(255, v * 255));
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = g;
        img.data[i * 4 + 3] = 255;
      }
      c.putImageData(img, 0, 0);
      const tex = new THREE.CanvasTexture(cv);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      return tex;
    };
    const bumpTex = makeNoise(256, 0.5, 0.18, 0.5);
    const roughTex = makeNoise(256, 0.55, 0.16, 0.3);

    // ---- materials (tuned to catch the env → molded plastic) ----
    const plastic = new THREE.MeshStandardMaterial({
      color: 0xe6d4bd,
      roughness: 0.62,
      metalness: 0.0,
      bumpMap: bumpTex,
      bumpScale: 0.014,
      roughnessMap: roughTex,
    });
    const plasticTop = new THREE.MeshStandardMaterial({
      color: 0xefe1cd,
      roughness: 0.58,
      metalness: 0.0,
      bumpMap: bumpTex,
      bumpScale: 0.012,
      roughnessMap: roughTex,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x1d130d,
      roughness: 0.5,
      metalness: 0.25,
    });
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0xede2d1,
      roughness: 0.58,
      metalness: 0.0,
      bumpMap: bumpTex,
      bumpScale: 0.006,
    });
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xcdb29a, roughness: 0.42, metalness: 0.15 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.9, metalness: 0.0 });
    const redLed = new THREE.MeshStandardMaterial({ color: 0x3a0808, emissive: 0xe0392a, emissiveIntensity: 2.2 });
    const greenLed = new THREE.MeshStandardMaterial({ color: 0x0a2a12, emissive: 0x53c07a, emissiveIntensity: 1.9 });

    const box = (w: number, h: number, d: number, r: number, m: THREE.Material) =>
      new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), m);

    const pc = new THREE.Group();
    scene.add(pc);
    // inner rig, shifted so the model's footprint centroid sits on pc's spin
    // axis — rotation stays balanced and nothing sweeps out of frame.
    const rig = new THREE.Group();
    rig.position.set(-0.1, 0, -0.45);
    pc.add(rig);

    // ===== desktop case =====
    const plinth = box(2.75, 0.08, 2.0, 0.03, dark);
    plinth.position.y = 0.04;
    rig.add(plinth);
    const kase = box(2.9, 0.56, 2.1, 0.05, plastic);
    kase.position.y = 0.36;
    rig.add(kase);
    const caseTop = box(2.68, 0.05, 1.9, 0.02, plasticTop);
    caseTop.position.y = 0.65;
    rig.add(caseTop);
    // seam line across the case face (two-tone reveals a moulding split)
    const seam = box(2.86, 0.012, 0.02, 0.004, dark);
    seam.position.set(0, 0.55, 1.055);
    rig.add(seam);
    // floppy slot + eject
    const floppy = box(1.3, 0.09, 0.05, 0.02, dark);
    floppy.position.set(-0.5, 0.44, 1.05);
    rig.add(floppy);
    const eject = box(0.12, 0.05, 0.05, 0.01, knobMat);
    eject.position.set(0.12, 0.44, 1.07);
    rig.add(eject);
    // power button + led
    const powerBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.06, 20), knobMat);
    powerBtn.rotation.x = Math.PI / 2;
    powerBtn.position.set(1.05, 0.4, 1.05);
    rig.add(powerBtn);
    const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), greenLed);
    powerLed.position.set(1.05, 0.22, 1.07);
    rig.add(powerLed);
    // brand plaque + accent dot
    const plaque = box(0.4, 0.12, 0.02, 0.02, dark);
    plaque.position.set(0.55, 0.22, 1.06);
    rig.add(plaque);
    const plaqueDot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), redLed);
    plaqueDot.position.set(0.4, 0.22, 1.07);
    rig.add(plaqueDot);
    // vents
    for (let i = 0; i < 4; i++) {
      const v = box(0.9, 0.015, 0.03, 0.005, dark);
      v.position.set(-0.5, 0.26 + i * 0.045, 1.06);
      rig.add(v);
    }
    // rubber feet (grounds the case → real contact)
    for (const fx of [-1.2, 1.2]) {
      for (const fz of [-0.85, 0.85]) {
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), rubber);
        foot.position.set(fx, 0.02, fz);
        rig.add(foot);
      }
    }

    // ===== monitor =====
    const mon = box(2.54, 2.02, 1.5, 0.1, plastic);
    mon.position.set(0, 1.66, -0.05);
    rig.add(mon);
    // CRT tube bulge at the back
    const hump = box(1.65, 1.5, 0.72, 0.14, plastic);
    hump.position.set(0, 1.72, -0.95);
    rig.add(hump);
    // recessed dark bezel
    const bezel = box(2.24, 1.72, 0.14, 0.05, dark);
    bezel.position.set(0, 1.74, 0.68);
    rig.add(bezel);

    // ===== screen (live canvas texture) =====
    const CW = 640;
    const CH = 492;
    const canvas = document.createElement('canvas');
    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext('2d')!;
    const screenTex = new THREE.CanvasTexture(canvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const draw = (cursorOn = true) => {
      const tt = tRef.current;
      ctx.fillStyle = '#0c0603';
      ctx.fillRect(0, 0, CW, CH);
      // lit picture area (rounded — reads as a curved CRT)
      ctx.save();
      roundRect(10, 10, CW - 20, CH - 20, 34);
      ctx.clip();
      ctx.fillStyle = '#160c05';
      ctx.fillRect(0, 0, CW, CH);
      const amber = '#ffb45a';
      const dimc = 'rgba(255,182,96,0.5)';
      const ok = '#cfe08a';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 15px monospace';
      ctx.shadowColor = 'rgba(255,150,50,0.55)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = amber;
      ctx.fillText('PORTFOLIO.SYS', 30, 22);
      ctx.fillStyle = dimc;
      ctx.textAlign = 'right';
      ctx.fillText('RES // 1920PX', CW - 30, 22);
      ctx.textAlign = 'left';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,176,80,0.25)';
      ctx.beginPath();
      ctx.moveTo(28, 48);
      ctx.lineTo(CW - 28, 48);
      ctx.stroke();

      const lines: {
        segs?: { text: string; c: string }[];
        size?: number;
        bold?: boolean;
        cursor?: boolean;
        gap?: number;
      }[] = [
        { segs: [{ text: '> ', c: dimc }, { text: 'boot portfolio.sys', c: amber }], size: 15 },
        { segs: [{ text: 'loading modules ........ OK', c: dimc }], size: 15 },
        { segs: [{ text: '> ', c: dimc }, { text: 'whoami', c: amber }], size: 15 },
        { segs: [{ text: profile.name, c: amber }], size: 18, bold: true },
        { gap: 10 },
        { segs: [{ text: 'role   : ', c: dimc }, { text: tt.hero.role, c: amber }], size: 14 },
        { segs: [{ text: 'based  : ', c: dimc }, { text: profile.location, c: amber }], size: 14 },
        { segs: [{ text: 'stack  : ', c: dimc }, { text: 'Next.js · Laravel · Flutter', c: amber }], size: 14 },
        { segs: [{ text: 'status : ', c: dimc }, { text: `> ${tt.contact.available}`, c: ok }], size: 14 },
        { gap: 10 },
        { segs: [{ text: '> ', c: dimc }], size: 15, cursor: true },
      ];

      let y = 64;
      ctx.shadowColor = 'rgba(255,150,50,0.5)';
      for (const ln of lines) {
        if (ln.gap) {
          y += ln.gap;
          continue;
        }
        const size = ln.size ?? 14;
        ctx.font = `${ln.bold ? 'bold ' : ''}${size}px monospace`;
        let x = 32;
        for (const s of ln.segs ?? []) {
          ctx.fillStyle = s.c;
          ctx.shadowBlur = 5;
          ctx.fillText(s.text, x, y);
          x += ctx.measureText(s.text).width;
        }
        if (ln.cursor && cursorOn) {
          ctx.shadowBlur = 6;
          ctx.fillStyle = amber;
          ctx.fillRect(x + 1, y + 1, size * 0.55, size);
        }
        y += size * 1.55;
      }
      // scanlines
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      for (let sy = 0; sy < CH; sy += 3) ctx.fillRect(0, sy, CW, 1);
      // vignette (tube curvature)
      const vg = ctx.createRadialGradient(CW / 2, CH / 2, CH * 0.22, CW / 2, CH / 2, CH * 0.7);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, CW, CH);
      ctx.restore();
      screenTex.needsUpdate = true;
    };
    redrawRef.current = draw;
    draw(true);

    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false });
    // subtly convex screen so it catches the room like curved CRT glass
    const screenGeo = new THREE.PlaneGeometry(2.0, 1.52, 24, 18);
    {
      const pos = screenGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) / 1.0;
        const y = pos.getY(i) / 0.76;
        pos.setZ(i, (1 - x * x * 0.5 - y * y * 0.5) * 0.05);
      }
      screenGeo.computeVertexNormals();
    }
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 1.74, 0.76);
    rig.add(screen);

    // glass glare overlay (sells the curved glass)
    const glareCanvas = document.createElement('canvas');
    glareCanvas.width = glareCanvas.height = 128;
    const gctx = glareCanvas.getContext('2d')!;
    const gg = gctx.createLinearGradient(0, 0, 128, 128);
    gg.addColorStop(0, 'rgba(255,255,255,0.5)');
    gg.addColorStop(0.4, 'rgba(255,255,255,0.05)');
    gg.addColorStop(1, 'rgba(255,255,255,0)');
    gctx.fillStyle = gg;
    gctx.fillRect(0, 0, 128, 128);
    const glareTex = new THREE.CanvasTexture(glareCanvas);
    const glareMat = new THREE.MeshBasicMaterial({
      map: glareTex,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glare = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.52), glareMat);
    glare.position.set(0, 1.74, 0.79);
    rig.add(glare);

    // monitor controls (below the screen)
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), redLed);
    led.position.set(0.86, 0.84, 0.72);
    rig.add(led);
    for (let i = 0; i < 2; i++) {
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 18), knobMat);
      knob.rotation.x = Math.PI / 2;
      knob.position.set(-0.62 - i * 0.2, 0.84, 0.71);
      rig.add(knob);
    }
    // top vents
    for (let i = 0; i < 7; i++) {
      const v = box(0.05, 0.015, 0.62, 0.005, dark);
      v.position.set(-0.66 + i * 0.22, 2.68, -0.2);
      rig.add(v);
    }

    // ===== keyboard =====
    const kb = new THREE.Group();
    const kbBase = box(2.15, 0.11, 0.88, 0.05, plastic);
    kb.add(kbBase);
    const keyGeo = new RoundedBoxGeometry(0.12, 0.06, 0.12, 2, 0.02);
    const rowCols = [13, 13, 12, 11];
    rowCols.forEach((cols, r) => {
      const spanX = (cols - 1) * 0.148;
      for (let c = 0; c < cols; c++) {
        const kkey = new THREE.Mesh(keyGeo, keyMat);
        kkey.position.set(-spanX / 2 + c * 0.148, 0.08, -0.26 + r * 0.155);
        kb.add(kkey);
      }
    });
    const space = box(0.95, 0.06, 0.12, 0.02, keyMat);
    space.position.set(0, 0.08, -0.26 + 4 * 0.155);
    kb.add(space);
    kb.position.set(-0.05, 0.06, 1.78);
    kb.rotation.x = -0.05;
    rig.add(kb);

    // ===== mouse (+ curved cable back to the case) =====
    const mouse = box(0.26, 0.12, 0.4, 0.1, plastic);
    mouse.position.set(1.42, 0.07, 1.62);
    rig.add(mouse);
    const mline = box(0.012, 0.02, 0.14, 0.004, dark);
    mline.position.set(1.42, 0.13, 1.54);
    rig.add(mline);
    const cable = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.42, 0.05, 1.44),
      new THREE.Vector3(1.2, 0.04, 1.2),
      new THREE.Vector3(1.35, 0.03, 1.05),
      new THREE.Vector3(1.0, 0.05, 1.02),
    ]);
    const cableMesh = new THREE.Mesh(
      new THREE.TubeGeometry(cable, 24, 0.016, 6, false),
      dark,
    );
    rig.add(cableMesh);

    // ===== grounded shadow =====
    // cheap fake contact shadow (a baked radial blob) — no per-frame shadow pass
    const shCanvas = document.createElement('canvas');
    shCanvas.width = shCanvas.height = 128;
    const sc = shCanvas.getContext('2d')!;
    const rg = sc.createRadialGradient(64, 64, 6, 64, 64, 62);
    rg.addColorStop(0, 'rgba(50,22,6,0.45)');
    rg.addColorStop(1, 'rgba(50,22,6,0)');
    sc.fillStyle = rg;
    sc.fillRect(0, 0, 128, 128);
    const fakeShadowTex = new THREE.CanvasTexture(shCanvas);
    fakeShadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 4.4),
      new THREE.MeshBasicMaterial({ map: fakeShadowTex, transparent: true, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, 0.008, 0.05);
    scene.add(shadow);

    // ---- controls (rotate only; limits keep the pretty front in view) ----
    const controls = new OrbitControls(camera, renderer.domElement);
    // OrbitControls forces `touch-action: none` on its element. On a phone that
    // swallows every vertical swipe that starts on the computer, so the page
    // cannot be scrolled past the hero. Hand scrolling back to the browser.
    if (coarse) {
      controls.enabled = false;
      renderer.domElement.style.touchAction = 'pan-y';
      mount.style.touchAction = 'pan-y';
    }
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI * 0.36;
    controls.maxPolarAngle = Math.PI * 0.46;
    controls.minAzimuthAngle = -Math.PI * 0.26;
    controls.maxAzimuthAngle = Math.PI * 0.26;
    controls.target.set(0, 1.15, 0);
    controls.update();

    // gentle idle sway (eased out while the user is dragging)
    let swayTarget = reduced ? 0 : 1;
    let sway = 0;
    let dismissedHint = false;
    const dismissHint = () => {
      if (dismissedHint) return;
      dismissedHint = true;
      setShowHint(false);
    };
    controls.addEventListener('start', () => {
      swayTarget = 0;
      dismissHint();
    });
    controls.addEventListener('end', () => {
      if (!reduced) swayTarget = 1;
    });

    // ---- render loop ----
    // Desktop runs at the display's native refresh (rAF follows the monitor).
    // Phones are capped near 60fps. Paused entirely when scrolled off-screen.
    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    let inView = true;
    // Cap the loop: 30fps phones (battery), 60fps desktop (no point pushing
    // 120/144Hz for a subtle idle sway — it just burns GPU during scroll).
    const minFrameMs = isMobile ? 1000 / 30 - 3 : 1000 / 60 - 2;
    let lastTs = 0;
    const render = () => {
      if (!running) return;
      raf = requestAnimationFrame(render);
      if (minFrameMs) {
        const now = performance.now();
        if (now - lastTs < minFrameMs) return;
        lastTs = now;
      }
      const et = clock.getElapsedTime();
      sway += (swayTarget - sway) * 0.05;
      pc.rotation.y = sway * Math.sin(et * 0.45) * 0.13;
      pc.rotation.x = sway * Math.sin(et * 0.3) * 0.02;
      controls.update();
      renderer.render(scene, camera);
    };
    render();
    const setRunning = (n: boolean) => {
      if (n === running) return;
      running = n;
      if (running) render();
    };
    const onVis = () => setRunning(inView && !document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        setRunning(inView && !document.hidden);
      },
      { threshold: 0 },
    );
    io.observe(mount);

    // blinking caret — skipped while the loop is parked (off-screen / hidden
    // tab) so we don't keep repainting and re-uploading a texture nobody sees
    let cursorOn = true;
    const blink = window.setInterval(() => {
      if (!running) return;
      cursorOn = !cursorOn;
      draw(cursorOn);
    }, 540);

    // Track the element, not the window: on phones the address bar sliding away
    // fires `resize` constantly (re-laying out the canvas for nothing), while a
    // container that changes width without a window resize was never picked up.
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w < 1 || h < 1 || (w === width && h === height)) return;
      width = w;
      height = h;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // auto-dismiss the drag hint after a beat even without interaction
    const hintTimer = window.setTimeout(dismissHint, 4200);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearInterval(blink);
      clearTimeout(hintTimer);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      controls.dispose();
      redrawRef.current = null;
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry?.dispose?.();
          const m = o.material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m?.dispose?.();
        }
      });
      bumpTex.dispose();
      roughTex.dispose();
      screenTex.dispose();
      glareTex.dispose();
      fakeShadowTex?.dispose();
      envRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [booted]);

  useEffect(() => {
    tRef.current = t;
    redrawRef.current?.(true);
  }, [t]);

  return (
    <div className="relative mx-auto w-full">
      {/* `touch-action` is set from the effect: `pan-y` on touch devices so a
          swipe here scrolls the page instead of being swallowed by the canvas. */}
      <div
        ref={mountRef}
        className={`relative mx-auto h-[330px] w-full transition-opacity duration-700 sm:h-[min(420px,40vh)] ${
          booted ? 'opacity-100' : 'opacity-0'
        } ${canOrbit ? 'cursor-grab touch-none active:cursor-grabbing' : ''}`}
      />
      {/* auto-hiding drag affordance — a chip, not a permanent caption */}
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-[color:var(--rebel)]/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 backdrop-blur-sm transition-opacity duration-700 ${
          showHint && canOrbit ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="animate-pulse">⟳</span> {t.hero.dragRotate}
      </div>
    </div>
  );
}
