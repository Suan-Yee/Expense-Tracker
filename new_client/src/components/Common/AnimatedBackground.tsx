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

function createDots(width: number, height: number): Dot[] {
  const density = Math.round((width * height) / 13000);
  const mossCount = Math.max(90, Math.min(200, density));

  const particles: Dot[] = [];

  const mossColors = [
    "rgba(74, 114, 86",
    "rgba(93, 130, 99",
    "rgba(113, 148, 110",
    "rgba(143, 174, 146",
    "rgba(102, 122, 85",
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
      opacity: 0.1 + Math.random() * 0.3,
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
        const alpha = Math.max(0.08, Math.min(0.45, dot.opacity + shimmer));

        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fillStyle = `${dot.color}, ${alpha})`;
        context.fill();

        if (dot.baseRadius > 3.5) {
          context.beginPath();
          context.arc(dot.x, dot.y, dot.radius * 0.4, 0, Math.PI * 2);
          context.fillStyle = `rgba(75, 104, 82, ${alpha * 0.5})`;
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
      className="fixed inset-0 -z-10 bg-[#f1f7f3]"
      style={{
        background: `
          linear-gradient(168deg, #f3f8f5 0%, #e3ede6 40%, #cde1d5 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")
        `,
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply opacity-80"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -left-20 top-8 z-0 h-96 w-96 rounded-full bg-[#a3c4a8]/30 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 z-0 h-[30rem] w-[30rem] rounded-full bg-[#90b896]/30 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 bottom-1/4 z-0 h-64 w-64 rounded-full bg-[#78a581]/20 blur-[90px]" />

      {/* God rays (Sunbeams filtering through canopy) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-60">
        <div className="absolute -top-[20%] left-[0%] h-[150%] w-[35%] -rotate-[35deg] bg-gradient-to-b from-[#ffffff]/50 to-transparent blur-[110px]" />
        <div className="absolute -top-[20%] left-[30%] h-[150%] w-[25%] -rotate-[35deg] bg-gradient-to-b from-[#ffffff]/40 to-transparent blur-[90px]" />
        <div className="absolute -top-[20%] left-[60%] h-[150%] w-[40%] -rotate-[35deg] bg-gradient-to-b from-[#ffffff]/50 to-transparent blur-[120px]" />
      </div>

      {/* Canopy Vignette (Dark shadows on edges to create depth) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(40,75,50,0.18)_120%)]" />

      {/* Scrolling Mist / Fog */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 flex h-[35vh] w-[200%] animate-drift opacity-90">
        <div className="flex h-full w-1/2">
          <div className="h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom,_rgba(241,248,243,0.8)_0%,_transparent_75%)]" />
          <div className="h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom,_rgba(226,239,229,0.7)_0%,_transparent_70%)]" />
        </div>
        <div className="flex h-full w-1/2">
          <div className="h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom,_rgba(241,248,243,0.8)_0%,_transparent_75%)]" />
          <div className="h-full w-1/2 bg-[radial-gradient(ellipse_at_bottom,_rgba(226,239,229,0.7)_0%,_transparent_70%)]" />
        </div>
      </div>
    </div>
  );
}
