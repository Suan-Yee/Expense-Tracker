import { useEffect, useRef } from "react";

type RGB = readonly [number, number, number];
type ParticleDepth = "spore" | "moss" | "bloom";

type Dot = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  targetOpacity: number;
  opacitySeed: number;
  phaseX: number;
  phaseY: number;
  speed: number;
  driftX: number;
  driftY: number;
  depth: ParticleDepth;
  colorIndex: number;
  red: number;
  green: number;
  blue: number;
  targetRed: number;
  targetGreen: number;
  targetBlue: number;
  visibility: number;
};

type MouseState = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  lastMove: number;
  isActive: boolean;
};

type ShieldRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type AmbientBurst = {
  x: number;
  y: number;
  startedAt: number;
  phase: number;
};

const LIGHT_PALETTE: readonly RGB[] = [
  [16, 185, 129],
  [5, 150, 105],
  [20, 184, 166],
  [34, 197, 94],
  [15, 118, 110],
];

const DARK_PALETTE: readonly RGB[] = [
  [52, 211, 153],
  [16, 185, 129],
  [110, 231, 183],
  [94, 234, 212],
  [134, 239, 172],
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function opacityFor(depth: ParticleDepth, isDark: boolean, seed: number) {
  if (depth === "spore") return isDark ? 0.09 + seed * 0.16 : 0.1 + seed * 0.18;
  if (depth === "bloom") return isDark ? 0.2 + seed * 0.2 : 0.24 + seed * 0.24;
  return isDark ? 0.16 + seed * 0.22 : 0.2 + seed * 0.26;
}

function createDots(width: number, height: number, isDark: boolean): Dot[] {
  const density = Math.round((width * height) / 22000);
  const mossCount = Math.max(70, Math.min(170, density));
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const clusterCount = Math.max(3, Math.min(7, Math.round(width / 340)));
  const clusterRadius = Math.min(width, height);
  const clusters = Array.from({ length: clusterCount }, () => ({
    x: width * (0.08 + Math.random() * 0.84),
    y: height * (0.08 + Math.random() * 0.84),
  }));

  return Array.from({ length: mossCount }, () => {
    const depthRoll = Math.random();
    const depth: ParticleDepth = depthRoll < 0.42 ? "spore" : depthRoll < 0.9 ? "moss" : "bloom";
    let x = Math.random() * width;
    let y = Math.random() * height;

    // A minority of particles grow in loose patches. The rest remain freely
    // distributed, preserving the original full-screen moss field.
    if (Math.random() < 0.27) {
      const cluster = clusters[Math.floor(Math.random() * clusters.length)]!;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.pow(Math.random(), 1.7) * clusterRadius * (0.055 + Math.random() * 0.08);
      x = clamp(cluster.x + Math.cos(angle) * distance, 0, width);
      y = clamp(cluster.y + Math.sin(angle) * distance, 0, height);
    }

    const colorIndex = Math.floor(Math.random() * palette.length);
    const [red, green, blue] = palette[colorIndex]!;
    const opacitySeed = Math.random();
    const opacity = opacityFor(depth, isDark, opacitySeed);

    const baseRadius = depth === "spore"
      ? 0.7 + Math.random() * 1.15
      : depth === "bloom"
        ? 3.5 + Math.random() * 2.6
        : 1.65 + Math.random() * 2.35;

    const speed = depth === "spore"
      ? 0.18 + Math.random() * 0.3
      : depth === "bloom"
        ? 0.22 + Math.random() * 0.4
        : 0.35 + Math.random() * 0.58;

    const driftMultiplier = depth === "spore" ? 0.55 : depth === "bloom" ? 0.72 : 1;

    return {
      baseX: x,
      baseY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: baseRadius,
      baseRadius,
      opacity,
      targetOpacity: opacity,
      opacitySeed,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      speed,
      driftX: (4 + Math.random() * 14) * driftMultiplier,
      driftY: (3 + Math.random() * 11) * driftMultiplier,
      depth,
      colorIndex,
      red,
      green,
      blue,
      targetRed: red,
      targetGreen: green,
      targetBlue: blue,
      visibility: 1,
    };
  });
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);
  const viewportRef = useRef({ width: 0, height: 0 });
  const shieldRectsRef = useRef<ShieldRect[]>([]);
  const burstsRef = useRef<AmbientBurst[]>([]);
  const mouseRef = useRef<MouseState>({
    x: -1000,
    y: -1000,
    velocityX: 0,
    velocityY: 0,
    lastMove: 0,
    isActive: false,
  });
  const darkThemeRef = useRef(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let shieldUpdateFrame: number | undefined;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      viewportRef.current = { width, height };
      dotsRef.current = createDots(width, height, darkThemeRef.current);
    };

    const refreshShieldRects = () => {
      shieldUpdateFrame = undefined;
      const elements = document.querySelectorAll<HTMLElement>('[data-particle-shield="true"], .app-surface');
      shieldRectsRef.current = Array.from(elements)
        .slice(0, 48)
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 80 && rect.height > 48 && rect.bottom > 0 && rect.top < window.innerHeight)
        .map((rect) => ({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }));
    };

    const scheduleShieldRefresh = () => {
      if (shieldUpdateFrame !== undefined) return;
      shieldUpdateFrame = window.requestAnimationFrame(refreshShieldRects);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const now = performance.now();
      const mouse = mouseRef.current;
      const elapsed = mouse.lastMove > 0 ? Math.max(8, now - mouse.lastMove) : 16.67;
      const frameScale = 16.67 / elapsed;
      const nextVelocityX = clamp((event.clientX - mouse.x) * frameScale, -28, 28);
      const nextVelocityY = clamp((event.clientY - mouse.y) * frameScale, -28, 28);

      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        velocityX: mouse.lastMove > 0 ? mouse.velocityX * 0.42 + nextVelocityX * 0.58 : 0,
        velocityY: mouse.lastMove > 0 ? mouse.velocityY * 0.42 + nextVelocityY * 0.58 : 0,
        lastMove: now,
        isActive: true,
      };
    };

    const onPointerLeave = () => {
      mouseRef.current.isActive = false;
    };

    const targetVisibility = (dot: Dot) => {
      for (const rect of shieldRectsRef.current) {
        if (dot.x >= rect.left && dot.x <= rect.right && dot.y >= rect.top && dot.y <= rect.bottom) {
          return dot.depth === "spore" ? 0.08 : 0.16;
        }
      }
      return 1;
    };

    const drawBursts = (time: number) => {
      if (reducedMotionQuery.matches) {
        burstsRef.current = [];
        return;
      }

      const palette = darkThemeRef.current ? DARK_PALETTE : LIGHT_PALETTE;
      burstsRef.current = burstsRef.current.filter((burst) => time - burst.startedAt < 1550);

      for (const burst of burstsRef.current) {
        const progress = clamp((time - burst.startedAt) / 1550, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const fade = Math.sin(progress * Math.PI);
        const [red, green, blue] = palette[Math.floor(burst.phase) % palette.length]!;

        context.beginPath();
        context.arc(burst.x, burst.y, 12 + eased * 54, 0, Math.PI * 2);
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${fade * 0.16})`;
        context.lineWidth = 1;
        context.stroke();

        for (let index = 0; index < 14; index++) {
          const angle = burst.phase + (index / 14) * Math.PI * 2;
          const distance = 8 + eased * (38 + (index % 4) * 7);
          const x = burst.x + Math.cos(angle) * distance;
          const y = burst.y + Math.sin(angle) * distance;
          const radius = 0.65 + (1 - progress) * (index % 3 === 0 ? 1.35 : 0.7);

          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${fade * 0.44})`;
          context.fill();
        }
      }
    };

    const renderFrame = (time: number) => {
      const { width, height } = viewportRef.current;
      const mouse = mouseRef.current;
      const reducedMotion = reducedMotionQuery.matches;
      const animationTime = reducedMotion ? time * 0.55 : time;
      const pointerAge = Math.max(0, time - mouse.lastMove);
      const movingInfluence = mouse.isActive ? clamp(1 - pointerAge / 900, 0, 1) : 0;
      const restingInfluence = mouse.isActive ? (reducedMotion ? 0.34 : 0.52) : 0;
      const pointerInfluence = Math.max(restingInfluence, movingInfluence * (reducedMotion ? 0.62 : 1));
      const influenceRadius = Math.max(120, Math.min(width * 0.24, 230));

      context.clearRect(0, 0, width, height);

      for (const dot of dotsRef.current) {
        dot.red += (dot.targetRed - dot.red) * 0.045;
        dot.green += (dot.targetGreen - dot.green) * 0.045;
        dot.blue += (dot.targetBlue - dot.blue) * 0.045;
        dot.opacity += (dot.targetOpacity - dot.opacity) * 0.045;
        dot.visibility += (targetVisibility(dot) - dot.visibility) * 0.075;

        const breathAmount = dot.depth === "spore" ? 0.08 : dot.depth === "bloom" ? 0.34 : 0.23;
        const breath = 1 + breathAmount * Math.sin(animationTime * 0.00135 + dot.phaseX);
        dot.radius = dot.baseRadius * breath;

        const waveX = Math.sin(animationTime * 0.00048 * dot.speed + dot.phaseX) * dot.driftX;
        const waveY = Math.cos(animationTime * 0.00058 * dot.speed + dot.phaseY) * dot.driftY;
        let targetX = dot.baseX + waveX;
        let targetY = dot.baseY + waveY;

        if (pointerInfluence > 0) {
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < influenceRadius) {
            const proximity = 1 - distance / influenceRadius;
            const depthForce = dot.depth === "spore" ? 0.45 : dot.depth === "bloom" ? 1.14 : 0.88;
            const repel = (38 * proximity * proximity + dot.radius * 2.1) * depthForce * pointerInfluence;
            const wakeStrength = reducedMotion ? 0.55 : 1;
            targetX += (dx / distance) * repel + mouse.velocityX * proximity * 0.16 * depthForce * wakeStrength;
            targetY += (dy / distance) * repel + mouse.velocityY * proximity * 0.16 * depthForce * wakeStrength;
          }
        }

        const spring = dot.depth === "spore" ? 0.038 : dot.depth === "bloom" ? 0.06 : 0.086;
        const damping = dot.depth === "spore" ? 0.9 : dot.depth === "bloom" ? 0.87 : 0.84;
        dot.vx = (dot.vx + (targetX - dot.x) * spring) * damping;
        dot.vy = (dot.vy + (targetY - dot.y) * spring) * damping;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const shimmerAmount = dot.depth === "spore" ? 0.025 : dot.depth === "bloom" ? 0.075 : 0.055;
        const shimmer = shimmerAmount * Math.sin(animationTime * 0.001 + dot.phaseY);
        const alpha = Math.max(0.035, dot.opacity + shimmer) * dot.visibility;
        const red = Math.round(dot.red);
        const green = Math.round(dot.green);
        const blue = Math.round(dot.blue);

        if (dot.depth === "bloom") {
          context.beginPath();
          context.arc(dot.x, dot.y, dot.radius * 1.58, 0, Math.PI * 2);
          context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha * 0.2})`;
          context.lineWidth = 0.8;
          context.stroke();
        }

        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.fill();

        if (dot.depth !== "spore" && dot.baseRadius > 3.45) {
          context.beginPath();
          context.arc(dot.x, dot.y, dot.radius * 0.38, 0, Math.PI * 2);
          context.fillStyle = darkThemeRef.current
            ? `rgba(184, 255, 218, ${alpha * 0.34})`
            : `rgba(6, 120, 81, ${alpha * 0.4})`;
          context.fill();
        }
      }

      mouse.velocityX *= 0.92;
      mouse.velocityY *= 0.92;
      drawBursts(time);
    };

    const animate = (time: number) => {
      frameRef.current = undefined;
      renderFrame(time);

      if (!document.hidden) {
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      if (frameRef.current === undefined && !document.hidden) {
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const updateThemeTargets = (isDark: boolean, snap: boolean) => {
      const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
      darkThemeRef.current = isDark;

      for (const dot of dotsRef.current) {
        const [red, green, blue] = palette[dot.colorIndex % palette.length]!;
        dot.targetRed = red;
        dot.targetGreen = green;
        dot.targetBlue = blue;
        dot.targetOpacity = opacityFor(dot.depth, isDark, dot.opacitySeed);

        if (snap) {
          dot.red = red;
          dot.green = green;
          dot.blue = blue;
          dot.opacity = dot.targetOpacity;
        }
      }
    };

    const onResize = () => {
      resizeCanvas();
      scheduleShieldRefresh();
    };

    const onMotionPreferenceChange = () => {
      if (reducedMotionQuery.matches) {
        burstsRef.current = [];
      }
      startAnimation();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frameRef.current !== undefined) window.cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      } else {
        startAnimation();
      }
    };

    const onAmbientBloom = (event: Event) => {
      if (reducedMotionQuery.matches) return;
      const detail = (event as CustomEvent<{ x?: number; y?: number }>).detail;
      const { width, height } = viewportRef.current;
      burstsRef.current.push({
        x: detail?.x ?? width * (0.18 + Math.random() * 0.64),
        y: detail?.y ?? height * (0.16 + Math.random() * 0.62),
        startedAt: performance.now(),
        phase: Math.random() * Math.PI * 2,
      });
      burstsRef.current = burstsRef.current.slice(-3);
      startAnimation();
    };

    resizeCanvas();
    refreshShieldRects();
    startAnimation();

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", scheduleShieldRefresh, { passive: true });
    window.addEventListener("expense-tracker:ambient-bloom", onAmbientBloom);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", onMotionPreferenceChange);

    const themeObserver = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark === darkThemeRef.current) return;
      updateThemeTargets(isDark, false);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const layoutObserver = new MutationObserver(scheduleShieldRefresh);
    layoutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", scheduleShieldRefresh);
      window.removeEventListener("expense-tracker:ambient-bloom", onAmbientBloom);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onMotionPreferenceChange);
      themeObserver.disconnect();
      layoutObserver.disconnect();

      if (frameRef.current !== undefined) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
      if (shieldUpdateFrame !== undefined) {
        window.cancelAnimationFrame(shieldUpdateFrame);
        shieldUpdateFrame = undefined;
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 bg-[#eef5f1]"
      style={{ background: "var(--app-background)" }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-90 transition-opacity duration-500 dark:mix-blend-screen dark:opacity-75"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-white/80 dark:bg-emerald-300/10" />
      <div className="moss-premium-grid pointer-events-none absolute inset-0 z-0" />
    </div>
  );
}
