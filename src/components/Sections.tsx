import { useMemo, useState } from "react";
import { SECTIONS, type Tag } from "../data";
import { IconChevron, Reveal, ScoreChip, SectionHead, TagChip } from "../lib";

type Filter = "الكل" | Tag;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "الكل", label: "الكل" },
  { key: "قوة", label: "موطن قوة" },
  { key: "جيد", label: "جيد" },
  { key: "تحفظ", label: "محل تحفظ" },
];

function DistributionBar() {
  const counts = { قوة: 0, جيد: 0, تحفظ: 0 } as Record<Tag, number>;
  SECTIONS.forEach((s) => counts[s.tag]++);
  const seg = [
    { tag: "قوة" as Tag, n: counts["قوة"], cls: "bg-moss" },
    { tag: "جيد" as Tag, n: counts["جيد"], cls: "bg-brass" },
    { tag: "تحفظ" as Tag, n: counts["تحفظ"], cls: "bg-rust" },
  ];
  return (
    <div>
      <div className="flex h-3 overflow-hidden">
        {seg.map((s) => (
          <div
            key={s.tag}
            className={`${s.cls} transition-all duration-700`}
            style={{ width: `${(s.n / SECTIONS.length) * 100}%` }}
            title={`${s.tag}: ${s.n}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-7 gap-y-2 mt-4">
        {seg.map((s) => (
          <span key={s.tag} className="flex items-center gap-2 text-sm text-fog">
            <span className={`w-3 h-3 ${s.cls}`} />
            {s.tag === "قوة" ? "موطن قوة" : s.tag === "جيد" ? "جيد" : "محل تحفظ"}
            <b className="font-mono text-ink tabular" dir="ltr">{s.n}</b>
          </span>
        ))}
        <span className="ms-auto text-sm text-fog">
          متوسط تقييم الأقسام{" "}
          <b className="font-mono text-brass-2 tabular" dir="ltr">
            {(SECTIONS.reduce((a, s) => a + s.score, 0) / SECTIONS.length).toFixed(2)}
          </b>
        </span>
      </div>
    </div>
  );
}

function Row({ s, open, onToggle }: { s: (typeof SECTIONS)[number]; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`border border-ink/10 bg-card transition-all duration-300 ${
        open ? "shadow-lift border-brass/50" : "hover:border-ink/25 hover:-translate-y-0.5"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 sm:gap-5 text-start px-4 sm:px-6 py-4 cursor-pointer"
      >
        <span className="font-mono text-sm text-fog tabular shrink-0 w-7" dir="ltr">
          {String(s.n).padStart(2, "0")}
        </span>
        <span className="flex-1 min-w-0">
          <span className="font-display font-bold text-base sm:text-lg text-ink leading-snug block">
            {s.title}
          </span>
        </span>
        <span className="hidden sm:block shrink-0">
          <TagChip tag={s.tag} />
        </span>
        <span className="shrink-0">
          <ScoreChip score={s.score} />
        </span>
        <IconChevron
          size={18}
          className={`text-fog transition-transform duration-400 shrink-0 ${open ? "rotate-180 text-brass-2" : ""}`}
        />
      </button>
      <div className={`acc-body ${open ? "open" : ""}`}>
        <div>
          <div className="px-4 sm:px-6 pb-5 pt-1 ms-10 sm:ms-12 me-12">
            <div className="sm:hidden mb-3">
              <TagChip tag={s.tag} />
            </div>
            <p className="text-sm sm:text-[15px] text-fog leading-8 border-s-2 border-brass/50 ps-4">
              {s.comment}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-ink/8 overflow-hidden max-w-xs">
                <div
                  className={`h-full transition-[width] duration-700 ${
                    s.score >= 4.2 ? "bg-moss" : s.score >= 3.5 ? "bg-brass" : "bg-rust"
                  }`}
                  style={{ width: open ? `${(s.score / 5) * 100}%` : "0%" }}
                />
              </div>
              <span className="font-mono text-[11px] text-fog tabular" dir="ltr">
                {(s.score * 20).toFixed(0)} / 100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sections() {
  const [filter, setFilter] = useState<Filter>("الكل");
  const [openId, setOpenId] = useState<number | null>(3);

  const list = useMemo(
    () => (filter === "الكل" ? SECTIONS : SECTIONS.filter((s) => s.tag === filter)),
    [filter]
  );

  return (
    <section id="sections" className="relative bg-paper pattern-grid-light scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHead
          index="03"
          eyebrow="التقييم التفصيلي"
          title="الأقسام التسعة عشر، قسماً بقسم"
          desc="كل قسم من أقسام الوثيقة نال درجة مستقلة وتعليقاً تحريرياً. افتح أي صف لقراءة الملاحظة الكاملة."
        />

        <Reveal>
          <div className="mb-8">
            <DistributionBar />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-wrap items-center gap-2 mb-6" role="tablist">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              const count =
                f.key === "الكل"
                  ? SECTIONS.length
                  : SECTIONS.filter((s) => s.tag === f.key).length;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 text-sm font-medium border transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-pine text-brass-3 border-pine shadow-lift"
                      : "bg-card text-fog border-ink/15 hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {f.label}
                  <span className={`font-mono text-xs ms-2 tabular ${active ? "text-brass-3/80" : "text-fog/60"}`} dir="ltr">
                    {count}
                  </span>
                </button>
              );
            })}
            <span className="ms-auto font-mono text-xs text-fog hidden sm:block">
              يُعرض {list.length} من {SECTIONS.length}
            </span>
          </div>
        </Reveal>

        <div className="space-y-3">
          {list.map((s, i) => (
            <Reveal key={s.n} delay={Math.min(i * 40, 240)}>
              <Row s={s} open={openId === s.n} onToggle={() => setOpenId(openId === s.n ? null : s.n)} />
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <p className="text-center text-fog py-12">لا توجد أقسام ضمن هذا التصنيف.</p>
        )}
      </div>
    </section>
  );
}
