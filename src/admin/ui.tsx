import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { NewsStatus, uid } from "./store";

/* ================= custom inline icons ================= */
const P = {
  dashboard: (<><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></>),
  news: (<><path d="M4 4h13v16H6a2 2 0 0 1-2-2V4z" /><path d="M17 8h3v10a2 2 0 0 1-2 2h-1" /><path d="M7.5 8.5h6M7.5 12h6M7.5 15.5h4" /></>),
  doc: (<><path d="M6 2.5h8l4.5 4.5v14.5H6z" /><path d="M14 2.5V7h4.5" /><path d="M9 12h6M9 15.5h6" /></>),
  layers: (<><path d="M12 2.5 2.5 7.5 12 12.5l9.5-5L12 2.5z" /><path d="m2.5 12.5 9.5 5 9.5-5" /><path d="m2.5 17 9.5 5 9.5-5" /></>),
  inbox: (<><path d="M21.5 13.5V19a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 19v-5.5" /><path d="M5 3.5h14l2.5 10H15l-1.5 2.5h-3L9 13.5H2.5z" /></>),
  users: (<><circle cx="9" cy="7.5" r="3.75" /><path d="M2.5 20.5v-.75a6.5 6.5 0 0 1 13 0v.75" /><path d="M16 4.2a3.75 3.75 0 0 1 0 6.6" /><path d="M17.8 14.6a6.5 6.5 0 0 1 3.7 5.9" /></>),
  gear: (<><circle cx="12" cy="12" r="3.4" /><path d="M12 2.5v2.7M12 18.8v2.7M2.5 12h2.7M18.8 12h2.7M5.2 5.2 7 7M17 17l1.8 1.8M18.8 5.2 17 7M7 17l-1.8 1.8" /></>),
  search: (<><circle cx="10.8" cy="10.8" r="7" /><path d="m21 21-4.8-4.8" /></>),
  bell: (<><path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 8-2.5 8h17s-2.5-1.5-2.5-8" /><path d="M10.2 20.5a2 2 0 0 0 3.6 0" /></>),
  plus: (<path d="M12 5v14M5 12h14" />),
  pen: (<><path d="M16.8 3.3 20.7 7.2 7.5 20.4H3.6v-3.9L16.8 3.3z" /><path d="m14.5 5.6 3.9 3.9" /></>),
  trash: (<><path d="M3.5 6h17" /><path d="M8.5 6V3.8h7V6" /><path d="m19 6-.9 14.2H5.9L5 6" /><path d="M10 10.5v6M14 10.5v6" /></>),
  eye: (<><path d="M2.5 12S6 5.2 12 5.2 21.5 12 21.5 12 18 18.8 12 18.8 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>),
  chevUp: (<path d="m6 14.5 6-6 6 6" />),
  chevDown: (<path d="m6 9.5 6 6 6-6" />),
  close: (<path d="M17.5 6.5l-11 11M6.5 6.5l11 11" />),
  check: (<path d="M20 6.5 9.2 17.3 4 12.2" />),
  warn: (<><path d="M12 3.2 1.9 20.8h20.2L12 3.2z" /><path d="M12 9.8v4.7" /><path d="M12 17.6v.4" /></>),
  upload: (<><path d="M12 15.5v-11" /><path d="m6.5 9.5 5.5-5.5 5.5 5.5" /><path d="M4 20h16" /></>),
  download: (<><path d="M12 4.5v11" /><path d="m6.5 10.5 5.5 5.5 5.5-5.5" /><path d="M4 20h16" /></>),
  clock: (<><circle cx="12" cy="12" r="8.8" /><path d="M12 7v5.2l3.4 2" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10.5h18" /></>),
  logout: (<><path d="M9.5 21H5.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m15.5 16.5 4.5-4.5-4.5-4.5" /><path d="M20 12H9.5" /></>),
  burger: (<path d="M3.5 6h17M3.5 12h17M3.5 18h17" />),
  star: (<path d="m12 2.5 2.9 6 6.6 1-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-1z" />),
  mail: (<><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m2.5 7 9.5 6.5L21.5 7" /></>),
  pin: (<><path d="M20 10.2c0 5.8-8 11.8-8 11.8s-8-6-8-11.8a8 8 0 0 1 16 0z" /><circle cx="12" cy="10.2" r="3" /></>),
  globe: (<><circle cx="12" cy="12" r="8.8" /><path d="M3.2 12h17.6" /><path d="M12 3.2c2.4 2.4 3.8 5.4 3.8 8.8s-1.4 6.4-3.8 8.8c-2.4-2.4-3.8-5.4-3.8-8.8s1.4-6.4 3.8-8.8z" /></>),
  send: (<><path d="M21.5 2.5 11 13" /><path d="M21.5 2.5 14.5 21.5l-3.5-8.5-8.5-3.5z" /></>),
  back: (<path d="m9.5 6 6 6-6 6" />),
  shield: (<path d="M12 2.5 20 5.5v6c0 4.8-3.4 8.3-8 10.5-4.6-2.2-8-5.7-8-10.5v-6z" />),
  chart: (<><path d="M3.5 3.5v17h17" /><path d="M8.5 16.5v-7M13 16.5V5.5M17.5 16.5v-9.5" /></>),
  refresh: (<><path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9l2.4 2.4" /><path d="M20.5 3.5V8.5h-5" /><path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9l-2.4-2.4" /><path d="M3.5 20.5v-5h5" /></>),
  lock: (<><rect x="5" y="10.5" width="14" height="10.5" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>),
  external: (<><path d="M18 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5.5" /><path d="M14.5 3h6.5v6.5" /><path d="M10.5 13.5 21 3" /></>),
  sparkle: (<path d="M12 2.8c.7 4.6 2.6 6.5 7.2 7.2-4.6.7-6.5 2.6-7.2 7.2-.7-4.6-2.6-6.5-7.2-7.2 4.6-.7 6.5-2.6 7.2-7.2z" />),
  arrowCta: (<path d="M4 12h15M13.5 6l6 6-6 6" />),
} as const;

export type IconName = keyof typeof P;
export function Icon({ name, size = 18, className = "", sw = 1.7 }: { name: IconName; size?: number; className?: string; sw?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name]}
    </svg>
  );
}

/* ================= class recipes ================= */
export const inp =
  "w-full rounded-lg border border-ink/15 bg-card px-3.5 py-2.5 text-[14px] text-ink placeholder:text-fog/70 transition-all focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/25";
export const inpErr = "border-rust/60 focus:border-rust focus:ring-rust/20";
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-45 disabled:pointer-events-none cursor-pointer";
export const btnPrimary = `${btn} bg-pine text-paper hover:bg-pine-3 shadow-[0_6px_18px_-8px_rgba(13,31,26,0.5)]`;
export const btnBrass = `${btn} bg-brass text-pine hover:bg-brass-3 shadow-[0_6px_18px_-8px_rgba(193,154,75,0.6)]`;
export const btnGhost = `${btn} border border-ink/15 bg-transparent text-ink hover:bg-ink/5`;
export const btnDanger = `${btn} bg-rust text-paper hover:bg-[#93391f]`;
export const iconBtn =
  "inline-flex items-center justify-center w-9 h-9 rounded-lg border border-ink/12 text-ink/60 bg-card transition-all hover:text-pine hover:border-brass/60 hover:bg-brass/10 active:scale-90 cursor-pointer";

/* ================= motion ================= */
export function useInView<T extends HTMLElement>(thresh = 0.12) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setInView(true);
          ob.disconnect();
        }
      },
      { threshold: thresh, rootMargin: "0px 0px -24px 0px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [thresh]);
  return { ref, inView };
}

