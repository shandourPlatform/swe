import { useEffect, useState } from "react";
import Cover from "./components/Cover";
import Assess from "./components/Assess";
import Sections from "./components/Sections";
import Issues from "./components/Issues";
import Plan from "./components/Plan";
import Final from "./components/Final";
import { IconPrint, IconStar8 } from "./lib";

const NAV = [
  { id: "verdict", label: "الحكم" },
  { id: "criteria", label: "المعايير" },
  { id: "sections", label: "الأقسام الـ19" },
  { id: "flags", label: "التحفظات" },
  { id: "strengths", label: "نقاط القوة" },
  { id: "plan", label: "الخطة الزمنية" },
  { id: "verdict-final", label: "القرار" },
];

function TopBar() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setScrolled(h.scrollTop > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="no-print fixed top-0 inset-x-0 z-50">
      {/* progress bar */}
      <div className="h-[3px] bg-pine-2">
        <div
          className="h-full bg-brass transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <nav
        className={`transition-all duration-500 border-b ${
          scrolled
            ? "bg-pine/95 border-brass/20 shadow-deep backdrop-blur-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-4">
          <a href="#top" className="flex items-center gap-2.5 text-brass-3 shrink-0 group">
            <IconStar8 size={22} className="group-hover:rotate-45 transition-transform duration-500" />
            <span className="font-display font-bold text-paper text-lg leading-none">
              تقييم <span className="text-brass-3">المقترح</span>
            </span>
          </a>
          <span className="hidden md:block font-mono text-[10px] text-paper/35 tracking-widest" dir="ltr">
            AU-EVAL-2026-014
          </span>
          <div className="flex-1" />
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`relative px-3 py-2 text-[13px] font-medium transition-colors duration-300 whitespace-nowrap ${
                  active === n.id ? "text-brass-3" : "text-paper/60 hover:text-paper"
                }`}
              >
                {n.label}
                <span
                  className={`absolute bottom-0.5 inset-x-3 h-[2px] bg-brass transition-transform duration-300 origin-center ${
                    active === n.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            ))}
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-brass/50 text-brass-3 px-3.5 py-2 text-[13px] font-semibold hover:bg-brass hover:text-pine transition-all duration-300 cursor-pointer shrink-0"
          >
            <IconPrint size={16} />
            <span className="hidden sm:inline">طباعة</span>
          </button>
        </div>
        {/* mobile nav strip */}
        <div className="lg:hidden border-t border-paper/8 bg-pine/95 backdrop-blur-sm overflow-x-auto">
          <div className="flex px-5">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  active === n.id
                    ? "text-brass-3 border-brass"
                    : "text-paper/55 border-transparent"
                }`}
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <div id="top" className="min-h-screen">
      <TopBar />
      <main>
        <Cover />
        <Assess />
        <Sections />
        <Issues />
        <Plan />
        <Final />
      </main>
    </div>
  );
}
