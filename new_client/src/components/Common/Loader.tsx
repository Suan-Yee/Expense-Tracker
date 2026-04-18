export default function Loader({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 w-full">
            <div className="size-10 animate-spin rounded-full border-4 border-emerald-200/60 border-t-emerald-500 shadow-sm" />
            <p className="text-[14px] font-bold tracking-tight text-emerald-700/80 animate-pulse">{text}</p>
        </div>
    );
}
