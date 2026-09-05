import { OG_SIZE, renderBrandCard } from "@/lib/og";
import { getExperiment, getExperiments } from "@/lib/content";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Techenzo experiment";

export async function generateStaticParams() {
  const experiments = await getExperiments();
  return experiments.map((experiment) => ({ slug: experiment.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experiment = await getExperiment(slug);

  return renderBrandCard({
    kicker: experiment ? `Techenzo · ${experiment.id}` : "Techenzo · Lab",
    title: experiment?.title ?? "The Lab",
    description: experiment?.description ?? "Experiments in AI engineering.",
  });
}
