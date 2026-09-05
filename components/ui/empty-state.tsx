import type { ReactNode } from "react";

/**
 * Launch will need this everywhere, so it is a first-class component, not an
 * afterthought. Copy states the fact and what will change it — never
 * apologises (spec §8.19, §12).
 */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-sm border border-dashed border-line-strong px-6 py-12 text-center">
      <h3 className="t-h3">{title}</h3>
      <p className="t-body-sm mx-auto mt-2 max-w-[44ch] text-ink-2">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
