import React, { useState } from "react";
import { SLIDE_KINDS, Slide, useStore } from "../store";
import { Confirm, Field, Icon, Toggle, btnBrass, btnGhost, iconBtn, inp, useToast } from "../ui";

const SKIN = [
  "from-pine to-teal",
  "from-clay to-brass-2",
  "from-pine-3 to-moss",
  "from-teal to-pine",
  "from-brass-2 to-clay",
  "from-pine to-pine-3",
  "from-moss to-teal",
];

const SPECS = [
  { k: "التبديل التلقائي", v: "مفعّل · 5000ms" },
  { k: "زمن الانتقال", v: "800ms · Fade/Slide" },
  { k: "التوقف عند التمرير", v: "مفعّل" },
  { k: "الأسهم والنقاط", v: "معروضة" },
  { k: "دعم اللمس", v: "سحب يمين/يسار" },
];

export default function Slides() {
  const db = useStore();
  const toast = useToast();
  const [toDelete, setToDelete] = useState<Slide | null>(null);
  const active = db.slides.filter((s) => s.active);

  const move = (s: Slide, dir: -1 | 1) => {
    db.moveSlide(s.id, dir);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-pine">السلايدر الرئيسي</h2>
          <p className="text-[13px] text-fog">{db.slides.length} شريحة · <span className="font-bold text-moss">{active.length} معروضة</span> في الصفحة الأولى</p>
        </div>
        <button className={`${btnBrass} ms-auto`} onClick={() => { db.addSlide(); toast({ tone: "ok", title: "أُضيفت شريحة جديدة", desc: "فعّلها بعد تحرير العنوان والوصف" }); }}>
          <Icon name="plus" size={16} /> شريحة جديدة
        </button>
      </div>

      {/* live preview */}
      <div className="relative overflow-hidden rounded-2xl bg-pine p-5 lg:p-6">
        <div className="pattern-stars absolute inset-0 opacity-40" />
        <div className="relative">
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-wide text-brass-3/80">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-moss" />
            معاينة مباشرة — ترتيب العرض الحالي على الموقع العام
          </p>
          {active.length === 0 ? (
            <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-paper/25 text-paper/55">
              <p className="flex items-center gap-2.5 text-[13.5px]"><Icon name="warn" size={18} /> لا توجد شرائح مفعّلة — سيعرض الموقع القسم الترحيبي الافتراضي فقط</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {active.slice(0, 3).map((s, i) => (
                <div key={s.id} className={`relative overflow-hidden rounded-xl bg-gradient-to-bl p-4 ${SKIN[db.slides.indexOf(s) % SKIN.length]}`}>
                  <div className="pattern-stars absolute inset-0 opacity-30" />
                  <div className="relative">
                    <p className="font-mono text-[10px] tracking-widest text-paper/55">شريحة {i + 1} · {s.kind}</p>
                    <p className="mt-1.5 font-display text-[16px] font-bold leading-6 text-paper">{s.title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-5 text-paper/70">{s.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {active.length > 3 && (
            <p className="mt-3 text-[12px] text-paper/55">+ {active.length - 3} شرائح أخرى في الدوران التلقائي</p>
          )}
        </div>
      </div>

      {/* specs */}
      <div className="flex flex-wrap gap-2">
        {SPECS.map((s) => (
          <span key={s.k} className="flex items-center gap-2 rounded-lg border border-ink/10 bg-card px-3 py-1.5 text-[11.5px]">
            <span className="font-bold text-ink/70">{s.k}</span>
            <span className="font-mono text-fog">{s.v}</span>
          </span>
        ))}
      </div>

      {/* list */}
      <div className="space-y-3">
        {db.slides.map((s, i) => (
          <div key={s.id} className={`row-in group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
            s.active ? "border-moss/35 shadow-[0_14px_34px_-24px_rgba(62,125,92,0.6)]" : "border-ink/8 opacity-80 hover:opacity-100"
          }`} style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
              {/* thumb + order */}
              <div className="flex items-center gap-3 md:flex-col md:gap-2">
                <div className={`relative flex h-20 w-32 flex-none items-end overflow-hidden rounded-lg bg-gradient-to-bl p-2.5 ${SKIN[i % SKIN.length]}`}>
                  <div className="pattern-stars absolute inset-0 opacity-30" />
                  <span className="relative font-mono text-[10px] font-bold text-paper/85">#{i + 1} · {s.kind}</span>
                </div>
                <div className="flex gap-1.5 md:flex-col">
                  <button className={iconBtn} disabled={i === 0} onClick={() => move(s, -1)} title="تقديم في الترتيب"
                    style={i === 0 ? { opacity: 0.3, pointerEvents: "none" } : undefined}>
                    <Icon name="chevUp" size={15} />
                  </button>
                  <button className={iconBtn} disabled={i === db.slides.length - 1} onClick={() => move(s, 1)} title="تأخير في الترتيب"
                    style={i === db.slides.length - 1 ? { opacity: 0.3, pointerEvents: "none" } : undefined}>
                    <Icon name="chevDown" size={15} />
                  </button>
                </div>
              </div>

              {/* fields */}
              <div className="grid flex-1 gap-3 sm:grid-cols-[130px_1fr_1fr]">
                <Field label="النوع">
                  <select className={inp} value={s.kind} onChange={(e) => db.updateSlide(s.id, { kind: e.target.value })}>
                    {SLIDE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </Field>
                <Field label="العنوان">
                  <input className={inp} value={s.title} onChange={(e) => db.updateSlide(s.id, { title: e.target.value })} />
                </Field>
                <Field label="الوصف">
                  <input className={inp} value={s.subtitle} onChange={(e) => db.updateSlide(s.id, { subtitle: e.target.value })} />
                </Field>
              </div>

              {/* status */}
              <div className="flex items-center justify-between gap-4 border-t border-ink/6 pt-3 md:w-44 md:flex-col md:items-end md:border-0 md:pt-0">
                <label className="flex items-center gap-2.5">
                  <Toggle on={s.active} onChange={(v) => {
                    db.updateSlide(s.id, { active: v });
                    toast({ tone: v ? "ok" : "info", title: v ? "أصبحت الشريحة معروضة" : "أُخفيت الشريحة", desc: s.title });
                  }} />
                  <span className={`text-[12.5px] font-bold ${s.active ? "text-moss" : "text-fog"}`}>{s.active ? "مفعّلة" : "مخفية"}</span>
                </label>
                <button className={`${iconBtn} hover:!border-rust/50 hover:!bg-rust/8 hover:!text-rust`} onClick={() => setToDelete(s)} title="حذف الشريحة">
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {db.slides.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-card/50 py-14 text-center">
          <p className="text-[14px] text-fog">حُذفت جميع الشرائح — أضف شريحة جديدة لإعادة بناء السلايدر.</p>
        </div>
      )}

      <Confirm
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            db.deleteSlide(toDelete.id);
            toast({ tone: "info", title: "حُذفت الشريحة", desc: `«${toDelete.title}»` });
          }
        }}
        title="حذف الشريحة"
        desc={toDelete ? `ستُحذف شريحة «${toDelete.title}» من الدوران نهائياً.` : ""}
      />
    </div>
  );
}
