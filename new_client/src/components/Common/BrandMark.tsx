type BrandMarkProps = {
  className?: string;
};

/**
 * Moss Ledger — an original mark combining a continuous cash-flow path with
 * organic topographic contours. The source geometry is preserved as artwork.
 */
export default function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[28%] bg-[#f7fbf9] shadow-sm ring-2 ring-emerald-300 dark:bg-emerald-50 dark:ring-emerald-300/80 ${className}`}
      aria-hidden="true"
    >
      <img
        src="/brand/expense-tracker-mark-centered-v3.png"
        alt=""
        className="pointer-events-none size-[88%] max-w-none select-none object-contain"
        draggable={false}
      />
    </span>
  );
}
