import { useEffect, useRef } from "react";

type Dot = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  phaseX: number;
  phaseY: number;
  speed: number;
  driftX: number;
  driftY: number;
};

function createDots(width: number, height: number): Dot[] {
  const density = Math.round((width * height) / 13000);
  const count = Math.max(70, Math.min(165, density));

  return Array.from({ length: count }, () => {
    const x = Math.random() * width;
    const y = Math.random() * height;

    return {
      baseX: x,
      baseY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 1.3 + Math.random() * 2.7,
      opacity: 0.11 + Math.random() * 0.28,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      speed: 0.7 + Math.random() * 1.35,
      driftX: 5 + Math.random() * 20,
      driftY: 5 + Math.random() * 16,
    };
  });
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);
  const viewportRef = useRef({ width: 0, height: 0 });
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

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
      dotsRef.current = createDots(width, height);
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

      for (const dot of dots) {
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

        const shimmer = 0.06 * Math.sin(time * 0.0012 + dot.phaseY);
        const alpha = Math.max(0.08, Math.min(0.48, dot.opacity + shimmer));

        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(27, 148, 108, ${alpha})`;
        context.fill();
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    frameRef.current = window.requestAnimationFrame(animate);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);

      if (frameRef.current !== undefined) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 bg-white"
      style={{
        background: "linear-gradient(168deg, #f8fff8 0%, #e8f7f0 38%, #d8efe4 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-20 top-8 z-0 h-72 w-72 rounded-full bg-emerald-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 z-0 h-80 w-80 rounded-full bg-emerald-100/80 blur-3xl" />
    </div>
  );
}
