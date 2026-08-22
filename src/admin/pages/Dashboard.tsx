import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { NEWS_CATS, fmtDate, relTime, useStore } from "../store";
import { CountUp, FadeUp, Icon, IconName, btnBrass, btnGhost, btnPrimary, inp, useToast } from "../ui";
import type { PageId } from "../Shell";

const ACT: Record<string, { ic: IconName; cls: string }> = {
  add: { ic: "plus", cls: "bg-moss/12 text-moss" },
  edit: { ic: "pen", cls: "bg-teal/12 text-teal" },
  delete: { ic: "trash", cls: "bg-rust/12 text-rust" },
  status: { ic: "eye", cls: "bg-brass/15 text-brass-2" },
  upload: { ic: "upload", cls: "bg-teal/12 text-teal" },
  auth: { ic: "lock", cls: "bg-fog/12 text-fog" },
  settings: { ic: "gear", cls: "bg-fog/12 text-fog" },
  msg: { ic: "mail", cls: "bg-teal/12 text-teal" },
};

const tooltipStyle = {
  fontFamily: "IBM Plex Sans Arabic, sans-serif",
  direction: "rtl" as const,
  borderRadius: 10,
  border: "1px solid rgba(22,33,29,0.12)",
  background: "#fbfbf7",
  fontSize: 12.5,
  boxShadow: "0 12px 30px -14px rgba(13,31,26,0.4)",
};

