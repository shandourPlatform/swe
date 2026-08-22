import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";

/* ---------------- hooks ---------------- */

export function useInView<T extends HTMLElement>(
  threshold = 0.18
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}

export function useCountUp(target: number, run: boolean, decimals = 0, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return val.toFixed(decimals);
}

/* ---------------- reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------- icons (custom inline SVG) ---------------- */

type IP = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconStar8 = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M12 2.5l2.2 6.1 6.1 2.2-6.1 2.2L12 19.1l-2.2-6.1-6.1-2.2 6.1-2.2z" />
    <circle cx="12" cy="10.8" r="1.4" fill="currentColor" stroke="none" />
    <path d="M5 20.5h14" />
  </svg>
);

export const IconSeal = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3l1.9 1.9 2.7-.5.5 2.7L19 9l-1.9 1.9.5 2.7-2.7.5L12 16l-1.9-1.9-2.7.5.5-2.7L6 9l1.9-1.9-.5-2.7 2.7.5z" />
    <path d="M9 21l3-4 3 4" />
  </svg>
);

export const IconCheck = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);

export const IconAlert = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3.5L21.5 20h-19z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17.2" r="0.4" fill="currentColor" />
  </svg>
);

export const IconChevron = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
);

export const IconArrow = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </svg>
);

export const IconPrint = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M7 8V3.5h10V8" />
    <rect x="4" y="8" width="16" height="8" rx="1.5" />
    <path d="M7 13.5h10v7H7z" />
    <path d="M17 11h.5" />
  </svg>
);

export const IconScale = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M12 4v16M7 20h10" />
    <path d="M12 5.5L5.5 7.5M12 5.5l6.5 2" />
    <path d="M3 13.5l2.5-6 2.5 6a2.8 2.8 0 01-5 0zM16 13.5l2.5-6 2.5 6a2.8 2.8 0 01-5 0z" />
  </svg>
);

export const IconFlag = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M5.5 21V3.5" />
    <path d="M5.5 4.5c3.5-2 6.5 2 10 0v8c-3.5 2-6.5-2-10 0" />
  </svg>
);

export const IconGauge = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M4 15.5a8 8 0 1116 0" />
    <path d="M12 15.5l3.8-5" />
    <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconDoc = ({ size, ...p }: IP) => (
  <svg {...base(size)} {...p}>
    <path d="M6 3.5h8l4 4V20.5H6z" />
    <path d="M14 3.5v4h4" />
    <path d="M9 12h6M9 15.5h6" />
  </svg>
);

/* ---------------- atoms ---------------- */

export function ScoreChip({ score }: { score: number }) {
  const tone =
    score >= 4.2
      ? "text-moss bg-moss/10 border-moss/30"
      : score >= 3.5
      ? "text-brass-2 bg-brass/10 border-brass/40"
      : "text-rust bg-rust/10 border-rust/30";
  return (
    <span
      className={`tabular font-mono text-sm font-semibold border rounded px-2 py-0.5 ${tone}`}
      dir="ltr"
    >
      {score.toFixed(1)}
    </span>
  );
}

export function TagChip({ tag }: { tag: "قوة" | "جيد" | "تحفظ" }) {
  const tone =
    tag === "قوة"
      ? "bg-moss text-card"
      : tag === "جيد"
      ? "bg-brass text-pine"
      : "bg-rust text-card";
  return (
    <span className={`text-[11px] font-semibold rounded-sm px-2 py-0.5 ${tone}`}>
      {tag === "قوة" ? "موطن قوة" : tag === "جيد" ? "جيد" : "محل تحفظ"}
    </span>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-[11px] sm:text-xs tracking-[0.35em] font-medium ${
        dark ? "text-brass-3" : "text-brass-2"
      }`}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  index,
  eyebrow,
  title,
  desc,
  dark = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  desc?: string;
  dark?: boolean;
}) {
  return (
    <Reveal>
      <div className="flex items-end gap-5 mb-10 sm:mb-14">
        <div
          className={`font-mono text-5xl sm:text-7xl font-semibold leading-none select-none ${
            dark ? "text-brass/25" : "text-ink/10"
          }`}
          dir="ltr"
        >
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
          <h2
            className={`font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mt-2 ${
              dark ? "text-paper" : "text-ink"
            }`}
          >
            {title}
          </h2>
          <div className={`h-px mt-4 ${dark ? "bg-paper/15" : "bg-ink/15"}`} />
          {desc && (
            <p className={`mt-4 max-w-2xl leading-8 ${dark ? "text-paper/65" : "text-fog"}`}>
              {desc}
            </p>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function Stamp({
  text,
  tone = "rust",
  className = "",
}: {
  text: string;
  tone?: "rust" | "brass";
  className?: string;
}) {
  const color = tone === "rust" ? "border-rust/80 text-rust" : "border-brass/80 text-brass";
  return (
    <div
      className={`stamp-in inline-block border-[3px] border-double px-5 py-2.5 rounded-sm ${color} ${className}`}
    >
      <span className="font-display font-bold text-lg sm:text-xl tracking-wide whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
