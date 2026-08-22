import { CRITERIA, EXECUTIVE_VERDICT, OUR_SCORE, SELF_SCORE } from "../data";
import { Eyebrow, IconScale, Reveal, SectionHead, useInView } from "../lib";

function CompareBar({
  label,
  value,
  ours,
  delay,
}: {
  label: string;
  value: number;
  ours?: boolean;
  delay: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref} className="group">
      <div className="flex items-baseline justify-between mb-2">
        <span className={`text-sm font-medium ${ours ? "text-ink" : "text-fog"}`}>{label}</span>
        <span className="font-mono text-sm font-semibold text-brass-2 tabular" dir="ltr">
          {value.toFixed(2)} / 5
        </span>
      </div>
      <div className="h-3 bg-ink/8 overflow-hidden">
        <div
          className={`h-full transition-[width] duration-1000 ease-out ${
            ours ? "bg-brass" : "bg-fog/45"
          }`}
          style={{ width: inView ? `${(value / 5) * 100}%` : "0%", transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

function CriterionRow({
  name,
  score,
  weight,
  note,
  delay,
}: {
  name: string;
  score: number;
  weight: number;
  note: string;
  delay: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const tone =
    score >= 4.2 ? "bg-moss" : score >= 3.5 ? "bg-brass" : "bg-rust";
  const textTone =
    score >= 4.2 ? "text-moss" : score >= 3.5 ? "text-brass-2" : "text-rust";

  return (
    <div
      ref={ref}
      className="group grid sm:grid-cols-[minmax(0,15rem)_1fr] gap-x-8 gap-y-2 py-5 border-b border-ink/10 hover:bg-card transition-colors duration-300 px-2 sm:px-4 -mx-2 sm:-mx-4"
    >
      <div>
        <div className="flex items-center justify-between sm:justify-start sm:gap-3">
          <h3 className="font-display font-bold text-lg text-ink leading-snug">{name}</h3>
        </div>
        <span className="font-mono text-[11px] text-fog" dir="ltr">
          وزن {weight}%
        </span>
      </div>
      <div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2.5 bg-ink/8 overflow-hidden">
            <div
              className={`h-full ${tone}`}
              style={{
                width: inView ? `${(score / 5) * 100}%` : "0%",
                transition: `width 1.1s cubic-bezier(0.3,0,0.2,1) ${delay}ms`,
              }}
            />
          </div>
          <span className={`font-mono font-semibold text-lg tabular ${textTone}`} dir="ltr">
            {score.toFixed(1)}
          </span>
        </div>
        <p className="mt-2 text-sm text-fog leading-7">{note}</p>
      </div>
    </div>
  );
}

export default function Assess() {
  return (
    <>
      {/* ------- executive verdict ------- */}
      <section id="verdict" className="relative bg-paper pattern-grid-light scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <SectionHead
            index="01"
            eyebrow="الحكم التنفيذي"
            title="وثيقة ناضجة تُقرّ بالخلل قبل المزايا"
          />
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16">
            <Reveal>
              <div className="relative">
                <span className="absolute -top-7 -start-2 font-display text-[6rem] leading-none text-brass/25 select-none" aria-hidden>
                  ”
                </span>
                <p className="relative text-ink/85 text-[15px] sm:text-base leading-9">
                  {EXECUTIVE_VERDICT}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-px bg-brass" />
                  <p className="font-mono text-xs text-fog">
                    خلاصة اللجنة — وثيقة رقم AU-EVAL-2026-014
                  </p>
                </div>
              </div>

              <div className="mt-10 grid sm:grid-cols-3 gap-4">
                {[
                  { k: "التصنيف", v: "جيد جداً", s: "3.95 من 5 بترجيح الأوزان" },
                  { k: "القرار", v: "اعتماد مشروط", s: "بمعالجة 9 تحفظات موثقة" },
                  { k: "الأثر بعد التصحيح", v: "4.4 متوقعة", s: "وفق خطة الـ16 أسبوعاً" },
                ].map((c, i) => (
                  <div
                    key={c.k}
                    className="rail-top bg-card border border-ink/10 p-5 hover:-translate-y-1 hover:shadow-lift transition-all duration-300"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <p className="font-mono text-[11px] text-fog">{c.k}</p>
                    <p className="font-display font-bold text-xl text-ink mt-1.5">{c.v}</p>
                    <p className="text-xs text-fog mt-1 leading-5">{c.s}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="bg-pine text-paper p-7 sm:p-8 relative overflow-hidden h-full">
                <div className="absolute inset-0 pattern-stars opacity-60" aria-hidden />
                <div className="relative">
                  <div className="flex items-center gap-3 text-brass-3">
                    <IconScale size={26} />
                    <h3 className="font-display font-bold text-2xl">ميزان التقييمين</h3>
                  </div>
                  <p className="text-paper/60 text-sm mt-2 leading-7">
                    قيّمت الوثيقةُ الموقعَ الحالي، وقيّمنا نحن الوثيقةَ نفسها — فجوة 0.35 نقطة
                    مصدرها الجانب التنفيذي لا التحليلي.
                  </p>
                  <div className="mt-8 space-y-7">
                    <CompareBar
                      label="تقييم الوثيقة للموقع الحالي"
                      value={SELF_SCORE}
                      delay={200}
                    />
                    <CompareBar
                      label="تقييمنا المستقل للوثيقة"
                      value={OUR_SCORE}
                      ours
                      delay={450}
                    />
                  </div>
                  <div className="mt-9 border-t border-paper/12 pt-5 flex items-baseline justify-between">
                    <span className="text-sm text-paper/55">الفارق</span>
                    <span className="font-mono font-semibold text-brass-3 tabular" dir="ltr">
                      +0.35
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] text-paper/45 leading-6">
                    التحليل يستحق الإشادة؛ الخطة الزمنية والموارد والمخاطر تحتاج إعادة ضبط قبل
                    توقيع أي تعاقد.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------- weighted criteria ------- */}
      <section id="criteria" className="relative bg-card border-y border-ink/10 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <SectionHead
            index="02"
            eyebrow="المعايير التسعة"
            title="تفصيل الدرجات المرجّحة"
            desc="تسعة معايير بأوزان مئوية تعكس أثر كل جانب على نجاح المشروع؛ اللون يعكس حكمة الدرجة: أخضر (4.2+)، نحاسي (3.5–4.1)، صدئي (أقل من 3.5)."
          />
          <div>
            {CRITERIA.map((c, i) => (
              <CriterionRow key={c.name} {...c} delay={i * 70} />
            ))}
          </div>
          <Reveal>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-pine text-paper px-6 sm:px-8 py-6">
              <div className="flex items-center gap-4">
                <Eyebrow dark>المجموع المرجّح</Eyebrow>
                <span className="font-mono text-4xl sm:text-5xl font-semibold text-brass-3 tabular" dir="ltr">
                  3.95
                </span>
                <span className="font-mono text-paper/50" dir="ltr">/ 5</span>
              </div>
              <p className="text-sm text-paper/65 leading-7 max-w-md">
                ضعفٌ واضح في محورين فقط — واقعية الجدول الزمني وإدارة المخاطر — يقابله تفوق في
                الشمولية والعمق الفني والنضج الأمني.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
