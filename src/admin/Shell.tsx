import React, { useEffect, useMemo, useRef, useState } from "react";
import { fmtDate, relTime, useStore } from "./store";
import { Avatar, Icon, IconName, btnBrass, btnGhost, iconBtn, inp, inpErr, useToast } from "./ui";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import Docs from "./pages/Docs";
import Slides from "./pages/Slides";
import Messages from "./pages/Messages";
import Users from "./pages/Users";
import SettingsPage from "./pages/Settings";

export type PageId = "dash" | "news" | "docs" | "slides" | "msgs" | "users" | "settings";

const TITLES: Record<PageId, { t: string; d: string }> = {
  dash: { t: "لوحة القيادة", d: "نظرة شاملة على نشاط المنصة والمحتوى" },
  news: { t: "الأخبار والفعاليات", d: "إنشاء وتحرير ونشر الأخبار الرسمية" },
  docs: { t: "النماذج والملفات", d: "رفع وإدارة النماذج والمستندات المتاحة للتنزيل" },
  slides: { t: "السلايدر الرئيسي", d: "ترتيب شرائح الصفحة الأولى والتحكم في عرضها" },
  msgs: { t: "الرسائل الواردة", d: "صندوق استفسارات نموذج «اتصل بنا»" },
  users: { t: "المستخدمون والصلاحيات", d: "إدارة الحسابات وأدوار الوصول (RBAC)" },
  settings: { t: "الإعدادات العامة", d: "هوية الموقع وبيانات التواصل والتفضيلات" },
};

export function Emblem({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" aria-hidden="true">
      <rect x="10.5" y="10.5" width="27" height="27" rx="3" stroke="currentColor" strokeWidth="2" transform="rotate(45 24 24)" />
      <rect x="13.5" y="13.5" width="21" height="21" rx="2" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M16 30V21l8-5 8 5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 16v14M19.5 30v-6h9v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="24" cy="8.6" r="1.4" fill="currentColor" />
    </svg>
  );
}

