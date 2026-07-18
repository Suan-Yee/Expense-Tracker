import { useEffect, useRef, type CSSProperties } from "react";

const spores = [
  [7, 13, 4, 18, -2, 16, -22], [18, 8, 2, 14, -7, -12, 18], [31, 17, 3, 20, -11, 14, -16],
  [47, 7, 2, 16, -5, -10, 14], [62, 14, 5, 22, -15, 18, -20], [82, 8, 3, 17, -9, -14, 20],
  [91, 23, 2, 15, -4, -16, 12], [76, 31, 4, 19, -13, 12, -18], [12, 36, 3, 21, -8, 16, 15],
  [87, 46, 5, 23, -17, -15, -22], [8, 55, 2, 16, -6, 12, -16], [68, 58, 3, 18, -12, -13, 18],
  [94, 67, 3, 20, -10, -15, -17], [21, 73, 4, 22, -14, 14, -20], [53, 78, 2, 15, -3, -10, 13],
  [79, 84, 5, 24, -19, 18, -18], [34, 91, 3, 17, -7, -14, 16], [92, 94, 2, 14, -5, -11, -14],
] as const;

export default function AuthHeroBackground() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let pointerFrame: number | undefined;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || pointerFrame !== undefined) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = undefined;
        const horizontal = event.clientX / window.innerWidth - 0.5;
        const vertical = event.clientY / window.innerHeight - 0.5;
        root.style.setProperty("--auth-parallax-x", `${horizontal * -4}px`);
        root.style.setProperty("--auth-parallax-y", `${vertical * -3}px`);
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (pointerFrame !== undefined) window.cancelAnimationFrame(pointerFrame);
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <picture className="auth-forest-art absolute inset-0 block h-full w-full">
        <source
          media="(min-width: 1024px)"
          srcSet="/images/auth-living-forest-4k-v4.jpg"
        />
        <img
          src="/images/auth-living-forest-landscape-v2.jpg"
          alt=""
          decoding="async"
          fetchPriority="high"
          className="h-full w-full max-w-none object-cover object-[58%_50%]"
        />
      </picture>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,34,25,0.20)_0%,rgba(2,34,25,0.08)_58%,rgba(1,20,15,0.10)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_34%_44%,rgba(12,80,57,0.04)_0%,rgba(2,30,23,0.08)_55%,rgba(1,18,14,0.18)_100%)]" />
      <div className="auth-forest-sheen absolute -inset-x-1/2 inset-y-0 opacity-50" />
      {spores.map(([left, top, size, duration, delay, driftX, driftY], index) => (
        <span
          key={`${left}-${top}`}
          className="auth-forest-spore absolute rounded-full bg-emerald-300 ring-1 ring-emerald-100/25"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.22 + (index % 4) * 0.08,
            "--spore-duration": `${duration}s`,
            "--spore-delay": `${delay}s`,
            "--spore-x": `${driftX}px`,
            "--spore-y": `${driftY}px`,
            "--spore-return-x": `${driftX * -0.35}px`,
            "--spore-return-y": `${driftY * 0.3}px`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
