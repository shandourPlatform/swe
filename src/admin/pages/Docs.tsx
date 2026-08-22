import React, { useMemo, useRef, useState } from "react";
import { DOC_CATS, DocForm, fmtDate, useStore } from "../store";
import { Confirm, EmptyState, Field, Icon, Modal, btnBrass, btnGhost, btnPrimary, iconBtn, inp, inpErr, useToast } from "../ui";

export default function Docs() {
  const db = useStore();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DocForm | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // upload form
  const [name, setName] = useState("");
  const [catSel, setCatSel] = useState(DOC_CATS[0]);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [err, setErr] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  const filtered = useMemo(
    () => db.docs.filter((d) => (cat === "الكل" || d.category === cat) && (q.trim() === "" || d.name.includes(q.trim()))),
    [db.docs, q, cat]
  );
  const totalDl = db.docs.reduce((s, d) => s + d.downloads, 0);

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    const ok = f.name.toLowerCase().endsWith(".pdf");
    if (!ok) {
      setErr("يُسمح بملفات PDF فقط");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErr("حجم الملف يتجاوز الحد الأقصى (10MB)");
      return;
    }
    setErr("");
    setFileName(f.name);
    setFileSize(Math.max(0.1, f.size / (1024 * 1024)));
    if (!name) setName(f.name.replace(/\.pdf$/i, ""));
  };

  const startUpload = () => {
    if (name.trim().length < 4) { setErr("اكتب اسماً وصفياً للنموذج (4 أحرف على الأقل)"); return; }
    if (!fileName) { setErr("اختر ملف PDF أولاً"); return; }
    setErr("");
    setProgress(0);
    const iv = window.setInterval(() => {
      setProgress((p) => {
        const next = (p ?? 0) + 8 + Math.random() * 14;
        if (next >= 100) {
          window.clearInterval(iv);
          window.setTimeout(() => {
            db.addDoc({ name: name.trim(), category: catSel, size: Number(fileSize.toFixed(1)) });
            setUploadOpen(false);
            setProgress(null);
            setName(""); setFileName(""); setFileSize(0);
            toast({ tone: "ok", title: "اكتمل الرفع", desc: `«${name.trim()}» متاح الآن للتنزيل من الموقع العام` });
          }, 350);
          return 100;
        }
        return next;
      });
    }, 140);
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-pine">النماذج والملفات</h2>
          <p className="text-[13px] text-fog">{db.docs.length} نموذج · <span className="font-mono">{totalDl.toLocaleString("en-US")}</span> إجمالي التنزيلات</p>
        </div>
        <button className={`${btnBrass} ms-auto`} onClick={() => { setUploadOpen(true); setErr(""); }}>
          <Icon name="upload" size={16} /> رفع نموذج
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-ink/8 bg-card p-3">
        <div className="relative min-w-[220px] flex-1">
          <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-fog"><Icon name="search" size={15} /></span>
          <input className={`${inp} ps-9`} placeholder="ابحث باسم النموذج…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["الكل", ...DOC_CATS].map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                cat === c ? "bg-pine text-paper shadow" : "bg-pine/5 text-ink/60 hover:bg-pine/10"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="doc" title="لا توجد نماذج مطابقة" desc="جرّب كلمة بحث أخرى أو غيّر التصنيف المحدد."
          action={<button className={btnGhost} onClick={() => { setQ(""); setCat("الكل"); }}>مسح الفلاتر</button>} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-card">
          <table className="hidden w-full md:table">
            <thead>
              <tr className="border-b border-ink/8 bg-pine/3">
                {["النموذج", "التصنيف", "الحجم", "التنزيلات", "آخر تحديث", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-start text-[11.5px] font-bold tracking-wide text-fog">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="group border-b border-ink/5 transition-colors last:border-0 hover:bg-brass/6">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-rust/10 text-rust">
                        <Icon name="doc" size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-bold text-ink">{d.name}</p>
                        <p className="font-mono text-[11px] text-fog">PDF · {d.size} MB</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="rounded-md bg-pine/6 px-2 py-1 text-[11.5px] font-semibold text-pine">{d.category}</span></td>
                  <td className="px-4 py-3.5 font-mono text-[12.5px] text-ink/70">{d.size} MB</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[12.5px] font-semibold text-teal">
                      <Icon name="download" size={14} /> {d.downloads.toLocaleString("en-US")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-fog">{fmtDate(d.updated)}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-end gap-1.5 opacity-40 transition-opacity group-hover:opacity-100">
                      <button className={iconBtn} title="تنزيل"
                        onClick={() => { db.bumpDownload(d.id); toast({ tone: "info", title: "بدأ التنزيل", desc: d.name }); }}>
                        <Icon name="download" size={15} />
                      </button>
                      <button className={`${iconBtn} hover:!border-rust/50 hover:!bg-rust/8 hover:!text-rust`} title="حذف" onClick={() => setToDelete(d)}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divide-y divide-ink/6 md:hidden">
            {filtered.map((d) => (
              <div key={d.id} className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-rust/10 text-rust"><Icon name="doc" size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-ink">{d.name}</p>
                  <p className="text-[11.5px] text-fog">{d.category} · {d.size} MB · <span className="font-mono">{d.downloads}</span> تنزيل</p>
                </div>
                <button className={iconBtn} onClick={() => { db.bumpDownload(d.id); toast({ tone: "info", title: "بدأ التنزيل", desc: d.name }); }}><Icon name="download" size={15} /></button>
                <button className={`${iconBtn} hover:!text-rust`} onClick={() => setToDelete(d)}><Icon name="trash" size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* upload modal */}
      <Modal
        open={uploadOpen}
        onClose={() => progress === null && setUploadOpen(false)}
        title="رفع نموذج جديد"
        footer={
          progress === null ? (
            <>
              <button className={btnGhost} onClick={() => setUploadOpen(false)}>إلغاء</button>
              <button className={btnPrimary} onClick={startUpload}><Icon name="upload" size={16} /> بدء الرفع</button>
            </>
          ) : undefined
        }
      >
        {progress === null ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-all cursor-pointer ${
                fileName ? "border-moss/50 bg-moss/6" : "border-ink/15 bg-pine/2 hover:border-brass/60 hover:bg-brass/6"
              }`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${fileName ? "bg-moss/15 text-moss" : "bg-brass/15 text-brass-2"}`}>
                <Icon name={fileName ? "check" : "upload"} size={22} />
              </span>
              {fileName ? (
                <>
                  <p className="text-[13.5px] font-bold text-ink" dir="ltr">{fileName}</p>
                  <p className="font-mono text-[11.5px] text-fog">{fileSize.toFixed(1)} MB · انقر لاستبدال الملف</p>
                </>
              ) : (
                <>
                  <p className="text-[13.5px] font-bold text-ink">اسحب ملف PDF هنا أو انقر للاختيار</p>
                  <p className="text-[11.5px] text-fog">الحد الأقصى 10MB · صيغة PDF فقط</p>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])} />
            <Field label="اسم النموذج كما سيظهر للزوار" error={err && !err.includes("PDF") && !err.includes("حجم") ? err : undefined}>
              <input className={`${inp} ${err && !err.includes("PDF") && !err.includes("حجم") ? inpErr : ""}`} value={name} onChange={(e) => setName(e.target.value)}
                placeholder="مثال: الجدول الدراسي — الفصل الربيعي 2026" />
            </Field>
            <Field label="التصنيف" error={err && (err.includes("PDF") || err.includes("حجم")) ? err : undefined}>
              <select className={inp} value={catSel} onChange={(e) => setCatSel(e.target.value)}>
                {DOC_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <p className="flex items-start gap-2 rounded-lg bg-brass/10 px-3.5 py-2.5 text-[12px] leading-5 text-brass-2">
              <Icon name="shield" size={15} className="mt-0.5 flex-none" />
              يُفحص الملف تلقائياً (النوع والحجم) قبل الحفظ وفق سياسة الأمان المعتمدة.
            </p>
          </div>
        ) : (
          <div className="py-6 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/12 text-teal">
              <Icon name="upload" size={24} />
            </span>
            <p className="font-display text-[17px] font-bold text-pine">جارٍ رفع الملف…</p>
            <p className="mt-1 text-[12.5px] text-fog" dir="ltr">{fileName}</p>
            <div className="mx-auto mt-5 h-2 max-w-sm overflow-hidden rounded-full bg-ink/8">
              <div className="h-full rounded-full bg-gradient-to-l from-brass to-teal transition-all duration-150" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 font-mono text-[13px] font-semibold text-teal">{Math.min(100, Math.round(progress))}%</p>
          </div>
        )}
      </Modal>

      <Confirm
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            db.deleteDoc(toDelete.id);
            toast({ tone: "info", title: "حُذف النموذج", desc: `«${toDelete.name}» لم يعد متاحاً للتنزيل` });
          }
        }}
        title="حذف النموذج"
        desc={toDelete ? `سيُحذف «${toDelete.name}» (${toDelete.downloads} تنزيل سابق) نهائياً من الموقع العام.` : ""}
      />
    </div>
  );
}
