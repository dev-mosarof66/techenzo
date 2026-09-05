import type { ThemeRegistration } from "shiki";

/**
 * Syntax colours drawn from the site palette rather than a stock theme, so code
 * blocks belong to the page instead of sitting in it. Spec §8.12: keywords take
 * the accent, strings the aqua series slot, comments the muted ink.
 *
 * One theme only — code blocks stay dark in both site themes (`--bg-code`), so
 * there is no light variant to keep in sync.
 */
export const techenzoDark: ThemeRegistration = {
  name: "techenzo-dark",
  type: "dark",
  bg: "#0A0B0D",
  fg: "#F4F5F7",
  colors: {
    "editor.background": "#0A0B0D",
    "editor.foreground": "#F4F5F7",
  },
  settings: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#757C86", fontStyle: "italic" }, // 4.67:1 on #0A0B0D
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.operator.expression",
      ],
      settings: { foreground: "#FF5A33" },
    },
    {
      scope: ["string", "string.quoted", "constant.other.symbol", "meta.attribute string"],
      settings: { foreground: "#4FBFAE" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: "#F0B84E" },
    },
    {
      scope: ["entity.name.type", "support.type", "support.class", "entity.name.class"],
      settings: { foreground: "#F0B84E" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#AEB4BC" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#FF5A33" },
    },
    {
      scope: ["entity.other.attribute-name", "variable.parameter"],
      settings: { foreground: "#F0B84E" },
    },
    {
      scope: ["punctuation", "meta.brace", "keyword.operator"],
      settings: { foreground: "#838A94" },
    },
    {
      scope: ["variable", "variable.other", "meta.definition.variable"],
      settings: { foreground: "#F4F5F7" },
    },
  ],
};
