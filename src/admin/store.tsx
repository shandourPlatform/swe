import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/* ================= types ================= */
export type NewsStatus = "منشور" | "مسودة" | "مؤرشف";
export interface NewsItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  date: string; // ISO
  status: NewsStatus;
  views: number;
  tone: number;
}
export interface DocForm {
  id: string;
  name: string;
  category: string;
  size: number; // MB
  downloads: number;
  updated: string; // ISO
}
export interface Slide {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
  active: boolean;
}
export interface Msg {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  date: string; // ISO
  read: boolean;
  starred: boolean;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string; // ISO
  active: boolean;
}
export interface Activity {
  id: string;
  text: string;
  time: string; // ISO
  kind: "add" | "edit" | "delete" | "status" | "upload" | "auth" | "settings" | "msg";
  actor: string;
}
export interface Settings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  fax: string;
  address: string;
  hours: string;
  maintenance: boolean;
  registrationOpen: boolean;
  comments: boolean;
  newsletter: boolean;
}
export interface DB {
  v: number;
  news: NewsItem[];
  docs: DocForm[];
  slides: Slide[];
  messages: Msg[];
  users: User[];
  activity: Activity[];
  settings: Settings;
  session: { name: string; role: string } | null;
  visits: { w: string; z: number }[];
  lastBell: string;
}

/* ================= constants ================= */
export const NEWS_CATS = ["القبول والتسجيل", "أكاديمي", "فعاليات", "شراكات", "إنجازات"];
export const DOC_CATS = ["قسم المحاسبة", "قسم إدارة الأعمال", "قسم تقنية المعلومات", "قسم القانون", "القبول والتسجيل", "شؤون الطلاب"];
export const ROLES = ["مدير النظام", "محرر أخبار عامة", "محرر إداري", "محرر أقسام", "مسؤول نماذج", "مشاهد"];
export const SLIDE_KINDS = ["ترحيبية", "القبول", "الأقسام", "الإنجازات", "البحث العلمي", "الحياة الجامعية", "التوظيف"];

/* ================= helpers ================= */
export const uid = () => Math.random().toString(36).slice(2, 10);
const M = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
export const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
};
export const relTime = (iso: string) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "الآن";
  if (s < 3600) return `منذ ${Math.floor(s / 60)} دقيقة`;
  if (s < 86400) return `منذ ${Math.floor(s / 3600)} ساعة`;
  if (s < 172800) return "أمس";
  const d = new Date(iso);
  return `${d.getDate()} ${M[d.getMonth()]}`;
};
const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();
const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

