import { readFileSync } from "node:fs";

/**
 * Guards the JSON-LD escape in components/seo/json-ld.tsx.
 *
 * This exists because the escape was once written with a single backslash. It
 * compiled, it type-checked, it rendered, and it did nothing — `"<"` in
 * source is literally `<`, so the replacement swapped `<` for `<` and the
 * injection hole was wide open with no visible symptom.
 *
 * Run with: node scripts/check-jsonld-escape.mjs
 */
const source = readFileSync("components/seo/json-ld.tsx", "utf8");

const failures = [];

// 1. The source must contain a doubled backslash before u003c.
if (!source.includes(String.raw`replace(/</g, "\\u003c")`)) {
  failures.push(
    'json-ld.tsx: escape is not the doubled-backslash form. A single backslash ' +
      'compiles to a literal "<" and makes the replacement a no-op.',
  );
}

// 2. Behavioural check on the same expression the component uses.
const escape = (data) => JSON.stringify(data).replace(/</g, "\\u003c");
const hostile = { name: "</script><img src=x onerror=alert(1)>" };
const output = escape(hostile);

if (output.includes("</script")) {
  failures.push(`json-ld.tsx: escaped output can still close a script tag: ${output}`);
}
if (output.includes("<")) {
  failures.push(`json-ld.tsx: escaped output still contains a raw "<": ${output}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL  ${failure}`);
  process.exit(1);
}

console.log("PASS  JSON-LD escape is intact");
console.log(`      hostile input -> ${output}`);
