'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Cinematic WebGL backdrop — a metallic icosahedron centerpiece wrapped by a
 * thin rotating ring, small floating solids, and a field of particles, lit by
 * warm/cool point lights against atmospheric fog. Pointer-events are disabled
 * so the canvas never blocks scrolling.
 */
export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Lighten the scene on phones/tablets: fewer particles, lower pixel
    // ratio, no MSAA — keeps the 3D backdrop smooth instead of janky.
    const isMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // --- Scene + fog (light, fades into the airy page background) ---
    const scene = new THREE.Scene();
    const isDark =
      typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    scene.fog = new THREE.FogExp2(isDark ? 0x160f0a : 0xf7efe6, 0.05);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 6;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // --- Lights (airy: bright fill + blue / cyan / lavender accents) ---
    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambient);

    const blue = new THREE.PointLight(0xad734e, 60, 60); // copper
    blue.position.set(-6, 6, 4);
    scene.add(blue);

    const cyan = new THREE.PointLight(0xd9b25a, 45, 60); // warm gold
    cyan.position.set(6, -5, 3);
    scene.add(cyan);

    const lavender = new THREE.PointLight(0xd12323, 32, 60); // cardinal
    lavender.position.set(0, -6, 4);
    scene.add(lavender);

    const spot = new THREE.SpotLight(0xffffff, 24, 40, Math.PI / 6, 0.4);
    spot.position.set(0, 8, 6);
    scene.add(spot);

    // --- Centerpiece group ---
    const group = new THREE.Group();
    scene.add(group);

    // Warm pearlescent core — glassy, catches the copper/gold/cardinal lights
    const metal = new THREE.MeshStandardMaterial({
      color: 0xfdeede,
      roughness: 0.14,
      metalness: 0.5,
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), metal);
    group.add(core);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xad734e,
      roughness: 0.25,
      metalness: 0.7,
      emissive: 0x3a1c0a,
    });
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.018, 16, 120),
      ringMat
    );
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.01, 16, 120),
      new THREE.MeshStandardMaterial({
        color: 0xd12323,
        roughness: 0.25,
        metalness: 0.7,
        emissive: 0x3a0a0a,
      })
    );
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.y = Math.PI / 6;
    group.add(ring2);

    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), metal);
    octa.position.set(2.4, 1.4, -1);
    group.add(octa);

    const tinySphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xdbd294, roughness: 0.35, metalness: 0.5 })
    );
    tinySphere.position.set(-2.6, -1.5, 0.5);
    group.add(tinySphere);

    // --- Particles ---
    const PARTICLES = prefersReduced || isMobile ? 600 : 1800;
    const positions = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < PARTICLES; i++) {
      const r = 8 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xad734e,
      size: 0.022,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Mouse parallax ---
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // --- Scroll-driven color/spin shift ---
    let scrollT = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollT = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Resize ---
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // --- Animate ---
    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    let inView = true;
    const tmpBlue = new THREE.Color();
    const tmpCyan = new THREE.Color();

    // Cap the decorative scene to ~30fps on phones to halve its GPU cost
    // (the rotation is slow enough that 30fps is indistinguishable).
    const minFrameMs = isMobile ? 1000 / 30 : 0;
    let lastRenderTs = 0;

    const animate = () => {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      if (minFrameMs) {
        const now = performance.now();
        if (now - lastRenderTs < minFrameMs) return;
        lastRenderTs = now;
      }
      const t = clock.getElapsedTime();

      group.rotation.y += prefersReduced ? 0.0008 : 0.0035;
      group.rotation.x = Math.sin(t * 0.2) * 0.15;
      group.position.y = Math.sin(t * 0.6) * 0.25;

      ring.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;
      octa.rotation.x += 0.01;
      octa.rotation.y += 0.012;
      particles.rotation.y += 0.0004;

      // gentle hue morph within the warm range as the user scrolls
      // (copper → terracotta, gold → amber) — stays warm, never harsh
      tmpBlue.setHSL(0.07 - scrollT * 0.02, 0.55, 0.5);
      tmpCyan.setHSL(0.12 - scrollT * 0.02, 0.55, 0.6);
      blue.color.copy(tmpBlue);
      cyan.color.copy(tmpCyan);

      // smooth camera parallax
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Start/stop without ever double-scheduling the RAF loop.
    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      if (running) animate();
    };

    const onVisibility = () => setRunning(inView && !document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    // Pause the whole render loop while the hero canvas is scrolled out of
    // view — no point spending GPU/CPU on an off-screen WebGL scene.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        setRunning(inView && !document.hidden);
      },
      { threshold: 0 }
    );
    io.observe(mount);

    // --- Cleanup ---
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose?.();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m?.dispose?.();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