/* ================= seed ================= */
function seed(): DB {
  return {
    v: 3,
    news: [
      { id: "n1", title: "فتح باب القبول والتسجيل للعام الجامعي 2026–2027", category: "القبول والتسجيل", excerpt: "تعلن جامعة العاصمة الأهلية عن بدء قبول طلبات الالتحاق بجميع الأقسام العلمية اعتباراً من مطلع الشهر المقبل، وفق الطاقة الاستيعابية المعتمدة.", body: "تعلن جامعة العاصمة الأهلية عن فتح باب القبول والتسجيل للعام الجامعي 2026–2027 في أقسام المحاسبة، وإدارة الأعمال، وتقنية المعلومات، والقانون.\n\nعلى الراغبين في التقدم تجهيز الشهادة الثانوية الأصلية وكشف الدرجات وصورة من جواز السفر، وتقديم الطلبات عبر مكتب القبول والتسجيل بمقر الجامعة بسوق الجمعة خلال ساعات الدوام الرسمي.", author: "أ. نجلاء الفرجاني", date: day(2), status: "منشور", views: 2140, tone: 0 },
      { id: "n2", title: "انطلاق أعمال المؤتمر الطلابي الأول للبحث العلمي", category: "فعاليات", excerpt: "احتضنت قاعة الاجتماعات الكبرى فعاليات المؤتمر الطلابي الأول بمشاركة 40 ورقة بحثية من مختلف الأقسام العلمية.", body: "انطلقت صباح اليوم أعمال المؤتمر الطلابي الأول للبحث العلمي برعاية رئاسة الجامعة، وبمشاركة 40 ورقة بحثية قدّمها طلبة الأقسام الأربعة.\n\nوأكد رئيس الجامعة في كلمته الافتتاحية أن البحث العلمي ركيزة أساسية في خطة الجامعة الاستراتيجية، معلناً عن تخصيص جائزة سنوية لأفضل بحث طلابي.", author: "أ. نجلاء الفرجاني", date: day(5), status: "منشور", views: 1365, tone: 2 },
      { id: "n3", title: "توقيع مذكرة تفاهم مع مصرف الجمهورية لتدريب الطلبة", category: "شراكات", excerpt: "وقّعت الجامعة مذكرة تفاهم مع مصرف الجمهورية لتوفير فرص تدريب ميداني لطلبة قسمي المحاسبة وإدارة الأعمال.", body: "وقّعت جامعة العاصمة الأهلية مذكرة تفاهم مع مصرف الجمهورية تقضي بتوفير برامج تدريب ميداني سنوية لطلبة قسمي المحاسبة وإدارة الأعمال داخل فروع المصرف.\n\nوتشمل المذكرة تنظيم ورش عمل مشتركة، وإشرافاً مهنياً على مشاريع التخرج ذات الطابع المصرفي والمالي.", author: "م. عبد الرؤوف الشريف", date: day(9), status: "منشور", views: 980, tone: 3 },
      { id: "n4", title: "اعتماد الخطة الدراسية المطوّرة لقسم تقنية المعلومات", category: "أكاديمي", excerpt: "أقرّ مجلس الجامعة الخطة الدراسية المطوّرة لقسم تقنية المعلومات اعتباراً من الفصل الخريفي المقبل، بمقررات جديدة في الذكاء الاصطناعي وأمن المعلومات.", body: "أقرّ مجلس الجامعة في جلسته الأخيرة الخطة الدراسية المطوّرة لقسم تقنية المعلومات، والتي تتضمن مقررات جديدة في الذكاء الاصطناعي، وأمن المعلومات، وتحليل البيانات.\n\nوتأتي هذه الخطوة ضمن توجه الجامعة لمواءمة مخرجاتها مع متطلبات سوق العمل الرقمي المحلي والإقليمي.", author: "د. محمد عبد الله", date: day(14), status: "منشور", views: 1120, tone: 1 },
      { id: "n5", title: "طلبة المحاسبة يحققون المركز الأول في مسابقة التحليل المالي", category: "إنجازات", excerpt: "حقق فريق قسم المحاسبة المركز الأول في المسابقة الوطنية للتحليل المالي التي نظمتها كلية الاقتصاد بطرابلس.", body: "حقق فريق طلبة قسم المحاسبة المركز الأول في المسابقة الوطنية للتحليل المالي على مستوى الجامعات الليبية، متفوقاً على 18 فريقاً مشاركاً.\n\nوهنأت رئاسة الجامعة الطلبة ومشرفهم العلمي، مؤكدة دعمها الكامل للمشاركة في المحافل العلمية الإقليمية والدولية.", author: "أ. نجلاء الفرجاني", date: day(21), status: "منشور", views: 1740, tone: 4 },
      { id: "n6", title: "ورشة عمل: أساسيات الكتابة الأكاديمية لطلبة الدراسات العليا", category: "فعاليات", excerpt: "ينظم قسم إدارة الأعمال ورشة تدريبية حول مناهج الكتابة الأكاديمية والتوثيق العلمي، بمعدل 12 ساعة تدريبية.", body: "ينظم قسم إدارة الأعمال ورشة عمل تدريبية بعنوان «أساسيات الكتابة الأكاديمية» تستهدف طلبة الدراسات العليا والمعيدين.\n\nتتضمن الورشة محاور في مناهج البحث، وأدوات التوثيق العلمي، وتجنب الانتحال الأدبي، بواقع 12 ساعة تدريبية على مدى أسبوعين.", author: "م. عبد الرؤوف الشريف", date: day(3), status: "مسودة", views: 0, tone: 2 },
      { id: "n7", title: "تحديث لائحة معادلة المقررات للطلبة المنتقلين", category: "أكاديمي", excerpt: "أصدرت لجنة الشؤون العلمية نسخة محدّثة من لائحة معادلة المقررات تسهيلاً لإجراءات الطلبة المنتقلين من جامعات أخرى.", body: "أصدرت لجنة الشؤون العلمية نسخة محدّثة من لائحة معادلة المقررات الدراسية للطلبة المنتقلين، تتضمن تقليص مدة دراسة الطلبات إلى 10 أيام عمل.\n\nوتنص اللائحة الجديدة على معادلة المقررات المطابقة بنسبة 75% فأكثر من حيث المحتوى والمفردات.", author: "د. محمد عبد الله", date: day(1), status: "مسودة", views: 0, tone: 1 },
      { id: "n8", title: "نتائج المفاضلة للفصل الربيعي 2025 — أرشيف", category: "القبول والتسجيل", excerpt: "الأرشيف الرسمي لنتائج مفاضلة القبول للفصل الربيعي من العام الجامعي 2024–2025.", body: "يُحفظ في هذا الأرشيف الإعلان الرسمي لنتائج مفاضلة القبول للفصل الربيعي 2025 بجميع الأقسام العلمية، وقد أُغلق التسجيل بتاريخ 15 فبراير 2025.", author: "أ. نجلاء الفرجاني", date: day(120), status: "مؤرشف", views: 4210, tone: 0 },
    ],
    docs: [
      { id: "d1", name: "مطوية قسم المحاسبة", category: "قسم المحاسبة", size: 1.2, downloads: 342, updated: day(6) },
      { id: "d2", name: "الهيكل التنظيمي لقسم المحاسبة", category: "قسم المحاسبة", size: 0.8, downloads: 217, updated: day(6) },
      { id: "d3", name: "دليل قسم المحاسبة", category: "قسم المحاسبة", size: 2.4, downloads: 189, updated: day(30) },
      { id: "d4", name: "الخطة الدراسية لقسم المحاسبة", category: "قسم المحاسبة", size: 1.6, downloads: 421, updated: day(12) },
      { id: "d5", name: "الجدول الدراسي — الفصل الخريفي 2025–2026", category: "القبول والتسجيل", size: 0.9, downloads: 863, updated: day(20) },
      { id: "d6", name: "قائمة الطلبة الأوائل — الربيع 2025", category: "قسم المحاسبة", size: 0.6, downloads: 512, updated: day(90) },
      { id: "d7", name: "دليل استخدام البوابة الطلابية", category: "شؤون الطلاب", size: 3.1, downloads: 274, updated: day(45) },
      { id: "d8", name: "نموذج طلب معادلة مقررات", category: "القبول والتسجيل", size: 0.4, downloads: 396, updated: day(8) },
    ],
    slides: [
      { id: "s1", kind: "ترحيبية", title: "جامعة العاصمة الأهلية", subtitle: "من قلب العاصمة.. نحو تعليم متميز وعالمي", active: true },
      { id: "s2", kind: "القبول", title: "ابدأ رحلتك الأكاديمية", subtitle: "سجّل الآن في العام الدراسي 2026–2027", active: true },
      { id: "s3", kind: "الأقسام", title: "4 تخصصات متميزة", subtitle: "محاسبة، إدارة أعمال، تقنية معلومات، قانون", active: true },
      { id: "s4", kind: "الإنجازات", title: "اعتماد أكاديمي معتمد", subtitle: "من وزارة التعليم العالي والبحث العلمي", active: false },
      { id: "s5", kind: "البحث العلمي", title: "نحو آفاق جديدة", subtitle: "أبحاث علمية تساهم في تنمية المجتمع", active: true },
      { id: "s6", kind: "الحياة الجامعية", title: "أكثر من مجرد دراسة", subtitle: "أنشطة وفعاليات ومجتمع أكاديمي نابض", active: false },
      { id: "s7", kind: "التوظيف", title: "مستقبلك يبدأ من هنا", subtitle: "شراكات مع كبرى المؤسسات لتوظيف الخريجين", active: false },
    ],
    messages: [
      { id: "m1", name: "أحمد المصراتي", email: "a.misurati@gmail.com", subject: "استفسار عن شروط القبول بقسم القانون", body: "السلام عليكم،\n\nأرغب في الاستفسار عن شروط القبول بقسم القانون للعام الجامعي المقبل، وهل يُشترط معدل معين في الشهادة الثانوية؟ وما المستندات المطلوبة للتسجيل؟\n\nشاكرين لكم.", date: ago(42), read: false, starred: false },
      { id: "m2", name: "سارة بن عمران", email: "s.benimran@outlook.com", subject: "رسوم الدراسة وآلية التقسيط", body: "مرحباً،\n\nأرجو تزويدي ببيان رسوم الدراسة لقسم إدارة الأعمال، وهل تتوفر إمكانية تقسيط الرسوم على دفعات خلال الفصل الدراسي؟\n\nمع خالص الشكر.", date: ago(130), read: false, starred: false },
      { id: "m3", name: "خالد الترهوني", email: "k.tarhuni@gmail.com", subject: "معادلة مواد من جامعة أخرى", body: "تحية طيبة،\n\nأنا طالب منتقل من جامعة أخرى وأنهيت 4 فصول دراسية في تخصص المحاسبة. كيف تتم إجراءات معادلة المقررات التي درستها؟ وكم تستغرق المدة؟", date: ago(200), read: false, starred: true },
      { id: "m4", name: "شركة المدار للتقنية", email: "hr@almadar-tech.ly", subject: "مقترح شراكة لتدريب طلبة تقنية المعلومات", body: "السادة إدارة جامعة العاصمة الأهلية المحترمين،\n\nيسرّ شركة المدار للتقنية أن تتقدم بمقترح شراكة لتوفير برنامج تدريب صيفي لطلبة قسم تقنية المعلومات، يشمل مجالات تطوير الويب وأمن الشبكات.\n\nنأمل تحديد موعد لاجتماع لمناقشة التفاصيل.", date: day(2), read: true, starred: true },
      { id: "m5", name: "مريم الفيتوري", email: "m.fituri@gmail.com", subject: "موعد إعلان نتائج الفصل الخريفي", body: "السلام عليكم،\n\nهل هناك موعد مبدئي لإعلان نتائج الفصل الخريفي 2025–2026؟ وهل ستُنشر عبر البوابة الطلابية؟", date: day(3), read: true, starred: false },
      { id: "m6", name: "عبد السلام الزوي", email: "a.zawi@yahoo.com", subject: "مشكلة في تحميل نموذج الخطة الدراسية", body: "مرحباً،\n\nأواجه مشكلة في تحميل ملف الخطة الدراسية لقسم المحاسبة من الموقع؛ تظهر رسالة خطأ بعد بدء التنزيل. أرجو المساعدة.", date: day(5), read: true, starred: false },
    ],
    users: [
      { id: "u1", name: "أ. سالم بن عمران", email: "s.benimran@au.edu.ly", role: "مدير النظام", lastActive: ago(4), active: true },
      { id: "u2", name: "أ. نجلاء الفرجاني", email: "n.farjani@au.edu.ly", role: "محرر أخبار عامة", lastActive: ago(55), active: true },
      { id: "u3", name: "م. عبد الرؤوف الشريف", email: "a.shareef@au.edu.ly", role: "محرر إداري", lastActive: ago(300), active: true },
      { id: "u4", name: "د. محمد عبد الله", email: "m.abdullah@au.edu.ly", role: "محرر أقسام", lastActive: day(1), active: true },
      { id: "u5", name: "أ. هبة القمودي", email: "h.gammudi@au.edu.ly", role: "مسؤول نماذج", lastActive: day(2), active: true },
      { id: "u6", name: "د. علي أبوبكر", email: "a.abubaker@au.edu.ly", role: "مشاهد", lastActive: day(12), active: false },
    ],
    activity: [
      { id: uid(), text: "نشر خبر «فتح باب القبول والتسجيل للعام الجامعي 2026–2027»", time: ago(4), kind: "status", actor: "أ. نجلاء الفرجاني" },
      { id: uid(), text: "رفع نموذج «نموذج طلب معادلة مقررات»", time: ago(95), kind: "upload", actor: "أ. هبة القمودي" },
      { id: uid(), text: "تعديل شريحة «ابدأ رحلتك الأكاديمية»", time: ago(180), kind: "edit", actor: "أ. سالم بن عمران" },
      { id: uid(), text: "إضافة المستخدم «أ. هبة القمودي» بدور مسؤول نماذج", time: day(2), kind: "add", actor: "أ. سالم بن عمران" },
      { id: uid(), text: "حذف خبر منتهي الصلاحية من الأرشيف", time: day(4), kind: "delete", actor: "أ. نجلاء الفرجاني" },
      { id: uid(), text: "تحديث إعدادات التواصل العامة", time: day(6), kind: "settings", actor: "أ. سالم بن عمران" },
    ],
    settings: {
      siteName: "جامعة العاصمة الأهلية",
      tagline: "من قلب العاصمة.. نحو تعليم متميز وعالمي",
      email: "info@au.edu.ly",
      phone: "002180900000",
      fax: "002180900001",
      address: "طرابلس – ليبيا، سوق الجمعة، طريق الدعوة الإسلامية",
      hours: "الأحد – الخميس · 8:00 ص – 2:00 م",
      maintenance: false,
      registrationOpen: true,
      comments: false,
      newsletter: true,
    },
    session: null,
    visits: [
      { w: "س1", z: 820 }, { w: "س2", z: 940 }, { w: "س3", z: 1100 }, { w: "س4", z: 1030 },
      { w: "س5", z: 1240 }, { w: "س6", z: 1380 }, { w: "س7", z: 1290 }, { w: "س8", z: 1520 },
      { w: "س9", z: 1710 }, { w: "س10", z: 1640 }, { w: "س11", z: 1830 }, { w: "س12", z: 2050 },
    ],
    lastBell: day(1),
  };
}

