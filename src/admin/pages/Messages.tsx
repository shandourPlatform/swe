import React, { useMemo, useState } from "react";
import { Msg, relTime, useStore } from "../store";
import { Avatar, Confirm, EmptyState, Icon, btnBrass, btnGhost, iconBtn, inp, useToast } from "../ui";

export default function Messages() {
  const db = useStore();
  const toast = useToast();
  const [filter, setFilter] = useState<"الكل" | "غير مقروءة" | "مميزة">("الكل");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [toDelete, setToDelete] = useState<Msg | null>(null);

  const filtered = useMemo(
    () =>
      db.messages.filter((m) =>
        filter === "الكل" ? true : filter === "غير مقروءة" ? !m.read : m.starred
      ),
    [db.messages, filter]
  );
  const unread = db.messages.filter((m) => !m.read).length;

  const selected = filtered.find((m) => m.id === selectedId) ?? null;

  const open = (m: Msg) => {
    setSelectedId(m.id);
    if (!m.read) db.openMessage(m.id);
  };

  const sendReply = () => {
    if (!selected) return;
    if (reply.trim().length < 10) {
      toast({ tone: "err", title: "الرد قصير جداً", desc: "اكتب رداً لا يقل عن 10 أحرف قبل الإرسال" });
      return;
    }
    db.replyMessage(selected.id);
    toast({ tone: "ok", title: "أُرسل الرد", desc: `إلى ${selected.name} عبر ${selected.email}` });
    setReply("");
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-[22px] font-bold text-pine">الرسائل الواردة</h2>
          <p className="text-[13px] text-fog">
            {unread > 0 ? <span className="font-bold text-brass-2">{unread} رسالة غير مقروءة</span> : "صندوقك محدّث — لا رسائل جديدة"} · من نموذج «اتصل بنا»
          </p>
        </div>
        {unread > 0 && (
          <button className={`${btnGhost} ms-auto`} onClick={() => { db.markAllRead(); toast({ tone: "ok", title: "حُددت جميع الرسائل كمقروءة" }); }}>
            <Icon name="check" size={15} /> تعليم الكل كمقروء
          </button>
        )}
      </div>

      <div className="flex gap-1.5">
        {(["الكل", "غير مقروءة", "مميزة"] as const).map((f) => (
          <button key={f} onClick={() => { setFilter(f); setSelectedId(null); }}
            className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all cursor-pointer ${
              filter === f ? "bg-pine text-paper shadow" : "bg-card border border-ink/10 text-ink/60 hover:text-ink"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="inbox" title={filter === "الكل" ? "لا توجد رسائل" : "لا رسائل في هذا التصنيف"}
          desc={filter === "الكل" ? "عندما يرسل الزوار استفساراتهم عبر نموذج الاتصال ستظهر هنا." : "غيّر الفلتر لعرض بقية الرسائل."}
          action={filter !== "الكل" ? <button className={btnGhost} onClick={() => setFilter("الكل")}>عرض الكل</button> : undefined} />
      ) : (
        <div className="grid overflow-hidden rounded-2xl border border-ink/8 bg-card lg:grid-cols-[380px_1fr]">
          {/* list */}
          <div className={`admin-scroll max-h-[560px] divide-y divide-ink/6 overflow-y-auto border-e border-ink/8 lg:max-h-[620px] ${selected ? "hidden lg:block" : ""}`}>
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => open(m)}
                className={`relative flex w-full items-start gap-3 px-4 py-3.5 text-start transition-colors cursor-pointer ${
                  selected?.id === m.id ? "bg-brass/10" : "hover:bg-pine/3"
                }`}
              >
                {!m.read && <span className="absolute inset-y-3 start-0 w-1 rounded-e-full bg-brass-2" />}
                <Avatar name={m.name} tone={m.id.length % 4} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-[13px] ${m.read ? "font-semibold text-ink/75" : "font-bold text-ink"}`}>{m.name}</span>
                    <span className="flex-none font-mono text-[10.5px] text-fog">{relTime(m.date)}</span>
                  </span>
                  <span className={`mt-0.5 block truncate text-[12.5px] ${m.read ? "text-fog" : "font-semibold text-ink/80"}`}>{m.subject}</span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-fog/80">{m.body.replace(/\n/g, " ").slice(0, 60)}</span>
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); db.toggleStar(m.id); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); db.toggleStar(m.id); } }}
                  className={`mt-1 transition-all hover:scale-125 ${m.starred ? "text-brass-2" : "text-ink/20 hover:text-brass-2/60"}`}
                  title="تمييز"
                >
                  <Icon name="star" size={15} className={m.starred ? "fill-brass-2" : ""} />
                </span>
              </button>
            ))}
          </div>

          {/* detail */}
          {selected ? (
            <div className="flex max-h-[560px] flex-col lg:max-h-[620px]">
              <div className="flex items-start gap-3 border-b border-ink/8 px-5 py-4">
                <button className={`${iconBtn} lg:hidden`} onClick={() => setSelectedId(null)} aria-label="رجوع">
                  <Icon name="back" size={16} />
                </button>
                <Avatar name={selected.name} tone={selected.id.length % 4} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-2.5">
                    <span className="text-[15px] font-bold text-ink">{selected.name}</span>
                    {!selected.read && <span className="rounded-full bg-brass/20 px-2 py-0.5 text-[10.5px] font-bold text-brass-2">جديدة</span>}
                  </p>
                  <p className="text-[12.5px] font-semibold text-pine">{selected.subject}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-fog">
                    <span dir="ltr" className="font-mono">{selected.email}</span>
                    <span>{relTime(selected.date)}</span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button className={iconBtn} onClick={() => db.toggleStar(selected.id)} title="تمييز">
                    <Icon name="star" size={16} className={selected.starred ? "fill-brass-2 text-brass-2" : ""} />
                  </button>
                  <button className={`${iconBtn} hover:!border-rust/50 hover:!bg-rust/8 hover:!text-rust`} onClick={() => setToDelete(selected)} title="حذف">
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>

              <div className="admin-scroll flex-1 overflow-y-auto px-5 py-4">
                <p className="whitespace-pre-line text-[14px] leading-7 text-ink/85">{selected.body}</p>
              </div>

              <div className="border-t border-ink/8 bg-paper/60 px-5 py-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-fog">
                  <Icon name="send" size={14} />
                  الرد على {selected.name.split(" ")[0]} — سيُرسل إلى <span dir="ltr" className="font-mono">{selected.email}</span>
                </div>
                <textarea
                  rows={3}
                  className={`${inp} mt-2 resize-none leading-6`}
                  placeholder="اكتب ردك هنا… مثال: شكراً لتواصلكم، بخصوص استفساركم عن…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-fog">{reply.length} حرف</span>
                  <button className={btnBrass} onClick={sendReply} disabled={reply.trim().length < 10}>
                    <Icon name="send" size={15} /> إرسال الرد
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden items-center justify-center lg:flex">
              <p className="text-[13.5px] text-fog">اختر رسالة لعرض تفاصيلها</p>
            </div>
          )}
        </div>
      )}

      <Confirm
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            db.deleteMessage(toDelete.id);
            if (selectedId === toDelete.id) setSelectedId(null);
            toast({ tone: "info", title: "حُذفت الرسالة", desc: `رسالة ${toDelete.name}` });
          }
        }}
        title="حذف الرسالة"
        desc={toDelete ? `ستُحذف رسالة «${toDelete.subject}» من ${toDelete.name} نهائياً.` : ""}
      />
    </div>
  );
}
