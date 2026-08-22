import { useEffect, useState } from "react";
import { MARQUEE_ITEMS, OUR_SCORE, SELF_SCORE } from "../data";
import { Reveal, Stamp, useCountUp, useInView, IconStar8 } from "../lib";

function ScoreRing() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const value = useCountUp(OUR_SCORE, inView, 2, 1700);
  const R = 86;
  const C = 2 * Math.PI * R;
  const pct = inView ? OUR_SCORE / 5 : 0;

  return (
    <div ref={ref} className="relative w-52 h-52 sm:w-64 sm:h-64 shrink-0" dir="ltr">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={R} stroke="rgba(229,201,138,0.14)" strokeWidth="10" fill="none" />
        <circle
          cx="100"
          cy="100"
          r={R}
          stroke="var(--color-brass)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.7s cubic-bezier(0.3,0,0.2,1)" }}
        />
        <circle
          cx="100"
          cy="100"
          r="68"
          stroke="rgba(229,201,138,0.08)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 6"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" dir="rtl">
        <span className="font-mono text-5xl sm:text-6xl font-semibold text-paper tabular">{value}</span>
        <span className="font-mono text-brass-3/70 text-sm mt-1" dir="ltr">/ 5.00</span>
        <span className="font-display text-brass text-lg font-semibold mt-1">جيد جداً</span>
      </div>
    </div>
  );
}

function MetaRow({ k, v, ltr = false }: { k: string; v: string; ltr?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-paper/10 text-sm">
      <span className="text-paper/45">{k}</span>
      <span className="font-medium text-paper/90 font-mono text-[13px]" dir={ltr ? "ltr" : undefined}>
        {v}
      </span>
    </div>
  );
}

export default function Cover() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="relative bg-pine text-paper overflow-hidden">
      {/* ambient layers */}
      <div className="absolute inset-0 pattern-stars" aria-hidden />
      <div className="absolute inset-0 pattern-dots-dark opacity-40" aria-hidden />
      <div
        className="glow-drift absolute -top-32 -start-32 w-[34rem] h-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(193,154,75,0.22), transparent 65%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -end-24 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, rgba(23,112,95,0.3), transparent 65%)" }}
        aria-hidden
      />
      <svg
        className="slow-spin absolute -top-24 -start-24 w-96 h-96 text-brass/10"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        aria-hidden
      >
        <circle cx="100" cy="100" r="96" strokeDasharray="3 7" />
        <circle cx="100" cy="100" r="70" strokeDasharray="2 10" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-12">
        {/* document meta strip */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] sm:text-xs text-brass-3/80 tracking-widest">
            <span className="flex items-center gap-2">
              <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-brass" />
              وثيقة نهائية
            </span>
            <span className="hidden sm:inline text-paper/30">|</span>
            <span dir="ltr">REF: AU-EVAL-2026-014</span>
            <span className="hidden sm:inline text-paper/30">|</span>
            <span>تاريخ الإصدار: فبراير 2026</span>
            <span className="hidden sm:inline text-paper/30">|</span>
            <span>لجنة تقييم مستقلة</span>
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start">
          {/* title block */}
          <div>
            <Reveal delay={80}>
              <p className="font-display text-brass text-xl sm:text-2xl font-semibold">
                تقرير تقييم مقترح
              </p>
            </Reveal>
            <Reveal delay={160}>
              <h1 className="font-display font-bold text-[2.6rem] leading-[1.15] sm:text-6xl lg:text-[4.2rem] mt-3 text-paper">
                موقع جامعة
                <span className="text-brass-3"> العاصمة الأهلية</span>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-5 max-w-xl text-paper/70 leading-8 text-[15px] sm:text-base">
                مراجعة مستقلة لوثيقة المقترح المقدمة — تسعة عشر قسماً، وثمانية مراحل تنفيذ،
                وعشرون جدول بيانات — لقياس جاهزية المشروع للاعتماد والتنفيذ.
              </p>
            </Reveal>
            <Reveal delay={330}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                {ready && <Stamp text="قابلة للتنفيذ بشروط" tone="rust" />}
                <span className="font-mono text-xs text-paper/45">
                  مشروطة بمعالجة 9 تحفظات — 4 منها عالية الخطورة
                </span>
              </div>
            </Reveal>
          </div>

          {/* score + meta */}
          <Reveal delay={260} className="flex flex-col items-center gap-8 lg:items-end">
            <ScoreRing />
            <div className="w-full max-w-xs">
              <MetaRow k="اسم المشروع" v="Alassema University" ltr />
              <MetaRow k="النطاق" v="موقع جامعي ديناميكي متكامل" />
              <MetaRow k="البنية التقنية" v="PHP + MySQL / Linux" ltr />
              <MetaRow k="اللغة" v="عربية (RTL) — إنجليزية مخطط لها" />
              <MetaRow k="تقييم الوثيقة لنفسها" v={`${SELF_SCORE.toFixed(1)} / 5`} ltr />
            </div>
          </Reveal>
        </div>

        {/* KPI strip */}
        <Reveal delay={200}>
          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 border border-paper/12 bg-pine-2/60">
            {[
              { n: 19, suffix: "", label: "قسماً خضع للتقييم", icon: "doc" },
              { n: 9, suffix: "", label: "تحفظات جوهرية موثقة", icon: "flag" },
              { n: 7, suffix: "", label: "نقاط قوة مرجّحة", icon: "star" },
              { n: 64, suffix: "%", label: "مؤشر الجاهزية للتنفيذ", icon: "gauge" },
            ].map((k, i) => (
              <div
                key={k.label}
                className={`p-5 sm:p-6 group hover:bg-pine-3/50 transition-colors duration-300 ${
                  i < 3 ? "border-e border-paper/12" : ""
                } ${i < 2 ? "border-b lg:border-b-0 border-paper/12" : ""} ${
                  i === 2 ? "border-b lg:border-b-0 border-paper/12 lg:border-e" : ""
                }`}
              >
                <span className="font-mono text-3xl sm:text-4xl font-semibold text-brass-3 tabular group-hover:text-brass transition-colors" dir="ltr">
                  {k.n}
                  <span className="text-lg">{k.suffix}</span>
                </span>
                <p className="mt-2 text-[13px] text-paper/60">{k.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ticker */}
      <div className="relative border-t border-brass/25 bg-brass text-pine overflow-hidden no-print">
        <div className="marquee-track py-2.5">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${dup}-${item}`} className="flex items-center font-display font-semibold text-sm whitespace-nowrap">
                  <span className="px-5">{item}</span>
                  <IconStar8 size={11} className="opacity-70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
