/**
 * Bot trap. Named plausibly enough that an autofilling script fills it, and
 * removed from every path a person can reach it by: off-screen (not
 * `display:none`, which some bots detect), `aria-hidden` for screen readers,
 * `tabIndex={-1}` for keyboard users, and autocomplete off so a browser never
 * populates it on someone's behalf.
 *
 * A filled honeypot is answered with 200, not an error — a bot that learns it
 * was caught tunes around the trap.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] top-0 size-0 overflow-hidden"
    >
      <label htmlFor="company-field">Company</label>
      <input
        id="company-field"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
