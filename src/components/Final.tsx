import { CONDITIONS, CRITERIA, OUR_SCORE } from "../data";
import { IconDoc, IconSeal, Reveal, SectionHead, Stamp } from "../lib";

function FinalVerdict() {
  const total =
    CRITERIA.reduce((acc, c) => acc + c.score * c.weight, 0) /
    CRITERIA.reduce((acc, c) => acc + c.weight, 0);

  return (
    <section id="verdict-final" className="relative bg-pine text-paper overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 pattern-stars" aria-hidden />
      <div
        className="glow-drift absolute -bottom-32 -start-32 w-[32rem] h-[32rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(193,154,75,0.2), transparent 65%)" }}
        aria-hidden
      />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHead
          dark
          index="08"
          eyebrow="القرار النهائي"
          title="اعتماد مشروط بثلاثة التزامات"
        />

        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-end gap-6">
                <span className="font-mono font-semibold text-[4.5rem] sm:text-[6rem] leading-none text-brass-3 tabular" dir="ltr">
                  {total.toFixed(2)}
                </span>
                <span className="font-mono text-paper/50 text-xl mb-3" dir="ltr">/ 5.00</span>
                <div className="mb-2">
                  <Stamp text="يُعتمد بشروط" tone="brass" />
                </div>
              </div>
              <p className="mt-6 max-w-2xl text-paper/70 leading-9 text-[15px]">
                المقترح وثيقة تحليل من الطراز الذي يُبنى عليه — درجتها المرجّحة {OUR_SCORE.toFixed(2)} من 5
                تضعها في فئة «جيد جداً». غير أن الاعتماد النهائي يبقى معلقاً على الالتزامات الثلاثة
                أدناه، تُنفذ وتُوثق قبل توقيع أي تعاقد تنفيذي.
              </p>
            </Reveal>

            <div className="mt-10 space-y-3">
              {CONDITIONS.map((c, i) => (
                <Reveal key={c} delay={i * 90}>
                  <div className="group flex items-start gap-4 border border-paper/12 bg-pine-2/70 hover:border-brass/50 hover:bg-pine-2 transition-all duration-300 p-5">
                    <span className="font-mono text-brass text-lg shrink-0 w-8" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-paper/85 leading-8 text-[15px]">{c}</p>
                    <span className="ms-auto shrink-0 mt-1 text-brass/60 group-hover:text-brass transition-colors">
                      <IconSeal size={20} />
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-8 border-t border-paper/12 pt-8">
                <div>
                  <p className="font-mono text-[11px] tracking-widest text-brass-3/80">توقيع</p>
                  <p className="font-display text-2xl font-bold text-paper mt-2">لجنة التقييم المستقلة</p>
                  <p className="text-sm text-paper/50 mt-1">تحليل وثائقي — دون الوصول إلى الكود أو النظام الحي</p>
                </div>
                <div className="sm:text-left">
                  <p className="font-mono text-[11px] tracking-widest text-brass-3/80">اعتماد الوثيقة</p>
                  <p className="font-mono text-paper/80 mt-2 text-sm" dir="ltr">AU-EVAL-2026-014 · FINAL</p>
                  <p className="font-mono text-paper/45 text-xs mt-1">فبراير 2026 — طرابلس</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="bg-paper text-ink p-7 sm:p-8 max-w-sm lg:sticky lg:top-28 print-break">
              <div className="flex items-center gap-3 text-brass-2">
                <IconDoc size={24} />
                <h3 className="font-display font-bold text-2xl">مقياس الدرجات</h3>
              </div>
              <ul className="mt-6 space-y-4">
                {[
                  { r: "4.50 – 5.00", t: "ممتاز — جاهز للتنفيذ فوراً", c: "bg-moss" },
                  { r: "3.50 – 4.49", t: "جيد جداً / جيد — يعالج ثم يُعتمد", c: "bg-brass" },
                  { r: "2.50 – 3.49", t: "يحتاج إعادة صياغة جزئية", c: "bg-clay" },
                  { r: "أقل من 2.50", t: "فجوة منهجية — إعادة كتابة", c: "bg-rust" },
                ].map((s) => (
                  <li key={s.r} className="flex items-center gap-4">
                    <span className={`w-3 h-3 shrink-0 ${s.c}`} />
                    <span className="font-mono text-xs text-fog tabular shrink-0" dir="ltr">{s.r}</span>
                    <span className="text-sm text-ink/80 leading-6">{s.t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-6 border-t border-ink/10">
                <h4 className="font-semibold text-sm text-ink">المنهجية</h4>
                <ol className="mt-3 space-y-2.5 text-[13px] text-fog leading-7">
                  <li className="flex gap-3">
                    <span className="font-mono text-brass-2" dir="ltr">1.</span>
                    قراءة الوثيقة كاملة (19 قسماً) وتقييم كل قسم بمعزل عن الآخر.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-brass-2" dir="ltr">2.</span>
                    إسناد درجات المعايير التسعة وفق مقياس الخمس نقاط أعلاه.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-brass-2" dir="ltr">3.</span>
                    ترجيح الدرجات بأوزان تعكس أثر كل معيار على نجاح الإطلاق.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-brass-2" dir="ltr">4.</span>
                    توثيق التحفظات بمصفوفة خطورة وربط كل تحفظ بمعالجة محددة.
                  </li>
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-paper/60 border-t border-brass/20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 border border-brass/40 flex items-center justify-center text-brass shrink-0">
              <IconSeal size={20} />
            </span>
            <div>
              <p className="font-display font-bold text-paper text-lg">تقرير تقييم مقترح — جامعة العاصمة الأهلية</p>
              <p className="text-xs text-paper/40 mt-0.5" dir="ltr">AU-EVAL-2026-014 · Tripoli, Libya</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print group flex items-center gap-3 border border-brass/40 text-brass-3 px-5 py-3 font-semibold text-sm hover:bg-brass hover:text-pine transition-all duration-300 cursor-pointer"
          >
            تصدير التقرير PDF
            <IconDoc size={17} />
          </button>
        </div>
        <p className="mt-8 pt-6 border-t border-paper/10 text-[13px] leading-7 text-paper/40 max-w-3xl">
          أُعدّ هذا التقييم استناداً إلى نص الوثيقة المقدمة حصراً، دون الوصول إلى الكود المصدري أو
          النظام الحي أو قاعدة البيانات الفعلية. الأرقام التقديرية الواردة في الوثيقة الأصلية قُبلت
          كما وردت مع الإشارة إلى مواضعها. الدرجات تعكس حكماً تحريرياً مستقلاً قابلاً للمراجعة عند
          توفر ملاحق إضافية.
        </p>
      </div>
    </footer>
  );
}

export default function Final() {
  return (
    <>
      <FinalVerdict />
      <Footer />
    </>
  );
}
