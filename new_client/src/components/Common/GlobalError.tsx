import { AlertTriangle } from "lucide-react";

export default function GlobalError({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="mx-auto w-full max-w-2xl mt-10 p-6 rounded-[20px] bg-red-50/80 border border-red-200/80 backdrop-blur-xl shadow-sm flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-500 mb-4 shadow-sm border border-red-200/50">
                <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-[17px] font-bold tracking-tight text-red-800">Something went wrong</h3>
            <p className="text-[14px] font-medium text-red-600/80 mt-1.5 max-w-md">{message}</p>
            
            {onRetry && (
                <button 
                    onClick={onRetry} 
                    className="mt-6 px-6 py-2.5 bg-white/80 text-red-600 border border-red-200 rounded-full text-[14px] font-bold shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:border-red-300 hover:shadow-md"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
