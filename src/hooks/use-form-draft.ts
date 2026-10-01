import { useEffect, type RefObject } from "react";
import { restoreFormDraft } from "@/lib/form-draft";

/**
 * Restores a draft saved by the language switch. `ready` flips when async options (the
 * services list) have loaded so the remembered <select> choices can be re-applied.
 */
export function useRestoreFormDraft(ref: RefObject<HTMLFormElement | null>, ready: unknown) {
  useEffect(() => {
    if (ref.current) restoreFormDraft(ref.current);
  }, [ref, ready]);
}
