import { HONEYPOT_FIELD } from "@/lib/form-guards";

/**
 * Invisible anti-spam trap. Bots that auto-fill every input populate it; the
 * form hooks then drop the submission. It is aria-hidden, unfocusable and
 * excluded from autofill, so keyboard and screen-reader users never meet it.
 */
export function HoneypotField() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
