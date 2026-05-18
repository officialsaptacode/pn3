import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

const DEBOUNCE_MS = 1000;

export function useFormPersist(
  storageKey: string,
  form: UseFormReturn<any>,
  options?: {
    exclude?: string[];
    skipRestore?: boolean;
    ttlMs?: number;
    sidecar?: Record<string, any>;
    onRestoreSidecar?: (values: Record<string, any>) => void;
  },
) {
  const {
    exclude = [],
    skipRestore = false,
    ttlMs = 24 * 60 * 60 * 1000,
    sidecar,
    onRestoreSidecar,
  } = options ?? {};

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidecarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidecarKey = `${storageKey}__sidecar`;

  // RESTORE on mount — skipped for edit mode (skipRestore: true)
  useEffect(() => {
    if (skipRestore) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const { values, savedAt } = JSON.parse(raw);
      if (Date.now() - savedAt > ttlMs) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(sidecarKey);
        return;
      }
      form.reset(values, { keepDefaultValues: false });

      // Restore sidecar (media objects)
      const rawSidecar = localStorage.getItem(sidecarKey);
      if (rawSidecar && onRestoreSidecar) {
        onRestoreSidecar(JSON.parse(rawSidecar));
      }
    } catch {
      // corrupt storage — ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset, onRestoreSidecar, sidecarKey, skipRestore, storageKey, ttlMs]);

  // SAVE form values on every change, debounced
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        try {
          const toSave = { ...values };
          exclude.forEach((key) => {
            delete toSave[key];
          });
          localStorage.setItem(storageKey, JSON.stringify({ values: toSave, savedAt: Date.now() }));
        } catch {
          // quota exceeded — ignore
        }
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, storageKey, exclude]);

  // SAVE sidecar (media objects) debounced whenever it changes.
  // JSON.stringify gives a stable primitive so the effect doesn't
  // fire on every render from object reference changes.
  const sidecarJson = JSON.stringify(sidecar ?? null);
  useEffect(() => {
    if (!sidecar) return;
    if (sidecarTimerRef.current) clearTimeout(sidecarTimerRef.current);
    sidecarTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(sidecarKey, sidecarJson);
      } catch {
        // quota exceeded — ignore
      }
    }, DEBOUNCE_MS);
    return () => {
      if (sidecarTimerRef.current) clearTimeout(sidecarTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidecarJson, sidecarKey, sidecar]);

  const clearDraft = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(sidecarKey);
  };

  return { clearDraft };
}
