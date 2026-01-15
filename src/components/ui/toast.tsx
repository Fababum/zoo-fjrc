import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "info" | "error" | "success";

type ToastMessage = {
  id: number;
  message: string;
  variant: ToastVariant;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = idRef.current + 1;
    idRef.current = id;

    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3600);
  }, []);

  return { toasts, pushToast, dismissToast };
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  if (!toasts.length) return null;

  return (
    <div className="fixed inset-x-4 bottom-6 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:w-[360px]">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => onDismiss(toast.id)}
          className={cn(
            "group w-full rounded-lg border px-4 py-3 text-left text-sm shadow-lg backdrop-blur",
            "bg-background/95 text-foreground hover:shadow-xl transition-shadow",
            toast.variant === "error" &&
              "border-rose-500/40 bg-rose-50/80 text-rose-700",
            toast.variant === "success" &&
              "border-emerald-500/40 bg-emerald-50/80 text-emerald-700"
          )}
          aria-live="polite"
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
