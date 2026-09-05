# techenzo

The site for [Techenzo](https://techenzo.com) — an engineering studio building AI
products in the open and publishing the measurements behind them.

Next.js (App Router) · TypeScript · Tailwind v4 · MDX · no CMS, no database.

---

## Run it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server. Draft content is visible. |
| `npm run build` | Production build. Runs the JSON-LD guard first, and validates every MDX file. |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:jsonld` | Guards the JSON-LD escape (see below) |

Copy `.env.example` to `.env.local` and fill it in to enable the newsletter and
contact forms. Without it both endpoints return `503` and the forms say so —
they never report a success that did not happen.

## Design system

`docs/ui-ux-spec.md` is the contract; `styles/tokens.css` is the executable half.
If the code and the spec disagree, the spec is wrong — fix it there first.

Colour is computed, not eyeballed. Every pair in the spec carries a measured
contrast ratio, and the chart palette is validated for colour-vision deficiency
separation. Dark is the default theme; light is a full alternate, not an
inversion.

## Content

Four collections, one loader shape. Add a `.mdx` file, `git push`, done.

```
content/
├── experiments/   # the Lab — hypothesis, method, results, limitations
├── products/      # things people use
├── projects/      # things we built
└── writing/       # articles, build logs, notes
```

Frontmatter is validated with zod at load time, not cast. `draft: true` keeps a
file on localhost — excluded from the production build, the sitemap and the RSS
feed. Set `TECHENZO_INCLUDE_DRAFTS=1` to render drafts in a preview build; they
still never reach the feed.

### Rules the build enforces

These are in the loaders rather than in a style guide, because rules written in
a document get forgotten:

- An experiment without a `## Limitations` section will not build.
- A product marked `launched` with no URL will not build.
- A project with neither a repo nor a demo will not build.
- More than one featured product will not build.
- A chart with more than six series, or a series whose value count does not
  match its categories, will not build.

Pages enter the search index on the same terms: `/lab` carries `noindex` and
stays out of the sitemap until at least one experiment is published, then both
flip on their own.

## Notes for anyone working on this

**Charts take an `id`, not data.** Chart data lives in frontmatter and
`<Chart id="…" />` looks it up. `next-mdx-remote` silently drops JSX expression
attributes — `series={[…]}` arrives as `undefined` with no error — so passing
data as props fails invisibly. Frontmatter also gets it validated.

**The JSON-LD escape is guarded by a test.** It once regressed to a no-op that
compiled, type-checked and rendered correctly while doing nothing, because
`"<"` written with one backslash *is* `<`. `npm run check:jsonld` checks
both the source form and the runtime behaviour, and runs on every build.

**The CSP uses a nonce, so every HTML route is dynamic.** That is deliberate and
documented in the spec (§13) along with the alternative that was rejected.
Content loaders are memoised in production to compensate — without that, a
65-experiment Lab spent 104ms per request re-parsing files.

## Licence

Source is MIT. Site content, brand and the Geist fonts in `assets/` keep their
own licences.
