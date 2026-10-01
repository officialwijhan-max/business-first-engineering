import { useLoaderData, useParams } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CaseStudyFeatureGrid,
  CaseStudyOptionalSection,
  CaseStudyTagList,
  DataState,
  DirectionMark,
  HeroBadge,
  PageIntro,
  RelatedWorkGrid,
  SectionHeading,
} from "@/components/page-elements";
import { ProjectDetailPage } from "@/components/project-detail-page";
import { GetStartedSection } from "@/components/get-started-section";
import { RegionalPresenceSection } from "@/components/regional-presence-section";
import { ProcessPage } from "@/components/process-page";
import { processStepsAr } from "@/lib/site-data-ar";

export function ArabicCaseStudyPage() {
  const { slug } = useParams({ from: "/ar/work/$slug" });
  const loaderData = useLoaderData({ from: "/ar/work/$slug" });
  return <ProjectDetailPage locale="ar" slug={slug} initialData={loaderData} />;
}

export function ArabicProcessPage() {
  const notes = [
    "نستمع قبل أن نقترح، ونكشف الافتراضات ونتفق على الحاجة الحقيقية.",
    "نضع الحدود والأولويات وتعريًا مشترًا للنجاح.",
    "نجعل المنتج ملموًا قبل زيادة الاستثمار الهندسي.",
    "نختار التقنية الملائمة والقابلة للاستمرار والتسليم المسؤول.",
    "نتحقق من المنتج وفق المتطلبات والاستخدام الحقيقي، لا الاكتمال التقني فقط.",
    "نتعامل مع الإطلاق كبداية للتعلم، لا كنهاية للعمل.",
  ];
  return (
    <ProcessPage
      locale="ar"
      badge="منهجيتنا"
      title={
        <>
          نفهم أوًا.
          <br />
          ثم نبني.
          <br />
        </>
      }
      accent="ونطوّر باستمرار."
      copy="تقلل منهجية المنتج الواضحة الهدر، وتكشف المخاطر مبكًا، وتربط كل قرار بهدف العمل."
      steps={processStepsAr}
      notes={notes}
      phaseLabel="المرحلة"
      principlesLabel="طوال العمل"
      principlesTitle="وضوح في كل خطوة."
      principles={[
        ["تقدّم ظاهر", "يعرف الفريق وأصحاب المصلحة ما الذي يتحرك ولماذا."],
        ["حقيقة مبكرة", "نكشف المخاطر والقرارات الصعبة قبل أن تصبح مكلفة."],
        ["مسؤولية مشتركة", "يتحرك العمل والمنتج والتصميم والهندسة نحو النتيجة نفسها."],
      ]}
    />
  );
}

const contactFaqsAr = [
  {
    question: "خلال كم من الوقت ستردّون علينا؟",
    answer: "خلال يوم عمل واحد. وغالبًا سيتواصل معك فريقنا في اليوم نفسه.",
  },
  {
    question: "كم تستغرق المشاريع عادةً؟",
    answer:
      "يعتمد ذلك على النطاق — فالمنتج المركّز يستغرق عادةً من 8 إلى 16 أسبوعًا، أما مشاريع الـERP أو المنصات الأكبر فنحدد مدتها بعد مرحلة الاكتشاف.",
  },
  {
    question: "هل تقدّمون مرحلة اكتشاف أو تجربة أولية قبل المشروع الكامل؟",
    answer:
      "نعم. للمشكلات الجديدة أو غير الواضحة نوصي غالبًا بمرحلة اكتشاف قصيرة للتأكد من صحة الحل قبل الالتزام بالتنفيذ الكامل.",
  },
  {
    question: "كيف تحدّدون الأسعار؟",
    answer:
      "تُسعَّر المشاريع محددة النطاق بعد مرحلة الاكتشاف، أما الدعم الهندسي المستمر فيكون باشتراك شهري. شاركنا نطاق مشروعك في النموذج أدناه وسنرسل إليك النطاق السعري المناسب.",
  },
  {
    question: "هل يمكنكم الربط مع أنظمتنا الحالية؟",
    answer:
      "نعم. نربط بانتظام مع الأنظمة القائمة عبر واجهات REST API وتسجيل الدخول الموحد (SAML/OAuth) وموصّلات مخصصة ضمن نطاق العمل الهندسي.",
  },
];

