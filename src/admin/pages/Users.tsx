import React, { useState } from "react";
import { ROLES, User, relTime, useStore } from "../store";
import { Avatar, Confirm, Field, Icon, IconName, Modal, Toggle, btnBrass, btnGhost, btnPrimary, iconBtn, inp, inpErr, useToast } from "../ui";

const ROLE_DESC: Record<string, { ic: IconName; d: string }> = {
  "مدير النظام": { ic: "shield", d: "كل الصلاحيات — المستخدمون، الإعدادات، والمحتوى كاملاً" },
  "محرر أخبار عامة": { ic: "news", d: "نشر وتعديل الأخبار العامة فقط" },
  "محرر إداري": { ic: "gear", d: "نشر أخبار الإدارات والمكاتب" },
  "محرر أقسام": { ic: "doc", d: "نشر أخبار القسم الخاص به فقط" },
  "مسؤول نماذج": { ic: "upload", d: "رفع وإدارة النماذج والملفات" },
  "مشاهد": { ic: "eye", d: "قراءة فقط دون أي تعديل" },
};

export default function Users() {
  const db = useStore();
  const toast = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[1]);
  const [errs, setErrs] = useState<{ name?: string; email?: string }>({});

  const isMe = (u: User) => u.name === db.session?.name;

  const submit = () => {
    const e: typeof errs = {};
    if (name.trim().length < 5) e.name = "الاسم الكامل مطلوب (5 أحرف فأكثر)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "أدخل بريداً مؤسسياً صحيحاً";
    if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) e.email = "هذا البريد مسجّل بالفعل";
    setErrs(e);
    if (Object.keys(e).length) return;
    db.addUser({ name: name.trim(), email: email.trim().toLowerCase(), role });
    toast({ tone: "ok", title: "أُنشئ الحساب", desc: `${name.trim()} — ${role} (كلمة مرور مؤقتة أُرسلت لبريده)` });
    setAddOpen(false);
    setName(""); setEmail(""); setRole(ROLES[1]); setErrs({});
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-pine">المستخدمون والصلاحيات</h2>
          <p className="text-[13px] text-fog">{db.users.length} حساب · {db.users.filter((u) => u.active).length} نشط · نظام أدوار (RBAC)</p>
        </div>
        <button className={`${btnBrass} ms-auto`} onClick={() => setAddOpen(true)}>
          <Icon name="plus" size={16} /> مستخدم جديد
        </button>
      </div>

      {/* users table */}
      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-card">
        <table className="hidden w-full md:table">
          <thead>
            <tr className="border-b border-ink/8 bg-pine/3">
              {["المستخدم", "الدور (RBAC)", "آخر نشاط", "مفعّل", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-start text-[11.5px] font-bold tracking-wide text-fog">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {db.users.map((u) => (
              <tr key={u.id} className={`border-b border-ink/5 transition-colors last:border-0 hover:bg-brass/6 ${u.active ? "" : "opacity-55"}`}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} tone={u.id.length % 4} />
                    <div>
                      <p className="flex items-center gap-2 text-[13.5px] font-bold text-ink">
                        {u.name}
                        {isMe(u) && <span className="rounded-full bg-teal/12 px-2 py-0.5 text-[10px] font-bold text-teal">أنت</span>}
                      </p>
                      <p dir="ltr" className="text-start font-mono text-[11px] text-fog">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <select
                    value={u.role}
                    disabled={isMe(u)}
                    onChange={(e) => {
                      db.updateUser(u.id, { role: e.target.value });
                      toast({ tone: "info", title: "تغيّر الدور", desc: `${u.name} أصبح «${e.target.value}»` });
                    }}
                    className="cursor-pointer rounded-lg border border-ink/12 bg-paper px-2.5 py-1.5 text-[12.5px] font-semibold outline-none transition-colors hover:border-brass/60 focus:border-brass disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-[12.5px] text-fog">{relTime(u.lastActive)}</td>
                <td className="px-4 py-3.5">
                  <Toggle
                    on={u.active}
                    disabled={isMe(u)}
                    onChange={(v) => {
                      db.updateUser(u.id, { active: v });
                      toast({ tone: v ? "ok" : "info", title: v ? "فُعّل الحساب" : "عُلّق الحساب", desc: u.name });
                    }}
                  />
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex justify-end">
                    {isMe(u) ? (
                      <span className="flex items-center gap-1.5 text-[11.5px] text-fog"><Icon name="lock" size={13} /> محمي</span>
                    ) : (
                      <button className={`${iconBtn} hover:!border-rust/50 hover:!bg-rust/8 hover:!text-rust`} onClick={() => setToDelete(u)} title="حذف">
                        <Icon name="trash" size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* mobile cards */}
        <div className="divide-y divide-ink/6 md:hidden">
          {db.users.map((u) => (
            <div key={u.id} className={`p-4 ${u.active ? "" : "opacity-55"}`}>
              <div className="flex items-center gap-3">
                <Avatar name={u.name} tone={u.id.length % 4} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold text-ink">{u.name} {isMe(u) && <span className="text-[10px] font-bold text-teal">(أنت)</span>}</p>
                  <p className="font-mono text-[11px] text-fog">{u.email}</p>
                </div>
                {!isMe(u) && <button className={`${iconBtn} hover:!text-rust`} onClick={() => setToDelete(u)}><Icon name="trash" size={15} /></button>}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <select value={u.role} disabled={isMe(u)}
                  onChange={(e) => { db.updateUser(u.id, { role: e.target.value }); toast({ tone: "info", title: "تغيّر الدور", desc: u.name }); }}
                  className="rounded-lg border border-ink/12 bg-paper px-2.5 py-1.5 text-[12px] font-semibold disabled:opacity-60">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <Toggle on={u.active} disabled={isMe(u)} onChange={(v) => { db.updateUser(u.id, { active: v }); }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC matrix */}
      <div className="rounded-2xl border border-ink/8 bg-card p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pine text-brass-3"><Icon name="shield" size={17} /></span>
          <div>
            <h3 className="font-display text-[16.5px] font-bold leading-5 text-pine">مصفوفة الصلاحيات المعتمدة</h3>
            <p className="text-[12px] text-fog">وفق سياسة الوصول القائمة على الأدوار (RBAC) — التغيير يسري فوراً</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r} className="group rounded-xl border border-ink/8 bg-paper/70 p-4 transition-all hover:-translate-y-0.5 hover:border-brass/45">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass/15 text-brass-2"><Icon name={ROLE_DESC[r].ic} size={15} /></span>
                <p className="text-[13.5px] font-bold text-ink">{r}</p>
                <span className="ms-auto font-mono text-[11px] text-fog">{db.users.filter((u) => u.role === r).length}</span>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-fog">{ROLE_DESC[r].d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* add modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="إضافة مستخدم جديد"
        footer={
          <>
            <button className={btnGhost} onClick={() => setAddOpen(false)}>إلغاء</button>
            <button className={btnPrimary} onClick={submit}><Icon name="check" size={16} /> إنشاء الحساب</button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="الاسم الكامل" error={errs.name}>
            <input className={`${inp} ${errs.name ? inpErr : ""}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أ. فاطمة السنوسي" />
          </Field>
          <Field label="البريد المؤسسي" error={errs.email}>
            <input dir="ltr" className={`${inp} text-left ${errs.email ? inpErr : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@au.edu.ly" />
          </Field>
          <Field label="الدور الوظيفي">
            <select className={inp} value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <p className="rounded-xl bg-brass/10 px-4 py-3 text-[12px] leading-6 text-brass-2">
            <b>الصلاحيات:</b> {ROLE_DESC[role].d}. سيصل المستخدمَ بريد تفعيل برابط تعيين كلمة مرور خلال دقائق.
          </p>
        </div>
      </Modal>

      <Confirm
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            db.deleteUser(toDelete.id);
            toast({ tone: "info", title: "حُذف الحساب", desc: `${toDelete.name} — ${toDelete.role}` });
          }
        }}
        title="حذف المستخدم"
        desc={toDelete ? `سيفقد «${toDelete.name}» (${toDelete.role}) الوصول إلى لوحة التحكم فوراً.` : ""}
      />
    </div>
  );
}