export default function Dashboard({ go, goNewsNew }: { go: (p: PageId) => void; goNewsNew: () => void }) {
  const db = useStore();
  const toast = useToast();
  const [draftTitle, setDraftTitle] = useState("");
  const [draftCat, setDraftCat] = useState(NEWS_CATS[0]);

  const published = db.news.filter((n) => n.status === "منشور").length;
  const drafts = db.news.filter((n) => n.status === "مسودة").length;
  const archived = db.news.filter((n) => n.status === "مؤرشف").length;
  const unread = db.messages.filter((m) => !m.read).length;
  const totalDl = db.docs.reduce((s, d) => s + d.downloads, 0);
  const activeUsers = db.users.filter((u) => u.active).length;
  const totalVisits = db.visits.reduce((s, v) => s + v.z, 0);
  const donut = [
    { name: "منشور", value: published, color: "#3e7d5c" },
    { name: "مسودة", value: drafts, color: "#c19a4b" },
    { name: "مؤرشف", value: archived, color: "#9aa7a0" },
  ];
  const topDocs = [...db.docs].sort((a, b) => b.downloads - a.downloads).slice(0, 5);
  const maxDl = topDocs[0]?.downloads ?? 1;

  const kpis = [
    { label: "أخبار منشورة", value: published, sub: `من أصل ${db.news.length} خبر`, ic: "news" as IconName, cls: "bg-pine text-brass-3", page: "news" as PageId },
    { label: "تنزيلات النماذج", value: totalDl, sub: `${db.docs.length} نموذج متاح`, ic: "download" as IconName, cls: "bg-teal text-paper", page: "docs" as PageId },
    { label: "رسائل غير مقروءة", value: unread, sub: `${db.messages.length} رسالة إجمالاً`, ic: "inbox" as IconName, cls: unread > 0 ? "bg-brass-2 text-pine" : "bg-fog/70 text-paper", page: "msgs" as PageId },
    { label: "مستخدمون نشطون", value: activeUsers, sub: `${db.users.length} حساب في النظام`, ic: "users" as IconName, cls: "bg-clay text-paper", page: "users" as PageId },
  ];

  const saveDraft = () => {
    if (draftTitle.trim().length < 8) {
      toast({ tone: "err", title: "العنوان قصير جداً", desc: "اكتب عنواناً لا يقل عن 8 أحرف لحفظ المسودة" });
      return;
    }
    db.addNews({ title: draftTitle.trim(), category: draftCat, excerpt: "أكمل تحرير الخبر من صفحة الأخبار قبل النشر…", body: "", author: db.session?.name ?? "", status: "مسودة", tone: db.news.length % 5 });
    setDraftTitle("");
    toast({ tone: "ok", title: "حُفظت المسودة", desc: "يمكنك فتحها من صفحة الأخبار لإكمال التحرير" });
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      {/* greeting strip */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl bg-pine p-6 text-paper lg:p-7">
          <div className="pattern-stars absolute inset-0 opacity-50" />
          <div className="glow-drift absolute -left-16 -top-20 h-64 w-64 rounded-full bg-brass/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11.5px] tracking-wide text-brass-3/80">{fmtDate(new Date().toISOString())} · يوم عمل</p>
              <h2 className="mt-1 font-display text-[26px] font-bold leading-8">
                أهلاً {db.session?.name ?? ""} <span className="text-brass-3">— هذه خلاصة اليوم</span>
              </h2>
              <p className="mt-1.5 max-w-xl text-[13.5px] leading-6 text-paper/65">
                {unread > 0 ? `لديك ${unread} رسالة بانتظار الرد، و` : ""}{drafts > 0 ? `${drafts} مسودة خبر تحتاج مراجعة قبل النشر.` : "لا مسودات عالقة — المحتوى محدّث بالكامل."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button className={btnBrass} onClick={goNewsNew}>
                <Icon name="plus" size={16} /> خبر جديد
              </button>
              <button className={`${btnGhost} !border-paper/25 !text-paper hover:!bg-paper/10`} onClick={() => go("msgs")}>
                <Icon name="inbox" size={16} /> فتح البريد
              </button>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <FadeUp key={k.label} delay={i * 70}>
            <button
              onClick={() => go(k.page)}
              className="group w-full rounded-2xl border border-ink/8 bg-card p-4.5 text-start shadow-[0_10px_30px_-22px_rgba(13,31,26,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-lift cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.cls}`}>
                  <Icon name={k.ic} size={19} />
                </span>
                <span className="text-fog opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1">
                  <Icon name="back" size={16} />
                </span>
              </div>
              <p className="mt-3.5 font-display text-[30px] font-bold leading-none text-pine">
                <CountUp to={k.value} />
              </p>
              <p className="mt-1.5 text-[13px] font-semibold text-ink/75">{k.label}</p>
              <p className="mt-0.5 text-[11.5px] text-fog">{k.sub}</p>
            </button>
          </FadeUp>
        ))}
      </div>

      {/* charts */}
      <div className="grid gap-5 lg:grid-cols-3">
        <FadeUp className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-ink/8 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-[17px] font-bold text-pine">زيارات الموقع العام</h3>
                <p className="text-[12px] text-fog">آخر 12 أسبوعاً · إجمالي <span className="font-mono font-semibold text-ink/70">{totalVisits.toLocaleString("en-US")}</span> زيارة</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-moss/12 px-2.5 py-1 text-[11.5px] font-bold text-[#2b6a4c]">
                <Icon name="chart" size={13} /> +12% عن الفترة السابقة
              </span>
            </div>
            <div dir="ltr" style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={db.visits} margin={{ top: 6, right: 6, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gz" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#17705f" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#17705f" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,33,29,0.07)" vertical={false} />
                  <XAxis dataKey="w" tick={{ fontSize: 11, fill: "#64716b", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64716b", fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#c19a4b", strokeDasharray: "4 4" }} formatter={(v: number | string) => [`${Number(v).toLocaleString("en-US")} زيارة`, "الزيارات"]} />
                  <Area type="monotone" dataKey="z" stroke="#17705f" strokeWidth={2.5} fill="url(#gz)" dot={{ r: 3, fill: "#17705f", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#c19a4b" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={120}>
          <div className="flex h-full flex-col rounded-2xl border border-ink/8 bg-card p-5">
            <h3 className="font-display text-[17px] font-bold text-pine">حالة الأخبار</h3>
            <p className="text-[12px] text-fog">توزيع المحتوى الإخباري الحالي</p>
            <div dir="ltr" className="relative mx-auto mt-2" style={{ width: 190, height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donut} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={4} strokeWidth={0}>
                    {donut.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number | string, n: string) => [`${v} خبر`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" dir="rtl">
                <span className="font-display text-[26px] font-bold leading-none text-pine">
                  <CountUp to={db.news.length} />
                </span>
                <span className="text-[11px] text-fog">خبر</span>
              </div>
            </div>
            <div className="mt-auto space-y-1.5 pt-3">
              {donut.map((d) => (
                <div key={d.name} className="flex items-center gap-2.5 text-[12.5px]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="font-semibold text-ink/75">{d.name}</span>
                  <span className="ms-auto font-mono text-fog">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>

      {/* lower row */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* quick draft */}
        <FadeUp>
          <div className="flex h-full flex-col rounded-2xl border border-ink/8 bg-card p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass/15 text-brass-2"><Icon name="pen" size={17} /></span>
              <div>
                <h3 className="font-display text-[16px] font-bold leading-5 text-pine">مسودة سريعة</h3>
                <p className="text-[11.5px] text-fog">التقط الفكرة الآن وأكمل التحرير لاحقاً</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <input className={inp} placeholder="عنوان الخبر المقترح…" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveDraft()} />
              <select className={inp} value={draftCat} onChange={(e) => setDraftCat(e.target.value)}>
                {NEWS_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className={`${btnPrimary} w-full`} onClick={saveDraft}>
                <Icon name="check" size={16} /> حفظ كمسودة
              </button>
            </div>
            <p className="mt-4 rounded-lg bg-pine/4 px-3.5 py-2.5 text-[12px] leading-5 text-fog">
              <span className="font-bold text-ink/65">نصيحة تحريرية:</span> العناوين الأقصر من 60 حرفاً تحقق ظهوراً أفضل في نتائج البحث.
            </p>
          </div>
        </FadeUp>

        {/* activity */}
        <FadeUp delay={90}>
          <div className="flex h-full flex-col rounded-2xl border border-ink/8 bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-pine">آخر النشاطات</h3>
              <span className="font-mono text-[11px] text-fog">{db.activity.length} عملية</span>
            </div>
            <div className="admin-scroll -mx-2 flex-1 space-y-0.5 overflow-y-auto pe-1" style={{ maxHeight: 300 }}>
              {db.activity.slice(0, 9).map((a) => {
                const s = ACT[a.kind] ?? ACT.settings;
                return (
                  <div key={a.id} className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-pine/3">
                    <span className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg ${s.cls}`}>
                      <Icon name={s.ic} size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium leading-5 text-ink">{a.text}</p>
                      <p className="text-[11px] text-fog">{a.actor} · {relTime(a.time)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeUp>

        {/* top docs */}
        <FadeUp delay={160}>
          <div className="flex h-full flex-col rounded-2xl border border-ink/8 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[16px] font-bold text-pine">الأكثر تحميلاً</h3>
              <button onClick={() => go("docs")} className="flex items-center gap-1 text-[12px] font-bold text-teal hover:underline cursor-pointer">
                كل النماذج <Icon name="back" size={13} />
              </button>
            </div>
            <div className="space-y-3.5">
              {topDocs.map((d, i) => (
                <div key={d.id} className="group">
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <p className="truncate text-[12.5px] font-semibold text-ink/80">
                      <span className="me-1.5 font-mono text-[11px] text-brass-2">{i + 1}</span>
                      {d.name}
                    </p>
                    <span className="font-mono text-[11.5px] text-fog">{d.downloads}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
                    <div className="bar-grow h-full rounded-full bg-gradient-to-l from-brass to-brass-2" style={{ width: `${(d.downloads / maxDl) * 100}%`, animationDelay: `${i * 90}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
