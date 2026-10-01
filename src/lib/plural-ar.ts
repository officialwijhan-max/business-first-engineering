/**
 * Arabic has distinct count forms: 1 (singular), 2 (dual), 3-10 (plural), 11+ (singular
 * accusative). "N + plural" is only correct for 3-10, so a fixed singular/plural pair
 * reads wrong for 2 ("2 خدمات") and 11+ ("12 خدمات").
 */
export function arabicCount(
  count: number,
  forms: { one: string; two: string; few: string; many: string },
): string {
  if (count === 1) return forms.one;
  if (count === 2) return forms.two;
  const mod = count % 100;
  if (mod >= 3 && mod <= 10) return `${count} ${forms.few}`;
  return `${count} ${forms.many}`;
}

export const projectsAr = (n: number) =>
  arabicCount(n, { one: "مشروع واحد", two: "مشروعان", few: "مشاريع", many: "مشروعًا" });
export const servicesAr = (n: number) =>
  arabicCount(n, { one: "خدمة واحدة", two: "خدمتان", few: "خدمات", many: "خدمة" });
export const hubsAr = (n: number) =>
  arabicCount(n, { one: "مركز تسليم واحد", two: "مركزا تسليم", few: "مراكز تسليم", many: "مركز تسليم" });