export function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(22px)",
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function CountUp({ to, dur = 1100, className = "" }: { to: number; dur?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, dur]);
  return (
    <span ref={ref} className={`tabular font-mono ${className}`}>
      {v.toLocaleString("en-US")}
    </span>
  );
}

/* ================= toasts ================= */
interface Toast {
  id: string;
  title: string;
  desc?: string;
  tone: "ok" | "err" | "info";
}
const ToastCtx = createContext<(t: Omit<Toast, "id">) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = (t: Omit<Toast, "id">) => {
    const id = uid();
    setList((l) => [...l.slice(-3), { ...t, id }]);
    window.setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 3500);
  };
  const tone = {
    ok: { bar: "bg-moss", ic: "check" as IconName, ring: "text-moss" },
    err: { bar: "bg-rust", ic: "warn" as IconName, ring: "text-rust" },
    info: { bar: "bg-brass", ic: "sparkle" as IconName, ring: "text-brass-2" },
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 left-4 z-[90] flex w-[min(340px,calc(100vw-2rem))] flex-col gap-2 no-print" dir="rtl">
        {list.map((t) => {
          const s = tone[t.tone];
          return (
            <div key={t.id} className="modal-in relative overflow-hidden rounded-xl border border-ink/10 bg-pine text-paper shadow-deep">
              <div className="flex items-start gap-3 px-4 py-3.5">
                <span className={`mt-0.5 ${s.ring}`}>
                  <Icon name={s.ic} size={19} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold leading-5">{t.title}</p>
                  {t.desc && <p className="mt-0.5 text-[12.5px] text-paper/65 leading-5">{t.desc}</p>}
                </div>
                <button
                  onClick={() => setList((l) => l.filter((x) => x.id !== t.id))}
                  className="text-paper/50 hover:text-paper transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <Icon name="close" size={15} />
                </button>
              </div>
              <div className={`toast-bar h-[3px] ${s.bar}`} />
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

/* ================= overlays ================= */
export function Modal({ open, onClose, title, children, width = "max-w-lg", footer }: {
  open: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; width?: string; footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" dir="rtl">
      <div className="overlay-in absolute inset-0 bg-pine/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`modal-in relative w-full ${width} rounded-2xl border border-ink/10 bg-card shadow-deep max-h-[88vh] flex flex-col`}>
        <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
          <h3 className="font-display text-[17px] font-bold text-pine">{title}</h3>
          <button onClick={onClose} className={iconBtn} aria-label="إغلاق">
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="admin-scroll overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2.5 border-t border-ink/8 px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

export function Confirm({ open, onClose, onConfirm, title, desc }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; desc: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width="max-w-md"
      footer={
        <>
          <button className={btnGhost} onClick={onClose}>تراجع</button>
          <button
            className={btnDanger}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <Icon name="trash" size={16} />
            تأكيد الحذف
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-rust/12 text-rust">
          <Icon name="warn" size={21} />
        </span>
        <p className="text-[14px] leading-6 text-ink/75">{desc}</p>
      </div>
    </Modal>
  );
}

export function Drawer({ open, onClose, title, subtitle, children, footer }: {
  open: boolean; onClose: () => void; title: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]" dir="rtl">
      <div className="overlay-in absolute inset-0 bg-pine/55 backdrop-blur-[2px]" onClick={onClose} />
      <div className="drawer-in absolute inset-y-0 left-0 flex w-full max-w-2xl flex-col border-e border-ink/10 bg-paper shadow-deep">
        <div className="flex items-start justify-between border-b border-ink/8 bg-card px-6 py-4.5">
          <div>
            <h3 className="font-display text-[19px] font-bold text-pine">{title}</h3>
            {subtitle && <p className="mt-0.5 text-[12.5px] text-fog">{subtitle}</p>}
          </div>
          <button onClick={onClose} className={iconBtn} aria-label="إغلاق">
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="admin-scroll flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2.5 border-t border-ink/8 bg-card px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ================= form bits ================= */
export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-[13px] font-semibold text-ink/80">{label}</label>
        {hint && <span className="text-[11.5px] text-fog font-mono tabular">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-rust">
          <Icon name="warn" size={13} />
          {error}
        </p>
      )}
    </div>
  );
}

export function Toggle({ on, onChange, sm = false, disabled = false }: { on: boolean; onChange: (v: boolean) => void; sm?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`switch ${sm ? "sm" : ""} ${on ? "on" : ""} ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    />
  );
}

const statusStyle: Record<NewsStatus, string> = {
  "منشور": "bg-moss/12 text-[#2b6a4c] border-moss/30",
  "مسودة": "bg-brass/15 text-brass-2 border-brass/35",
  "مؤرشف": "bg-fog/12 text-fog border-fog/25",
};
export function StatusPill({ s }: { s: NewsStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold ${statusStyle[s]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s === "منشور" ? "bg-moss" : s === "مسودة" ? "bg-brass-2" : "bg-fog"}`} />
      {s}
    </span>
  );
}

export function EmptyState({ icon = "search", title, desc, action }: { icon?: IconName; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 bg-card/50 px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pine/5 text-pine/40">
        <Icon name={icon} size={26} />
      </span>
      <h4 className="font-display text-[17px] font-bold text-pine">{title}</h4>
      <p className="mt-1 max-w-sm text-[13.5px] leading-6 text-fog">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Avatar({ name, tone = 0 }: { name: string; tone?: number }) {
  const parts = name.replace(/^(أ\.|د\.|م\.)\s*/, "").split(" ");
  const ini = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  const tones = ["bg-pine text-brass-3", "bg-teal text-paper", "bg-clay text-paper", "bg-brass-2 text-pine"];
  return (
    <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl text-[12px] font-bold ${tones[tone % tones.length]}`}>
      {ini}
    </span>
  );
}
