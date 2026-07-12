import { useEffect, useRef } from "react";

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
  phaseX: number;
  phaseY: number;
  speed: number;
  driftX: number;
  driftY: number;
  color: string;
};

function createDots(width: number, height: number, isDark: boolean): Dot[] {
  const density = Math.round((width * height) / 22000);
  const mossCount = Math.max(70, Math.min(170, density));

  const particles: Dot[] = [];

  const mossColors = isDark
    ? [
        "rgba(52, 211, 153",
        "rgba(16, 185, 129",
        "rgba(110, 231, 183",
        "rgba(94, 234, 212",
        "rgba(134, 239, 172",
      ]
    : [
        "rgba(16, 185, 129",
        "rgba(5, 150, 105",
        "rgba(20, 184, 166",
        "rgba(34, 197, 94",
        "rgba(15, 118, 110",
      ];

  for (let i = 0; i < mossCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const color = mossColors[Math.floor(Math.random() * mossColors.length)];
    const baseRadius = 1.8 + Math.random() * 3.5;

    particles.push({
      baseX: x,
      baseY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: baseRadius,
      baseRadius,
      opacity: isDark ? 0.20 + Math.random() * 0.35 : 0.22 + Math.random() * 0.38,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
      driftX: 3 + Math.random() * 15,
      driftY: 3 + Math.random() * 12,
      color,
    });
  }

  return particles;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);
  const viewportRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const darkThemeRef = useRef(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      viewportRef.current = { width, height };
      dotsRef.current = createDots(width, height, document.documentElement.classList.contains("dark"));
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
        isActive: true,
      };
    };

    const onPointerLeave = () => {
      mouseRef.current.isActive = false;
    };

    const animate = (time: number) => {
      const { width, height } = viewportRef.current;
      const dots = dotsRef.current;
      const mouse = mouseRef.current;

      context.clearRect(0, 0, width, height);

      const influenceRadius = Math.max(120, Math.min(width * 0.24, 230));
      const basePush = 40;
      const spring = 0.125;
      const damping = 0.82;

      // Update and Draw particles
      for (const dot of dots) {
        // Blooming Moss Logic
        const breath = 1 + 0.35 * Math.sin(time * 0.0015 + dot.phaseX);
        dot.radius = dot.baseRadius * breath;

        // Moss Position Updates
        const waveX = Math.sin(time * 0.00055 * dot.speed + dot.phaseX) * dot.driftX;
        const waveY = Math.cos(time * 0.00065 * dot.speed + dot.phaseY) * dot.driftY;

        let targetX = dot.baseX + waveX;
        let targetY = dot.baseY + waveY;

        if (mouse.isActive) {
          const dx = targetX - mouse.x;
          const dy = targetY - mouse.y;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < influenceRadius) {
            const strength = 1 - distance / influenceRadius;
            const repel = basePush * strength * strength + dot.radius * 2.2;
            targetX += (dx / distance) * repel;
            targetY += (dy / distance) * repel;
          }
        }

        dot.vx = (dot.vx + (targetX - dot.x) * spring) * damping;
        dot.vy = (dot.vy + (targetY - dot.y) * spring) * damping;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Draw Moss
        const shimmer = 0.08 * Math.sin(time * 0.001 + dot.phaseY);
        const alpha = Math.max(0.12, Math.min(0.60, dot.opacity + shimmer));

        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fillStyle = `${dot.color}, ${alpha})`;
        context.fill();

        if (dot.baseRadius > 3.5) {
          const isDark = document.documentElement.classList.contains("dark");
          context.beginPath();
          context.arc(dot.x, dot.y, dot.radius * 0.4, 0, Math.PI * 2);
          context.fillStyle = isDark ? `rgba(75, 104, 82, ${alpha * 0.5})` : `rgba(16, 185, 129, ${alpha * 0.6})`;
          context.fill();
        }
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    frameRef.current = window.requestAnimationFrame(animate);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    const themeObserver = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark === darkThemeRef.current) return;
      darkThemeRef.current = isDark;
      const { width, height } = viewportRef.current;
      dotsRef.current = createDots(width, height, isDark);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();

      if (frameRef.current !== undefined) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 bg-[#eef5f1]"
      style={{ background: "var(--app-background)" }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-90 transition-opacity duration-500 dark:mix-blend-screen dark:opacity-75"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px bg-white/80 dark:bg-emerald-300/10" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,_rgba(15,23,42,0.04)_1px,_transparent_1px),linear-gradient(180deg,_rgba(15,23,42,0.04)_1px,_transparent_1px)] bg-[size:56px_56px] opacity-25 dark:bg-[linear-gradient(90deg,_rgba(148,163,184,0.08)_1px,_transparent_1px),linear-gradient(180deg,_rgba(148,163,184,0.08)_1px,_transparent_1px)] dark:opacity-20" />
    </div>
  );
}
