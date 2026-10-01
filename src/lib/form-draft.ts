/**
 * Carries a half-filled contact form across the EN <-> AR language switch (the two
 * languages are separate routes, so the form remounts and would otherwise start empty).
 * Stored in sessionStorage, consumed once on the next mount, never on refresh/other pages.
 */
const KEY = "wijhan:form-draft";

type Draft = Record<string, string>;

export function saveFormDraft(): void {
  try {
    const form = document.querySelector<HTMLFormElement>("main form[aria-label]");
    if (!form) return;
    const draft: Draft = {};
    form
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input[name], textarea[name], select[name]",
      )
      .forEach((el) => {
        if (el.name === "website") return; // honeypot
        if (el instanceof HTMLInputElement && el.type === "hidden") return;
        if (el instanceof HTMLInputElement && el.type === "radio") {
          if (el.checked) draft[`radio:${el.name}`] = String(radioIndex(form, el));
          return;
        }
        if (el instanceof HTMLSelectElement) {
          // Option labels differ per language, so remember the position, not the text.
          if (el.selectedIndex > 0) draft[`select:${el.name}`] = String(el.selectedIndex);
          return;
        }
        if (el.value) draft[el.name] = el.value;
      });
    if (Object.keys(draft).length > 0) sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage unavailable (private mode): the form simply starts empty.
  }
}

function radioIndex(form: HTMLFormElement, el: HTMLInputElement): number {
  return [
    ...form.querySelectorAll<HTMLInputElement>(`input[type=radio][name="${el.name}"]`),
  ].indexOf(el);
}

function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
  Object.getOwnPropertyDescriptor(proto.prototype, "value")?.set?.call(el, value);
}

/** Restores (and clears) a saved draft. Returns true while select options may still be loading. */
export function restoreFormDraft(form: HTMLFormElement): boolean {
  let draft: Draft | null = null;
  try {
    const raw = sessionStorage.getItem(KEY);
    draft = raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return false;
  }
  if (!draft) return false;
  let pending = false;
  for (const [key, value] of Object.entries(draft)) {
    if (key.startsWith("select:")) {
      const el = form.querySelector<HTMLSelectElement>(`select[name="${key.slice(7)}"]`);
      const index = Number(value);
      if (el && el.options.length > index) el.selectedIndex = index;
      else pending = true; // service list not loaded yet
    } else if (key.startsWith("radio:")) {
      const radios = form.querySelectorAll<HTMLInputElement>(
        `input[type=radio][name="${key.slice(6)}"]`,
      );
      const radio = radios[Number(value)];
      if (radio) radio.checked = true;
    } else {
      const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${key}"]`);
      if (el) setNativeValue(el, value);
    }
  }
  if (!pending) {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
  return pending;
}
