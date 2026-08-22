import { useState } from "react";
import { PLAN_FIXED, PLAN_PROPOSED, ROADMAP, type Phase } from "../data";
import { Reveal, SectionHead, useInView } from "../lib";

function PhaseBar({
  phase,
  total,
  tone,
  delay,
}: {
  phase: Phase;
  total: number;
  tone: "proposed" | "fixed";
  delay: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const left = (phase.start / total) * 100;
  const width = (phase.len / total) * 100;
  const barCls =
    tone === "fixed"
      ? "bg-teal group-hover:bg-moss"
      : phase.note
      ? "bg-rust/80 group-hover:bg-rust"
      : "bg-brass/80 group-hover:bg-brass";

  return (
    <div ref={ref} className="group grid md:grid-cols-[minmax(0,16rem)_1fr] gap-x-6 gap-y-1 py-2.5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs text-fog tabular shrink-0 w-20" dir="ltr">
          {phase.weeksLabel}
        </span>
        <span className="text-sm font-medium text-ink leading-6">{phase.name}</span>
      </div>
      <div className="relative h-8 bg-ink/5">
        {/* week ticks */}
        <div className="absolute inset-0 flex" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex-1 border-s border-ink/8 last:border-e" />
          ))}
        </div>
        <div
          className={`absolute top-1 bottom-1 ${barCls} transition-all duration-700 ease-out flex items-center overflow-hidden`}
          style={{
            insetInlineStart: `${left}%`,
            width: inView ? `${width}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
          title={phase.name}
        >
          {phase.note && (
            <span className="px-2 text-[10px] font-semibold text-card whitespace-nowrap truncate">
              {phase.note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineToggle() {
  const [mode, setMode] = useState<"proposed" | "fixed">("fixed");
  const plan = mode === "proposed" ? PLAN_PROPOSED : PLAN_FIXED;

  return (
    <section id="plan" className="relative bg-card border-y border-ink/10 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHead
          index="06"
          eyebrow="الجدول الزمني"
          title="عشرة أسابيع مقترحة مقابل ستة عشر واقعية"
          desc="المنحنى العلوي يعرض خطة الوثيقة كما وردت؛ بدّل إلى الخطة المُصححة لترى كيف تختصر المسارات المتوازية المدة مع توسيع الاختبار."
        />

        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-5 mb-10">
            <div className="inline-flex border border-ink/15 bg-paper p-1" role="tablist">
              <button
                role="tab"
                aria-selected={mode === "proposed"}
                onClick={() => setMode("proposed")}
                className={`px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  mode === "proposed" ? "bg-rust text-card shadow-lift" : "text-fog hover:text-ink"
                }`}
              >
                الخطة المقترحة — 10 أسابيع
              </button>
              <button
                role="tab"
                aria-selected={mode === "fixed"}
                onClick={() => setMode("fixed")}
                className={`px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  mode === "fixed" ? "bg-teal text-card shadow-lift" : "text-fog hover:text-ink"
                }`}
              >
                الخطة المُصححة — 16 أسبوعاً
              </button>
            </div>
            <div className="font-mono text-xs text-fog flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className={`w-3 h-3 ${mode === "proposed" ? "bg-brass/80" : "bg-teal"}`} />
                مسار تنفيذي
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-rust/80" />
                مرحلة خطر
              </span>
            </div>
          </div>
        </Reveal>

        <div key={mode} className="bg-paper border border-ink/10 p-4 sm:p-7">
          <div className="divide-y divide-ink/8">
            {plan.phases.map((ph, i) => (
              <PhaseBar key={ph.name} phase={ph} total={plan.total} tone={mode} delay={i * 80} />
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {mode === "proposed" ? (
              <p className="text-sm text-fog leading-7">
                <b className="text-rust font-semibold">قراءة اللجنة: </b>
                ثلاثة أسابيع لقاعدة البيانات ولوحة التحكم معاً بمطور واحد، وأسبوع اختبار وحيد —
                احتمالية الانزلاق تتجاوز 60% وفق معايير صناعة البرمجيات.
              </p>
            ) : (
              <p className="text-sm text-fog leading-7">
                <b className="text-teal font-semibold">قراءة اللجنة: </b>
                تداخل لوحتي التحكم والواجهة مع بدء المحتوى من الأسبوع التاسع يختصر ثلاثة أسابيع
                فعلية ويرفع الاختبار إلى أربعة أسابيع بثلاثة أنواع فحص.
              </p>
            )}
            <span
              className={`font-mono text-sm font-semibold border px-4 py-2 shrink-0 ${
                mode === "proposed"
                  ? "border-rust/40 text-rust bg-rust/8"
                  : "border-teal/40 text-teal bg-teal/8"
              }`}
              dir="ltr"
            >
              {mode === "proposed" ? "10 weeks · serial" : "16 weeks · parallel"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section id="roadmap" className="relative bg-paper pattern-grid-light scroll-mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHead
          index="07"
          eyebrow="خارطة الطريق التصحيحية"
          title="أحد عشر إجراءً بثلاثة أفق زمنية"
          desc="لكل إجراء تقدير أثر وجهد — تبدأ اللجنة بالإجراءات الفورية منخفضة الجهد عالية الأثر لكسب الزخم."
        />

        <div className="relative ms-3 sm:ms-5 border-s-2 border-brass/40">
          {ROADMAP.map((h, hi) => (
            <div key={h.horizon} className="relative pb-12 last:pb-0">
              <span
                className="absolute -start-[13px] top-1 w-6 h-6 bg-pine border-2 border-brass flex items-center justify-center"
                aria-hidden
              >
                <span className="w-1.5 h-1.5 bg-brass-3" />
              </span>
              <Reveal delay={hi * 80}>
                <div className="ps-8 sm:ps-12">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-display font-bold text-2xl text-ink">{h.horizon}</h3>
                    <span className="font-mono text-xs text-brass-2 border border-brass/40 bg-brass/8 px-2.5 py-1">
                      {h.period}
                    </span>
                  </div>
                  <div className="mt-5 grid sm:grid-cols-2 gap-4">
                    {h.items.map((item, ii) => (
                      <Reveal key={item.title} delay={ii * 70}>
                        <div className="group h-full bg-card border border-ink/10 p-5 hover:border-brass/50 hover:-translate-y-1 hover:shadow-lift transition-all duration-300">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-semibold text-ink leading-7">{item.title}</h4>
                          </div>
                          <p className="mt-1.5 text-[13px] text-fog leading-7">{item.detail}</p>
                          <div className="mt-4 flex items-center gap-2">
                            <span
                              className={`text-[11px] font-mono border px-2 py-0.5 ${
                                item.impact === "عالٍ"
                                  ? "border-moss/40 text-moss bg-moss/8"
                                  : "border-fog/40 text-fog bg-fog/5"
                              }`}
                            >
                              أثر {item.impact}
                            </span>
                            <span className="text-[11px] font-mono border border-ink/15 text-fog px-2 py-0.5">
                              جهد {item.effort}
                            </span>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Plan() {
  return (
    <>
      <TimelineToggle />
      <Roadmap />
    </>
  );
}