/* ================= persistence ================= */
const KEY = "au.admin.v3";
function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as DB;
      if (d && d.v === 3 && Array.isArray(d.news)) return d;
    }
  } catch {
    /* ignore */
  }
  return seed();
}

/* ================= store ================= */
interface Store extends DB {
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  log: (text: string, kind: Activity["kind"]) => void;
  addNews: (n: Omit<NewsItem, "id" | "date" | "views">) => string;
  updateNews: (id: string, patch: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  setNewsStatus: (id: string, s: NewsStatus) => void;
  addDoc: (d: Omit<DocForm, "id" | "downloads" | "updated">) => void;
  deleteDoc: (id: string) => void;
  bumpDownload: (id: string) => void;
  addSlide: () => void;
  updateSlide: (id: string, patch: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  moveSlide: (id: string, dir: -1 | 1) => void;
  openMessage: (id: string) => void;
  toggleStar: (id: string) => void;
  deleteMessage: (id: string) => void;
  markAllRead: () => void;
  replyMessage: (id: string) => void;
  addUser: (u: Omit<User, "id" | "lastActive" | "active">) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  saveSettings: (patch: Partial<Settings>) => void;
  markBellSeen: () => void;
  resetData: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
      /* ignore */
    }
  }, [db]);

  const store = useMemo<Store>(() => {
    const actor = () => db.session?.name ?? "النظام";
    const withLog = (prev: DB, text: string, kind: Activity["kind"]): DB => ({
      ...prev,
      activity: [{ id: uid(), text, time: new Date().toISOString(), kind, actor: actor() }, ...prev.activity].slice(0, 40),
    });
    return {
      ...db,
      login: (email, pass) => {
        const ok = email.trim().toLowerCase() === "admin@au.edu.ly" && pass === "admin123";
        if (ok)
          setDb((p) =>
            withLog({ ...p, session: { name: "أ. سالم بن عمران", role: "مدير النظام" } }, "تسجيل دخول إلى لوحة التحكم", "auth")
          );
        return ok;
      },
      logout: () => setDb((p) => withLog({ ...p, session: null }, "تسجيل خروج من لوحة التحكم", "auth")),
      log: (text, kind) => setDb((p) => withLog(p, text, kind)),
      addNews: (n) => {
        const id = uid();
        setDb((p) => withLog({ ...p, news: [{ ...n, id, date: new Date().toISOString(), views: 0 }, ...p.news] }, `إضافة خبر «${n.title.slice(0, 40)}»`, "add"));
        return id;
      },
      updateNews: (id, patch) =>
        setDb((p) => withLog({ ...p, news: p.news.map((x) => (x.id === id ? { ...x, ...patch } : x)) }, "تعديل خبر", "edit")),
      deleteNews: (id) => setDb((p) => withLog({ ...p, news: p.news.filter((x) => x.id !== id) }, "حذف خبر", "delete")),
      setNewsStatus: (id, s) =>
        setDb((p) => withLog({ ...p, news: p.news.map((x) => (x.id === id ? { ...x, status: s } : x)) }, `تغيير حالة خبر إلى «${s}»`, "status")),
      addDoc: (d) =>
        setDb((p) => withLog({ ...p, docs: [{ ...d, id: uid(), downloads: 0, updated: new Date().toISOString() }, ...p.docs] }, `رفع نموذج «${d.name}»`, "upload")),
      deleteDoc: (id) => setDb((p) => withLog({ ...p, docs: p.docs.filter((x) => x.id !== id) }, "حذف نموذج", "delete")),
      bumpDownload: (id) => setDb((p) => ({ ...p, docs: p.docs.map((x) => (x.id === id ? { ...x, downloads: x.downloads + 1 } : x)) })),
      addSlide: () =>
        setDb((p) => withLog({ ...p, slides: [...p.slides, { id: uid(), kind: "ترحيبية", title: "شريحة جديدة", subtitle: "نص وصفي للشريحة", active: false }] }, "إضافة شريحة جديدة", "add")),
      updateSlide: (id, patch) => setDb((p) => withLog({ ...p, slides: p.slides.map((x) => (x.id === id ? { ...x, ...patch } : x)) }, "تعديل شريحة", "edit")),
      deleteSlide: (id) => setDb((p) => withLog({ ...p, slides: p.slides.filter((x) => x.id !== id) }, "حذف شريحة", "delete")),
      moveSlide: (id, dir) =>
        setDb((p) => {
          const i = p.slides.findIndex((x) => x.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= p.slides.length) return p;
          const arr = [...p.slides];
          const [it] = arr.splice(i, 1);
          arr.splice(j, 0, it);
          return { ...p, slides: arr };
        }),
      openMessage: (id) => setDb((p) => ({ ...p, messages: p.messages.map((x) => (x.id === id ? { ...x, read: true } : x)) })),
      toggleStar: (id) => setDb((p) => ({ ...p, messages: p.messages.map((x) => (x.id === id ? { ...x, starred: !x.starred } : x)) })),
      deleteMessage: (id) => setDb((p) => withLog({ ...p, messages: p.messages.filter((x) => x.id !== id) }, "حذف رسالة واردة", "delete")),
      markAllRead: () => setDb((p) => withLog({ ...p, messages: p.messages.map((x) => ({ ...x, read: true })) }, "تحديد كل الرسائل كمقروءة", "msg")),
      replyMessage: (id) =>
        setDb((p) => withLog({ ...p, messages: p.messages.map((x) => (x.id === id ? { ...x, read: true } : x)) }, "إرسال رد على رسالة", "msg")),
      addUser: (u) => setDb((p) => withLog({ ...p, users: [...p.users, { ...u, id: uid(), lastActive: new Date().toISOString(), active: true }] }, `إضافة المستخدم «${u.name}» بدور ${u.role}`, "add")),
      deleteUser: (id) => setDb((p) => withLog({ ...p, users: p.users.filter((x) => x.id !== id) }, "حذف مستخدم", "delete")),
      updateUser: (id, patch) => setDb((p) => withLog({ ...p, users: p.users.map((x) => (x.id === id ? { ...x, ...patch } : x)) }, "تعديل مستخدم أو صلاحياته", "edit")),
      saveSettings: (patch) => setDb((p) => withLog({ ...p, settings: { ...p.settings, ...patch } }, "حفظ الإعدادات العامة", "settings")),
      markBellSeen: () => setDb((p) => ({ ...p, lastBell: new Date().toISOString() })),
      resetData: () => {
        const s = seed();
        setDb({ ...s, session: db.session, activity: [{ id: uid(), text: "إعادة تعيين البيانات التجريبية", time: new Date().toISOString(), kind: "settings", actor: actor() }, ...s.activity] });
      },
    };
  }, [db]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}
