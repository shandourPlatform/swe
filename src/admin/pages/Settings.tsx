import React, { useMemo, useState } from "react";
import { Settings as TSettings, useStore } from "../store";
import { Confirm, Field, Icon, Toggle, btnBrass, btnDanger, btnGhost, btnPrimary, inp, useToast } from "../ui";

export default function SettingsPage() {
  const db = useStore();
  const toast = useToast();
  const [form, setForm] = useState<TSettings>({ ...db.settings });
  const [resetOpen, setResetOpen] = useState(false);
  const [forceSync, setForceSync] = useState(0);

  React.useEffect(() => {
    setForm({ ...db.settings });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSync]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(db.settings), [form, db.settings]);

  const set = <K extends keyof TSettings>(k: K, v: TSettings[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (form.siteName.trim().length < 4) {
      toast({ tone: "err", title: "اسم الموقع قصير جداً" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ tone: "err", title: "البريد الرسمي غير صحيح", desc: "تحقق من صيغة البريد قبل الحفظ" });
      return;
    }
    db.saveSettings(form);
    toast({ tone: "ok", title: "حُفظت الإعدادات", desc: "ستنعكس التغييرات على الموقع العام فوراً" });
  };

  const toggles: { k: keyof TSettings; t: string; d: string }[] = [
    { k: "registrationOpen", t: "فتح باب القبول والتسجيل", d: "يظهر زر «سجّل الآن» في الصفحة الأولى والسلايدر" },
    { k: "maintenance", t: "وضع الصيانة", d: "يعرض صفحة «قيد التحديث» للزوار ويوقف الموقع العام مؤقتاً" },
    { k: "comments", t: "التعليقات على الأخبار", d: "تفعيل خانة تعليقات الزوار أسفل الأخبار المنشورة" },
    { k: "newsletter", t: "النشرة البريدية", d: "نموذج اشتراك في الفوتر + إرسال ملخص شهري" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-5 pb-24">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-pine">الإعدادات العامة</h2>
          <p className="text-[13px] text-fog">هوية الموقع، بيانات التواصل، والتفضيلات التشغيلية</p>
        </div>
        {dirty && (
          <span className="ms-auto flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3.5 py-1.5 text-[12.5px] font-bold text-brass-2">
            <span className="pulse-dot h-2 w-2 rounded-full bg-brass-2" />
            تغييرات غير محفوظة
          </span>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* identity */}
        <div className="rounded-2xl border border-ink/8 bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2.5 font-display text-[16.5px] font-bold text-pine">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pine text-brass-3"><Icon name="globe" size={15} /></span>
            هوية الموقع
          </h3>
          <div className="space-y-4">
            <Field label="اسم الموقع">
              <input className={inp} value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
            </Field>
            <Field label="الشعار النصي (Tagline)">
              <input className={inp} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            {/* live SEO preview */}
            <div>
              <p className="mb-1.5 text-[13px] font-semibold text-ink/80">معاينة ظهور الموقع في نتائج البحث</p>
              <div className="rounded-xl border border-ink/10 bg-paper/70 p-4" dir="ltr">
                <p className="truncate font-mono text-[11px] text-moss">https://www.au.edu.ly</p>
                <p className="mt-0.5 truncate text-[15px] font-semibold text-[#1a0dab]" style={{ fontFamily: "Arial, sans-serif" }}>
                  {form.siteName || "اسم الموقع"} — {form.tagline ? form.tagline.slice(0, 40) : ""}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-5 text-[#4d5156]" style={{ fontFamily: "Arial, sans-serif" }}>
                  جامعة أهلية معتمدة في قلب طرابلس — برامج المحاسبة وإدارة الأعمال وتقنية المعلومات والقانون. {form.email} · {form.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* contact */}
        <div className="rounded-2xl border border-ink/8 bg-card p-5">
          <h3 className="mb-4 flex items-center gap-2.5 font-display text-[16.5px] font-bold text-pine">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-paper"><Icon name="mail" size={15} /></span>
            بيانات التواصل
          </h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="البريد الرسمي">
                <input dir="ltr" className={`${inp} text-left`} value={form.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="الهاتف">
                <input dir="ltr" className={`${inp} text-left`} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الفاكس">
                <input dir="ltr" className={`${inp} text-left`} value={form.fax} onChange={(e) => set("fax", e.target.value)} />
              </Field>
              <Field label="ساعات العمل">
                <input className={inp} value={form.hours} onChange={(e) => set("hours", e.target.value)} />
              </Field>
            </div>
            <Field label="العنوان">
              <input className={inp} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <div className="flex items-center gap-2.5 rounded-xl bg-pine/4 px-4 py-3 text-[12px] leading-5 text-fog">
              <Icon name="pin" size={16} className="flex-none text-brass-2" />
              تُعرض هذه البيانات في صفحة «اتصل بنا» وتذييل الموقع وSchema من نوع EducationalOrganization.
            </div>
          </div>
        </div>
      </div>

      {/* toggles */}
      <div className="rounded-2xl border border-ink/8 bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2.5 font-display text-[16.5px] font-bold text-pine">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass-2 text-pine"><Icon name="gear" size={15} /></span>
          التفضيلات التشغيلية
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {toggles.map((t) => (
            <div key={t.k} className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
              form[t.k] ? "border-moss/35 bg-moss/5" : "border-ink/8 bg-paper/60"
            }`}>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{t.t}</p>
                <p className="mt-0.5 text-[12px] leading-5 text-fog">{t.d}</p>
              </div>
              <Toggle on={Boolean(form[t.k])} onChange={(v) => set(t.k, v as never)} />
            </div>
          ))}
        </div>
        {/* languages */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-ink/8 bg-paper/60 px-4 py-3.5">
          <Icon name="globe" size={17} className="text-brass-2" />
          <p className="text-[13px] font-bold text-ink">اللغات:</p>
          <span className="rounded-full bg-pine px-3 py-1 text-[12px] font-bold text-paper">العربية — مفعّلة (RTL)</span>
          <span className="rounded-full border border-dashed border-ink/20 px-3 py-1 text-[12px] font-semibold text-fog">English — مخطط لها (المرحلة الثالثة)</span>
        </div>
      </div>

      {/* danger zone */}
      <div className="rounded-2xl border border-rust/25 bg-rust/4 p-5">
        <h3 className="flex items-center gap-2.5 font-display text-[16.5px] font-bold text-rust">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rust/12"><Icon name="warn" size={15} /></span>
          منطقة الخطر
        </h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-[13px] leading-6 text-ink/70">
            إعادة تعيين البيانات التجريبية تُرجع الأخبار والنماذج والرسائل والمستخدمين إلى الحالة الافتراضية. لا يتأثر حسابك الحالي.
          </p>
          <button className={btnDanger} onClick={() => setResetOpen(true)}>
            <Icon name="refresh" size={15} /> إعادة التعيين
          </button>
        </div>
      </div>

      {/* sticky save bar */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-card/95 backdrop-blur-md transition-transform duration-300 lg:start-[264px] ${
        dirty ? "translate-y-0" : "translate-y-full"
      }`}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3 lg:px-7">
          <p className="hidden items-center gap-2 text-[12.5px] font-semibold text-brass-2 sm:flex">
            <Icon name="warn" size={15} /> لديك تعديلات لم تُحفظ بعد
          </p>
          <div className="flex w-full gap-2.5 sm:w-auto">
            <button className={`${btnGhost} flex-1 sm:flex-none`} onClick={() => setForm({ ...db.settings })}>تجاهل</button>
            <button className={`${btnBrass} flex-1 sm:flex-none`} onClick={save}>
              <Icon name="check" size={16} /> حفظ الإعدادات
            </button>
          </div>
        </div>
      </div>

      <Confirm
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          db.resetData();
          setForceSync((x) => x + 1);
          toast({ tone: "ok", title: "أُعيدت البيانات التجريبية", desc: "جميع الوحدات عادت لحالتها الافتراضية" });
        }}
        title="إعادة تعيين البيانات"
        desc="سيُستبدل كل المحتوى الحالي (أخبار، نماذج، رسائل، مستخدمون) بالبيانات الافتراضية. هل أنت متأكد؟"
      />
    </div>
  );
}

