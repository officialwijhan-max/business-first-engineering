/**
 * Contact-page FAQ, shared by the visible accordion and the FAQPage JSON-LD so the structured
 * data can never drift from what the page actually shows.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const contactFaqsEn: Faq[] = [
  {
    question: "How quickly will I hear back?",
    answer:
      "We respond to all enquiries within one business day. Urgent requests are prioritized same-day.",
  },
  {
    question: "What is the typical project timeline?",
    answer:
      "A focused product build usually runs 8–16 weeks. Larger ERP or platform work is scoped after a discovery phase, once we understand the full picture.",
  },
  {
    question: "Do you offer a discovery or pilot phase?",
    answer:
      "Yes. For new or ambiguous problems, we recommend a short, fixed-price discovery sprint to validate the approach before committing to full delivery.",
  },
  {
    question: "What pricing models are available?",
    answer:
      "Fixed-scope pricing for defined projects, and a monthly retainer for ongoing engineering support. Share your scope in the form below and we'll quote the range that fits.",
  },
  {
    question: "Can you integrate with our existing systems?",
    answer:
      "Yes. We regularly integrate with existing systems via REST APIs, SSO (SAML/OAuth) and custom connectors as part of the engineering scope.",
  },
];

export const contactFaqsAr: Faq[] = [
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