/* ================= login ================= */
function Login() {
  const { login, settings } = useStore();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(0);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    window.setTimeout(() => {
      const ok = login(email, pass);
      setBusy(false);
      if (ok) {
        toast({ tone: "ok", title: "تم تسجيل الدخول", desc: "مرحباً بك في لوحة تحكم جامعة العاصمة الأهلية" });
      } else {
        setErr("بيانات الدخول غير صحيحة — استخدم بيانات العرض التجريبي أدناه");
        setShake((s) => s + 1);
      }
    }, 650);
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* brand panel */}
      <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-pine p-10 text-paper lg:flex">
        <div className="pattern-stars absolute inset-0 opacity-60" />
        <div className="glow-drift absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal/25 blur-3xl" />
        <div className="glow-drift absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-brass/15 blur-3xl" style={{ animationDelay: "-4s" }} />
        <div className="relative flex items-center gap-3.5 text-brass-3">
          <Emblem size={52} />
          <div>
            <p className="font-display text-[22px] font-bold leading-6 text-paper">جامعة العاصمة الأهلية</p>
            <p className="text-[12px] tracking-wide text-brass-3/80 font-mono">ALASSEMA UNIVERSITY · TRIPOLI</p>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="font-display text-[40px] font-bold leading-[1.35]">
            لوحة التحكم
            <span className="text-brass-3"> الداخلية</span>
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-paper/70">
            «{settings.tagline}» — من هنا تُدار الأخبار والنماذج والسلايدر ورسائل الزوار وصلاحيات المحررين.
          </p>
          <div className="mt-8 space-y-3.5">
            {[
              { ic: "shield" as IconName, t: "صلاحيات RBAC", d: "ستة أدوار محررين بمستويات وصول مضبوطة" },
              { ic: "news" as IconName, t: "نشر فوري", d: "أخبار وأرشيف ومسابقات بتصنيفات متعددة" },
              { ic: "chart" as IconName, t: "مؤشرات حية", d: "زيارات وتنزيلات ورسائل في مكان واحد" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3.5 rounded-xl border border-paper/10 bg-paper/5 px-4 py-3 transition-colors hover:border-brass/40 hover:bg-paper/10">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brass/15 text-brass-3">
                  <Icon name={f.ic} size={18} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold">{f.t}</p>
                  <p className="text-[12px] text-paper/55">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative font-mono text-[11.5px] text-paper/40">بوابة داخلية · الإصدار 1.0 · طرابلس — ليبيا</p>
      </aside>

      {/* form panel */}
      <main className="pattern-grid-light flex flex-1 items-center justify-center bg-paper px-5 py-10">
        <form onSubmit={submit} key={shake} className={`w-full max-w-md ${shake ? "shake" : ""}`}>
          <div className="mb-8 flex items-center gap-3 text-pine lg:hidden">
            <span className="text-brass-2"><Emblem size={46} /></span>
            <div>
              <p className="font-display text-[19px] font-bold leading-6">جامعة العاصمة الأهلية</p>
              <p className="font-mono text-[10.5px] text-fog">ALASSEMA UNIVERSITY</p>
            </div>
          </div>
          <p className="font-mono text-[12px] font-semibold tracking-wide text-brass-2">PORTAL / SIGN-IN</p>
          <h2 className="mt-2 font-display text-[32px] font-bold leading-tight text-pine">تسجيل الدخول</h2>
          <p className="mt-2 text-[14px] leading-6 text-fog">ادخل بحسابك الإداري للوصول إلى أدوات إدارة المحتوى.</p>

          <div className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-ink/80">البريد الإلكتروني المؤسسي</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-fog"><Icon name="mail" size={17} /></span>
                <input dir="ltr" className={`${inp} ps-10 text-left`} placeholder="name@au.edu.ly" value={email}
                  onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-ink/80">كلمة المرور</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 start-3.5 flex items-center text-fog"><Icon name="lock" size={17} /></span>
                <input dir="ltr" type="password" className={`${inp} ps-10 text-left ${err ? inpErr : ""}`} placeholder="••••••••" value={pass}
                  onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
              </div>
            </div>
            {err && (
              <div className="flex items-center gap-2 rounded-lg border border-rust/30 bg-rust/8 px-3.5 py-2.5 text-[13px] font-medium text-rust">
                <Icon name="warn" size={16} /> {err}
              </div>
            )}
            <div className="flex items-center justify-between text-[13px]">
              <label className="flex cursor-pointer items-center gap-2 text-ink/70">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#17705f]" />
                تذكرني على هذا الجهاز
              </label>
              <span className="cursor-pointer font-semibold text-teal hover:underline">نسيت كلمة المرور؟</span>
            </div>
            <button type="submit" disabled={busy || !email || !pass} className={`${btnBrass} w-full !py-3 text-[15px]`}>
              {busy ? (
                <>
                  <span className="slow-spin inline-block h-4 w-4 rounded-full border-2 border-pine/30 border-t-pine" style={{ animationDuration: "0.8s" }} />
                  جارٍ التحقق…
                </>
              ) : (
                <>
                  <Icon name="logout" size={17} className="rotate-180" />
                  دخول اللوحة
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setEmail("admin@au.edu.ly"); setPass("admin123"); setErr(""); }}
            className="mt-6 w-full rounded-xl border border-dashed border-brass/50 bg-brass/8 px-4 py-3 text-start transition-all hover:bg-brass/15 cursor-pointer"
          >
            <p className="flex items-center gap-2 text-[13px] font-bold text-brass-2">
              <Icon name="sparkle" size={15} />
              بيانات العرض التجريبي — انقر للتعبئة
            </p>
            <p className="mt-1 font-mono text-[12px] text-ink/60" dir="ltr">admin@au.edu.ly / admin123</p>
          </button>
          <p className="mt-5 text-center text-[12px] leading-5 text-fog">
            هذه منطقة محمية للمسؤولين والمحررين المصرّح لهم فقط.
            <br />
            للدعم الفني: <span dir="ltr" className="font-mono">info@au.edu.ly</span>
          </p>
        </form>
      </main>
    </div>
  );
}

/* ================= search overlay ================= */
function SearchOverlay({ open, onClose, go }: { open: boolean; onClose: () => void; go: (p: PageId) => void }) {
  const db = useStore();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setQ("");
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const results = useMemo(() => {
    const t = q.trim();
    if (!t) return null;
    const has = (s: string) => s.includes(t);
    return {
      news: db.news.filter((x) => has(x.title) || has(x.category)).slice(0, 5),
      docs: db.docs.filter((x) => has(x.name) || has(x.category)).slice(0, 5),
      msgs: db.messages.filter((x) => has(x.subject) || has(x.name)).slice(0, 4),
      users: db.users.filter((x) => has(x.name) || has(x.email)).slice(0, 4),
    };
  }, [q, db]);

  if (!open) return null;
  const total = results ? results.news.length + results.docs.length + results.msgs.length + results.users.length : 0;

  const Group = ({ label, icon, page, items, title }: { label: string; icon: IconName; page: PageId; items: { id: string; line: string; meta: string }[]; title: (s: string) => React.ReactNode }) =>
    items.length === 0 ? null : (
      <div>
        <p className="mb-1.5 px-1 font-mono text-[11px] font-semibold tracking-wide text-fog">{label}</p>
        <div className="overflow-hidden rounded-xl border border-ink/10">
          {items.map((it) => (
            <button key={it.id} onClick={() => { go(page); onClose(); }}
              className="group flex w-full items-center gap-3 border-b border-ink/6 bg-card px-3.5 py-2.5 text-start transition-colors last:border-0 hover:bg-brass/10 cursor-pointer">
              <span className="text-pine/45 group-hover:text-brass-2 transition-colors"><Icon name={icon} size={17} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-ink">{title(it.line)}</span>
                <span className="block truncate text-[11.5px] text-fog">{it.meta}</span>
              </span>
              <span className="text-fog opacity-0 transition-opacity group-hover:opacity-100"><Icon name="back" size={15} /></span>
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" dir="rtl">
      <div className="overlay-in absolute inset-0 bg-pine/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="modal-in relative w-full max-w-xl rounded-2xl border border-ink/10 bg-paper shadow-deep">
        <div className="flex items-center gap-3 border-b border-ink/8 px-4 py-3.5">
          <span className="text-brass-2"><Icon name="search" size={19} /></span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في الأخبار، النماذج، الرسائل، المستخدمين…"
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-fog/70"
          />
          <kbd className="rounded-md border border-ink/15 bg-card px-2 py-0.5 font-mono text-[11px] text-fog">Esc</kbd>
        </div>
        <div className="admin-scroll max-h-[52vh] space-y-4 overflow-y-auto p-4">
          {!results && (
            <p className="py-8 text-center text-[13.5px] text-fog">اكتب كلمة بحث — النتائج تُفلتر لحظياً عبر جميع الوحدات.</p>
          )}
          {results && total === 0 && (
            <p className="py-8 text-center text-[13.5px] text-fog">لا توجد نتائج مطابقة لـ «{q}».</p>
          )}
          {results && (
            <>
              <Group label="الأخبار" icon="news" page="news" items={results.news.map((x) => ({ id: x.id, line: x.title, meta: `${x.category} · ${fmtDate(x.date)}` }))} title={(s) => s} />
              <Group label="النماذج والملفات" icon="doc" page="docs" items={results.docs.map((x) => ({ id: x.id, line: x.name, meta: x.category }))} title={(s) => s} />
              <Group label="الرسائل" icon="mail" page="msgs" items={results.msgs.map((x) => ({ id: x.id, line: x.subject, meta: `${x.name} · ${relTime(x.date)}` }))} title={(s) => s} />
              <Group label="المستخدمون" icon="users" page="users" items={results.users.map((x) => ({ id: x.id, line: x.name, meta: x.role }))} title={(s) => s} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= shell ================= */
const NAV: { group: string; items: { id: PageId; label: string; icon: IconName }[] }[] = [
  { group: "نظرة عامة", items: [{ id: "dash", label: "لوحة القيادة", icon: "dashboard" }] },
  {
    group: "إدارة المحتوى",
    items: [
      { id: "news", label: "الأخبار والفعاليات", icon: "news" },
      { id: "docs", label: "النماذج والملفات", icon: "doc" },
      { id: "slides", label: "السلايدر الرئيسي", icon: "layers" },
    ],
  },
  { group: "التواصل", items: [{ id: "msgs", label: "الرسائل الواردة", icon: "inbox" }] },
  {
    group: "النظام",
    items: [
      { id: "users", label: "المستخدمون والصلاحيات", icon: "users" },
      { id: "settings", label: "الإعدادات العامة", icon: "gear" },
    ],
  },
];

export default function Shell() {
  const db = useStore();
  const toast = useToast();
  const [page, setPage] = useState<PageId>("dash");
  const [sideOpen, setSideOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [autoNew, setAutoNew] = useState(0);

  const unread = db.messages.filter((m) => !m.read).length;
  const newActs = db.activity.filter((a) => new Date(a.time) > new Date(db.lastBell));

  const go = (p: PageId) => {
    setPage(p);
    setSideOpen(false);
  };
  const goNewsNew = () => {
    setAutoNew((x) => x + 1);
    go("news");
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (!db.session) return <Login />;

  const badge = (id: PageId) =>
    id === "msgs" && unread > 0 ? (
      <span className="ms-auto rounded-full bg-brass px-2 py-0.5 font-mono text-[11px] font-bold text-pine">{unread}</span>
    ) : id === "news" ? (
      <span className="ms-auto font-mono text-[11px] text-paper/35">{db.news.length}</span>
    ) : id === "docs" ? (
      <span className="ms-auto font-mono text-[11px] text-paper/35">{db.docs.length}</span>
    ) : null;

  return (
    <div className="min-h-screen bg-paper" dir="rtl">
      {/* ===== sidebar ===== */}
      {sideOpen && <div className="fixed inset-0 z-40 bg-pine/50 backdrop-blur-[2px] lg:hidden" onClick={() => setSideOpen(false)} />}
      <aside
        className={`fixed inset-y-0 start-0 z-50 flex w-[264px] flex-col bg-pine text-paper transition-transform duration-300 lg:translate-x-0 ${
          sideOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="pattern-stars pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative flex items-center gap-3 border-b border-paper/10 px-5 py-5">
          <span className="text-brass-3"><Emblem size={42} /></span>
          <div className="min-w-0">
            <p className="truncate font-display text-[16.5px] font-bold leading-5">جامعة العاصمة الأهلية</p>
            <p className="font-mono text-[10px] tracking-widest text-brass-3/70">ADMIN CONSOLE</p>
          </div>
          <button className="ms-auto text-paper/50 hover:text-paper lg:hidden cursor-pointer" onClick={() => setSideOpen(false)} aria-label="إغلاق القائمة">
            <Icon name="close" size={18} />
          </button>
        </div>

        <nav className="admin-scroll-dark relative flex-1 overflow-y-auto px-3.5 py-5">
          {NAV.map((g) => (
            <div key={g.group} className="mb-5">
              <p className="mb-2 px-2.5 font-mono text-[10.5px] font-semibold tracking-wide text-paper/35">{g.group}</p>
              <div className="space-y-1">
                {g.items.map((it) => {
                  const active = page === it.id;
                  return (
                    <button
                      key={it.id}
                      onClick={() => go(it.id)}
                      className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${
                        active ? "bg-brass text-pine shadow-[0_8px_20px_-10px_rgba(193,154,75,0.7)]" : "text-paper/65 hover:bg-paper/8 hover:text-paper"
                      }`}
                    >
                      <Icon name={it.icon} size={18} className={active ? "" : "text-brass-3/70 group-hover:text-brass-3 transition-colors"} />
                      <span>{it.label}</span>
                      {badge(it.id)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative border-t border-paper/10 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-paper/6 p-3">
            <Avatar name={db.session.name} tone={0} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold">{db.session.name}</p>
              <p className="truncate text-[11px] text-brass-3/80">{db.session.role}</p>
            </div>
            <button
              onClick={() => { db.logout(); toast({ tone: "info", title: "تم تسجيل الخروج", desc: "نراك قريباً" }); }}
              className="text-paper/45 transition-colors hover:text-brass-3 cursor-pointer"
              title="تسجيل الخروج"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[10.5px] text-paper/35">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-moss" />
            متصلة · v1.0 · MySQL
          </p>
        </div>
      </aside>

      {/* ===== main ===== */}
      <div className="lg:ps-[264px]">
        {/* topbar */}
        <header className="sticky top-0 z-30 border-b border-ink/8 bg-paper/88 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-7">
            <button className={`${iconBtn} lg:hidden`} onClick={() => setSideOpen(true)} aria-label="فتح القائمة">
              <Icon name="burger" size={18} />
            </button>
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] tracking-wide text-fog">الرئيسية / {TITLES[page].t}</p>
              <h1 className="truncate font-display text-[19px] font-bold leading-6 text-pine">{TITLES[page].t}</h1>
            </div>
            <div className="ms-auto flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden items-center gap-2.5 rounded-lg border border-ink/12 bg-card px-3.5 py-2 text-[13px] text-fog transition-all hover:border-brass/50 hover:text-ink sm:flex cursor-pointer"
              >
                <Icon name="search" size={15} />
                بحث سريع…
                <kbd className="rounded border border-ink/12 bg-paper px-1.5 font-mono text-[10.5px]">Ctrl K</kbd>
              </button>
              <button className={`${iconBtn} sm:hidden`} onClick={() => setSearchOpen(true)} aria-label="بحث">
                <Icon name="search" size={17} />
              </button>

              <div className="relative">
                <button
                  className={`${iconBtn} relative`}
                  onClick={() => { setBellOpen((b) => !b); db.markBellSeen(); }}
                  aria-label="الإشعارات"
                >
                  <Icon name="bell" size={17} />
                  {newActs.length > 0 && (
                    <span className="absolute -top-1 -left-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rust px-1 font-mono text-[10px] font-bold text-paper">
                      {newActs.length}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
                    <div className="modal-in absolute left-0 z-50 mt-2 w-[320px] overflow-hidden rounded-xl border border-ink/10 bg-card shadow-deep">
                      <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
                        <p className="text-[13.5px] font-bold text-pine">آخر النشاطات</p>
                        <span className="font-mono text-[11px] text-fog">{db.activity.length} عملية</span>
                      </div>
                      <div className="admin-scroll max-h-72 overflow-y-auto">
                        {db.activity.slice(0, 7).map((a) => (
                          <div key={a.id} className="flex items-start gap-3 border-b border-ink/5 px-4 py-2.5 last:border-0">
                            <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${new Date(a.time) > new Date(db.lastBell) ? "bg-brass-2" : "bg-ink/15"}`} />
                            <div className="min-w-0">
                              <p className="text-[12.5px] font-medium leading-5 text-ink">{a.text}</p>
                              <p className="text-[11px] text-fog">{a.actor} · {relTime(a.time)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {db.settings.maintenance && (
            <div className="flex items-center justify-center gap-2 bg-brass-2 px-4 py-1.5 text-[12.5px] font-bold text-pine">
              <Icon name="warn" size={15} />
              وضع الصيانة مفعّل — الموقع العام غير متاح للزوار حالياً
            </div>
          )}
        </header>

        <main className="admin-scroll px-4 py-6 lg:px-7 lg:py-7">
          {page === "dash" && <Dashboard go={go} goNewsNew={goNewsNew} />}
          {page === "news" && <News autoNew={autoNew} />}
          {page === "docs" && <Docs />}
          {page === "slides" && <Slides />}
          {page === "msgs" && <Messages />}
          {page === "users" && <Users />}
          {page === "settings" && <SettingsPage />}
        </main>

        <footer className="border-t border-ink/8 px-4 py-4 lg:px-7">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-fog">
            <span className="font-semibold text-ink/60">© 2026 جامعة العاصمة الأهلية</span>
            <span>طرابلس – ليبيا · طريق الدعوة الإسلامية</span>
            <span dir="ltr" className="font-mono">info@au.edu.ly</span>
            <span className="ms-auto font-mono">بوابة داخلية — إصدار 1.0</span>
          </p>
        </footer>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} go={go} />
    </div>
  );
}