export function ArabicContactPage() {
  return (
    <>
      <section className="page-intro">
        <div className="site-container grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
          <div className="reveal">
            <HeroBadge>ابدأ مشروعك</HeroBadge>
            <h1 className="mt-6 max-w-2xl font-display text-[2.5rem] leading-[.98] text-primary-foreground sm:text-6xl lg:text-7xl">
              لنبدأ بفهم
              <br />
              <span className="text-primary-foreground/45">المشكلة أوًا.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-primary-foreground/70">
              أخبرنا بما تريد بناءه أو تحسينه أو حله. تبدأ المحادثة المفيدة بالسياق، لا بعرض
              المبيعات.
            </p>
          </div>
          <div className="reveal relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur sm:p-8">
            <DirectionMark className="absolute end-[-7rem] top-[-7rem] w-[min(85vw,30rem)] opacity-30" />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-primary-foreground/20" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-widest text-hero-accent">
                  تواصل معنا
                </p>
              </div>
              <div className="mt-7 divide-y divide-primary-foreground/10">
                <InfoRow
                  label="البريد الإلكتروني"
                  value="hello@wijhan.com"
                  href="mailto:hello@wijhan.com"
                />
                <InfoRow
                  label="الهاتف"
                  value="+20 100 058 0504"
                  href="tel:+201000580504"
                  dir="ltr"
                />
                <InfoRow label="ساعات العمل" value="الأحد إلى الخميس، من 9 ص إلى 5 م" />
                <InfoRow label="الرد" value="خلال يوم عمل واحد" accent />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GetStartedSection locale="ar" includeOtherService eyebrow="تواصل معنا" />

      <RegionalPresenceSection sectionId="regional-presence" arabic={true} />

      <section className="section-pad border-t border-border">
        <div className="site-container grid gap-10 lg:grid-cols-[.6fr_1.4fr] lg:items-start">
          <div className="reveal">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              الأسئلة الشائعة
            </p>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl">أسئلة متكررة</h2>
            <p className="mt-4 max-w-xs leading-7 text-muted-foreground">
              لم تجد إجابة سؤالك؟ تواصل معنا مباشرة.
            </p>
            <a
              className="mt-3 flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-accent"
              href="mailto:hello@wijhan.com"
            >
              <Mail className="size-4" aria-hidden="true" />
              hello@wijhan.com
            </a>
          </div>
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {contactFaqsAr.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="rounded-2xl border-b-0 bg-background px-5 shadow-md sm:px-6"
              >
                <AccordionTrigger className="text-start font-display text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-7 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  label,
  value,
  href,
  dir,
  accent = false,
}: {
  label: string;
  value: string;
  href?: string;
  dir?: "ltr" | "rtl";
  accent?: boolean;
}) {
  const valueClassName = accent
    ? "text-end text-sm font-semibold text-hero-accent"
    : "text-end text-sm font-semibold text-primary-foreground";
  // Tappable rows (mailto:/tel:) get a full-height 44px hit area on touch screens.
  const linkClassName = `${valueClassName} inline-flex min-h-11 items-center`;
  return (
    <div className="flex min-h-20 items-center justify-between gap-4 py-5 sm:gap-6">
      <span className="text-sm text-primary-foreground/55">{label}</span>
      {href ? (
        <a className={linkClassName} href={href} dir={dir}>
          {value}
        </a>
      ) : (
        <span className={valueClassName} dir={dir}>
          {value}
        </span>
      )}
    </div>
  );
}
