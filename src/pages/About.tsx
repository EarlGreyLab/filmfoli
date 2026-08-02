import { PhotoGrid } from "../components/PhotoGrid";
import { FilmMetadataTag } from "../components/FilmMetadataTag";
import { RebateStrip } from "../components/RebateStrip";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";

const gear = [
  { label: "Daily carry", value: "Olympus mju-II" },
  { label: "Street", value: "Ricoh GR1s" },
  { label: "Backup", value: "Konica Big Mini" },
  { label: "Color, sun", value: "Kodak Gold 200" },
  { label: "Color, always", value: "Kodak Portra 400" },
  { label: "Black & white", value: "Kodak Tri-X 400" },
  { label: "Night", value: "CineStill 800T" },
  { label: "Lab", value: "Local dip & dunk, Lisbon" },
];

export function About() {
  return (
    <div className="page-enter mx-auto max-w-6xl px-5 pb-8 pt-14 sm:px-8">
      <Seo title="About" description="Who I am, what I carry, and why point-and-shoots." />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <header className="md:col-span-7">
          <h1 className="font-display text-5xl sm:text-6xl">
            Small cameras, <span className="italic text-mask">slow pictures.</span>
          </h1>
          <div className="mt-8 max-w-prose space-y-5 leading-relaxed">
            <p>
              I'm Yun — based near Lisbon, usually somewhere between a trailhead
              and a harbor. I came to film the usual way: a thrifted
              point-and-shoot, one test roll, and the two-week wait that made
              every frame feel earned.
            </p>
            <p>
              I shoot point-and-shoots on purpose. No aperture ring to fiddle
              with means the only decisions left are the ones that matter —
              where to stand, when to press. The camera disappears; the trip
              stays.
            </p>
            <p>
              Everything here is scanned from negatives and left alone.
              Grain, dust, light leaks — if the film kept it, so do I.
            </p>
          </div>
        </header>

        <aside className="md:col-span-5 md:pt-4">
          <Reveal>
            <RebateStrip label="The kit" frame="2026" />
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
              {gear.map((g) => (
                <FilmMetadataTag key={g.label} label={g.label} value={g.value} />
              ))}
            </div>
          </Reveal>
        </aside>
      </div>

      <section className="mt-24">
        <Reveal>
          <div className="border-t border-line pt-6">
            <h2 className="font-display text-3xl">Proof it occasionally works</h2>
          </div>
        </Reveal>
        <PhotoGrid ids={["p07", "p12", "p10"]} className="mt-10" />
      </section>
    </div>
  );
}
