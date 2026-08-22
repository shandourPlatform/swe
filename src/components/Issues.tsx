import { FLAGS, STRENGTHS } from "../data";
import { IconArrow, IconCheck, IconFlag, Reveal, SectionHead } from "../lib";

function SeverityChip({ s }: { s: "عالية" | "متوسطة" | "منخفضة" }) {
  const cls =
    s === "عالية"
      ? "text-[#e8a08c] border-rust/70 bg-rust/20"
      : s === "متوسطة"
      ? "text-brass-3 border-brass/50 bg-brass/10"
      : "text-paper/60 border-paper/25 bg-paper/5";
  return (
    <span className={`font-mono text-[11px] font-semibold border rounded-sm px-2 py-0.5 ${cls}`}>
      خطورة {s}
    </span>
  );
}

function FlagsBand() {
  return (
    <section id="flags" className="relative bg-pine text-paper overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 pattern-stars" aria-hidden />
      <div
        className="glow-drift absolute top-0 -end-40 w-[30rem] h-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(176,74,47,0.18), transparent 65%)" }}
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHead
          dark
          index="04"
          eyebrow="سجل التحفظات"
          title="تسعة تحفظات جوهرية قبل الاعتماد"
          desc="مرتبة برمز تتبع ورقم مرجعي. كل تحفظ مقترن بمعالجة محددة — لا يُوصى بتوقيع التعاقد قبل إغلاق التحفظات عالية الخطورة."
        />

        <div className="space-y-4">
          {FLAGS.map((f, i) => (
            <Reveal key={f.id} delay={Math.min(i * 50, 250)}>
              <article className="group grid md:grid-cols-[auto_1fr] gap-x-6 gap-y-4 border border-paper/12 bg-pine-2/70 hover:bg-pine-2 hover:border-rust/40 transition-all duration-300 p-5 sm:p-7">
                <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-2">
                  <span className="font-mono text-brass/70 text-sm" dir="ltr">{f.id}</span>
                  <IconFlag size={22} className={f.severity === "عالية" ? "text-rust" : "text-brass/80"} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display font-bold text-xl sm:text-[1.35rem] text-paper leading-snug">
                      {f.title}
                    </h3>
                    <SeverityChip s={f.severity} />
                  </div>
                  <p className="mt-2.5 text-sm text-paper/60 leading-8 max-w-3xl">{f.detail}</p>
                  <p className="mt-3 flex items-start gap-2.5 text-sm leading-7">
                    <span className="mt-1 text-brass-3 shrink-0">
                      <IconArrow size={16} />
                    </span>
                    <span>
                      <b className="text-brass-3 font-semibold">المعالجة: </b>
                      <span className="text-paper/85">{f.fix}</span>
                    </span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs text-paper/50">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rust inline-block" /> عالية: 4 تحفظات — شرط إغلاق قبل التعاقد
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brass inline-block" /> متوسطة: 4 — خلال الشهر الأول
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-paper/40 inline-block" /> منخفضة: 1 — قبل الإطلاق
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StrengthsBand() {
  return (
    <section id="strengths" className="relative bg-paper pattern-grid-light scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHead
          index="05"
          eyebrow="ميزان الإيجاب"
          title="سبع نقاط قوة تستحق التوثيق"
          desc="التحفظات لا تحجب ما في الوثيقة من نضج منهجي — هذه المزايا هي ما رفع التقييم المرجّح إلى 3.95."
        />
        <div className="columns-1 md:columns-2 gap-5 [column-fill:balance]">
          {STRENGTHS.map((st, i) => (
            <Reveal key={st.title} delay={Math.min(i * 60, 300)} className="mb-5 break-inside-avoid">
              <div
                className={`rail-top group bg-card border border-ink/10 p-6 sm:p-7 hover:-translate-y-1 hover:shadow-lift hover:border-brass/40 transition-all duration-300 ${
                  i % 3 === 0 ? "md:pb-10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 shrink-0 bg-moss/10 border border-moss/30 text-moss flex items-center justify-center group-hover:bg-moss group-hover:text-card transition-colors duration-300">
                    <IconCheck size={17} />
                  </span>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-ink leading-snug">
                    {st.title}
                  </h3>
                  <span className="ms-auto font-mono text-ink/20 text-sm tabular" dir="ltr">
                    S-{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-3.5 text-sm text-fog leading-8">{st.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Issues() {
  return (
    <>
      <FlagsBand />
      <StrengthsBand />
    </>
  );
}
