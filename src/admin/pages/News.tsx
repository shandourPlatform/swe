import React, { useEffect, useMemo, useState } from "react";
import { NEWS_CATS, NewsItem, NewsStatus, fmtDate, useStore } from "../store";
import { Confirm, Drawer, EmptyState, Field, Icon, StatusPill, btnBrass, btnGhost, btnPrimary, iconBtn, inp, inpErr, useToast } from "../ui";

const TONES = [
  "from-pine to-teal",
  "from-teal to-moss",
  "from-clay to-brass-2",
  "from-pine-3 to-teal",
  "from-brass-2 to-clay",
];
const STATUSES: NewsStatus[] = ["منشور", "مسودة", "مؤرشف"];

interface FormState {
  title: string;
  category: string;
  author: string;
  status: NewsStatus;
  excerpt: string;
  body: string;
  tone: number;
}
const emptyForm = (author: string): FormState => ({
  title: "", category: NEWS_CATS[0], author, status: "مسودة", excerpt: "", body: "", tone: 0,
});

export default function News({ autoNew }: { autoNew: number }) {
  const db = useStore();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"الكل" | NewsStatus>("الكل");
  const [cat, setCat] = useState("الكل");
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(""));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [toDelete, setToDelete] = useState<NewsItem | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  useEffect(() => {
    if (autoNew > 0) {
      setCreating(true);
      setEditing(null);
      setForm(emptyForm(db.session?.name ?? ""));
      setErrors({});
    }
  }, [autoNew]); // eslint-disable-line

  const filtered = useMemo(() => {
    return db.news.filter(
      (n) =>
        (status === "الكل" || n.status === status) &&
        (cat === "الكل" || n.category === cat) &&
        (q.trim() === "" || n.title.includes(q.trim()) || n.excerpt.includes(q.trim()))
    );
  }, [db.news, q, status, cat]);

  const counts = {
    "الكل": db.news.length,
    "منشور": db.news.filter((n) => n.status === "منشور").length,
    "مسودة": db.news.filter((n) => n.status === "مسودة").length,
    "مؤرشف": db.news.filter((n) => n.status === "مؤرشف").length,
  } as const;

  const openEdit = (n: NewsItem) => {
    setEditing(n);
    setCreating(false);
    setForm({ title: n.title, category: n.category, author: n.author, status: n.status, excerpt: n.excerpt, body: n.body, tone: n.tone });
    setErrors({});
  };
  const openNew = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm(db.session?.name ?? ""));
    setErrors({});
  };

  const save = () => {
    const e: typeof errors = {};
    if (form.title.trim().length < 8) e.title = "العنوان يجب ألا يقل عن 8 أحرف";
    if (form.excerpt.length > 160) e.excerpt = "النبذة تتجاوز 160 حرفاً — اختصرها لمحركات البحث";
    if (form.status === "منشور" && form.body.trim().length < 40) e.body = "لا يمكن النشر بدون نص كامل (40 حرفاً على الأقل)";
    if (!form.author.trim()) e.author = "اسم الكاتب مطلوب";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast({ tone: "err", title: "تحقق من الحقول", desc: "هناك أخطاء يجب معالجتها قبل الحفظ" });
      return;
    }
    if (editing) {
      db.updateNews(editing.id, { ...form, title: form.title.trim() });
      toast({ tone: "ok", title: "تم حفظ التعديلات", desc: `«${form.title.slice(0, 40)}»` });
    } else {
      const id = db.addNews({ ...form, title: form.title.trim() });
      setFlashId(id);
      toast({ tone: "ok", title: form.status === "منشور" ? "نُشر الخبر" : "أُنشئ الخبر", desc: form.status === "منشور" ? "أصبح الخبر ظاهراً في الموقع العام" : "حُفظ كمسودة — يمكنك نشره متى شئت" });
    }
    setCreating(false);
    setEditing(null);
  };

  const changeStatus = (n: NewsItem, s: NewsStatus) => {
    db.setNewsStatus(n.id, s);
    toast({
      tone: s === "منشور" ? "ok" : "info",
      title: s === "منشور" ? "نُشر الخبر" : `نُقل إلى «${s}»`,
      desc: n.title.slice(0, 50),
    });
  };

  const drawerOpen = creating || editing !== null;

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-pine">الأخبار والفعاليات</h2>
          <p className="text-[13px] text-fog">{counts["الكل"]} خبر · {counts["منشور"]} منشور · {counts["مسودة"]} مسودة</p>
        </div>
        <button className={`${btnBrass} ms-auto`} onClick={openNew}>
          <Icon name="plus" size={16} /> خبر جديد
        </button>
      </div>

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-ink/8 bg-card p-3">
        <div className="relative min-w-[220px] flex-1">
          <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-fog"><Icon name="search" size={15} /></span>
          <input className={`${inp} ps-9`} placeholder="ابحث في العناوين والنصوص…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className={`${inp} !w-auto`} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="الكل">كل التصنيفات</option>
          {NEWS_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-1.5 rounded-lg bg-pine/5 p-1">
          {(["الكل", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s as typeof status)}
              className={`rounded-md px-3 py-1.5 text-[12.5px] font-bold transition-all cursor-pointer ${
                status === s ? "bg-pine text-paper shadow" : "text-ink/60 hover:text-ink"
              }`}
            >
              {s} <span className="font-mono text-[11px] opacity-70">{counts[s as keyof typeof counts]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="news"
          title="لا توجد أخبار مطابقة"
          desc={db.news.length === 0 ? "ابدأ بإنشاء أول خبر رسمي للجامعة." : "جرّب تعديل كلمة البحث أو تغيير الفلاتر أعلاه."}
          action={
            db.news.length === 0 ? (
              <button className={btnBrass} onClick={openNew}><Icon name="plus" size={15} /> إنشاء خبر</button>
            ) : (
              <button className={btnGhost} onClick={() => { setQ(""); setStatus("الكل"); setCat("الكل"); }}>مسح الفلاتر</button>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-card">
          {/* desktop table */}
          <table className="hidden w-full md:table">
            <thead>
              <tr className="border-b border-ink/8 bg-pine/3 text-start">
                {["الخبر", "التصنيف", "التاريخ", "المشاهدات", "الحالة", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-start text-[11.5px] font-bold tracking-wide text-fog">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className={`group border-b border-ink/5 transition-colors last:border-0 hover:bg-brass/6 ${flashId === n.id ? "flash-row" : ""}`}>
                  <td className="max-w-[340px] px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={`hidden h-9 w-9 flex-none items-center justify-center rounded-lg bg-gradient-to-bl text-paper/90 lg:flex ${TONES[n.tone % TONES.length]}`}>
                        <Icon name="news" size={16} />
                      </span>
                      <div className="min-w-0">
                        <button onClick={() => openEdit(n)} className="block truncate text-start text-[13.5px] font-bold text-ink transition-colors hover:text-teal cursor-pointer">
                          {n.title}
                        </button>
                        <p className="truncate text-[11.5px] text-fog">{n.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="rounded-md bg-pine/6 px-2 py-1 text-[11.5px] font-semibold text-pine">{n.category}</span></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-fog">{fmtDate(n.date)}</td>
                  <td className="px-4 py-3.5 font-mono text-[12.5px] text-ink/70">{n.views.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3.5">
                    <select
                      value={n.status}
                      onChange={(e) => changeStatus(n, e.target.value as NewsStatus)}
                      className="cursor-pointer rounded-lg border border-ink/12 bg-paper px-2 py-1.5 text-[12px] font-semibold outline-none transition-colors hover:border-brass/60 focus:border-brass"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-end gap-1.5 opacity-40 transition-opacity group-hover:opacity-100">
                      <button className={iconBtn} onClick={() => openEdit(n)} title="تحرير"><Icon name="pen" size={15} /></button>
                      <button className={`${iconBtn} hover:!border-rust/50 hover:!bg-rust/8 hover:!text-rust`} onClick={() => setToDelete(n)} title="حذف"><Icon name="trash" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* mobile cards */}
          <div className="divide-y divide-ink/6 md:hidden">
            {filtered.map((n) => (
              <div key={n.id} className={`p-4 ${flashId === n.id ? "flash-row" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <button onClick={() => openEdit(n)} className="text-start text-[13.5px] font-bold leading-6 text-ink cursor-pointer">{n.title}</button>
                  <StatusPill s={n.status} />
                </div>
                <p className="mt-1 text-[11.5px] text-fog">{n.category} · {fmtDate(n.date)} · <span className="font-mono">{n.views.toLocaleString("en-US")}</span> مشاهدة</p>
                <div className="mt-3 flex gap-2">
                  <button className={`${btnGhost} !px-3 !py-1.5 text-[12.5px]`} onClick={() => openEdit(n)}><Icon name="pen" size={14} /> تحرير</button>
                  <button className={`${btnGhost} !px-3 !py-1.5 text-[12.5px] !text-rust`} onClick={() => setToDelete(n)}><Icon name="trash" size={14} /> حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* editor drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => { setCreating(false); setEditing(null); }}
        title={editing ? "تحرير الخبر" : "خبر جديد"}
        subtitle={editing ? `آخر تعديل ${fmtDate(editing.date)}` : "املأ الحقول ثم احفظ كمسودة أو انشر مباشرة"}
        footer={
          <>
            <button className={btnGhost} onClick={() => { setCreating(false); setEditing(null); }}>إلغاء</button>
            <button className={btnPrimary} onClick={save}>
              <Icon name="check" size={16} /> {editing ? "حفظ التعديلات" : form.status === "منشور" ? "نشر الخبر" : "حفظ المسودة"}
            </button>
          </>
        }
      >
        <div className="space-y-4.5">
          {/* cover preview */}
          <div className={`relative flex h-28 items-end overflow-hidden rounded-xl bg-gradient-to-bl p-4 ${TONES[form.tone % TONES.length]}`}>
            <div className="pattern-stars absolute inset-0 opacity-40" />
            <div className="relative">
              <p className="font-mono text-[10px] tracking-widest text-paper/60">معاينة الغلاف</p>
              <p className="font-display text-[17px] font-bold leading-6 text-paper">{form.title || "عنوان الخبر يظهر هنا…"}</p>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink/80">نمط الغلاف</p>
            <div className="flex gap-2">
              {TONES.map((t, i) => (
                <button key={t} onClick={() => setForm((f) => ({ ...f, tone: i }))}
                  className={`h-9 w-14 rounded-lg bg-gradient-to-bl transition-all cursor-pointer ${t} ${form.tone === i ? "ring-2 ring-brass ring-offset-2 ring-offset-paper scale-105" : "opacity-70 hover:opacity-100"}`}
                  aria-label={`نمط ${i + 1}`} />
              ))}
            </div>
          </div>

          <Field label="عنوان الخبر" error={errors.title} hint={<span>{form.title.length} حرف</span>}>
            <input className={`${inp} ${errors.title ? inpErr : ""}`} value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="مثال: فتح باب القبول للعام الجامعي الجديد" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="التصنيف">
              <select className={inp} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {NEWS_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="الكاتب" error={errors.author}>
              <input className={`${inp} ${errors.author ? inpErr : ""}`} value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="اسم المحرر" />
            </Field>
            <Field label="الحالة">
              <select className={inp} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as NewsStatus }))}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="النبذة المختصرة" error={errors.excerpt}
            hint={<span className={form.excerpt.length > 160 ? "!text-rust font-bold" : form.excerpt.length > 130 ? "!text-brass-2 font-bold" : ""}>{form.excerpt.length} / 160</span>}>
            <textarea rows={2} className={`${inp} resize-none ${errors.excerpt ? inpErr : ""}`} value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="سطر واحد يظهر في بطاقات الأخبار ونتائج البحث…" />
          </Field>

          <Field label="نص الخبر" error={errors.body} hint={form.status === "منشور" ? "مطلوب للنشر · 40 حرفاً فأكثر" : undefined}>
            <textarea rows={8} className={`${inp} leading-7 ${errors.body ? inpErr : ""}`} value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="اكتب نص الخبر كاملاً… يمكنك استخدام فقرات منفصلة بسطر فارغ." />
          </Field>

          {editing && (
            <div className="flex items-center gap-3 rounded-xl bg-pine/4 px-4 py-3 text-[12.5px] text-fog">
              <Icon name="eye" size={16} className="text-brass-2" />
              <span>هذا الخبر سجّل <b className="font-mono text-ink/70">{editing.views.toLocaleString("en-US")}</b> مشاهدة منذ نشره.</span>
            </div>
          )}
        </div>
      </Drawer>

      <Confirm
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            db.deleteNews(toDelete.id);
            toast({ tone: "info", title: "حُذف الخبر", desc: `«${toDelete.title.slice(0, 45)}»` });
          }
        }}
        title="حذف الخبر"
        desc={toDelete ? `سيُحذف «${toDelete.title}» نهائياً من الموقع العام والأرشيف. لا يمكن التراجع عن هذه العملية.` : ""}
      />
    </div>
  );
}
