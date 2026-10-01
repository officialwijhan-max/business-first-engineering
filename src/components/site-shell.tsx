import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronDown, Globe, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServices } from "@/hooks/use-services";
import { useWork } from "@/hooks/use-work";
import { resolveServiceIcon } from "@/lib/icons";
import wijhanLogo from "@/assets/wijhan-logo.svg";
import { saveFormDraft } from "@/lib/form-draft";

const WHATSAPP_NUMBER = "201000580504";
const PHONE_NUMBER = "+201000580504";

const nav = [
  ["/about", "About"],
  ["/services", "Services"],
  ["/work", "Work"],
  ["/case-studies", "Customer Outcomes"],
  ["/process", "Process"],
] as const;

const navAr = [
  ["/ar/about", "عن وجهان"],
  ["/ar/services", "خدماتنا"],
  ["/ar/work", "أعمالنا"],
  ["/ar/case-studies", "نتائج عملائنا"],
  ["/ar/process", "منهجيتنا"],
] as const;

function localizedPath(pathname: string, arabic: boolean) {
  if (arabic) return pathname === "/ar" ? "/" : pathname.replace(/^\/ar/, "") || "/";
  return pathname === "/" ? "/ar" : `/ar${pathname}`;
}

function ServicesMenu({ arabic, label }: { arabic: boolean; label: string }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locale = arabic ? "ar" : "en";
  const { data: services } = useServices(locale);
  const servicesPath = arabic ? "/ar/services" : "/services";
  const items = (services ?? []).slice(0, 6);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleHide = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={scheduleHide}>
      <Link
        to={servicesPath}
        className="nav-link inline-flex items-center gap-1"
        activeProps={{ className: "nav-link nav-link-active inline-flex items-center gap-1" }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={cn("size-2.5 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </Link>
      <div
        role="menu"
        aria-label={arabic ? "قائمة الخدمات" : "Services menu"}
        className={cn(
          "mega-menu fixed left-1/2 z-[1100] w-[960px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden border border-border bg-white shadow-lg ease-menu transition-all duration-300 max-lg:hidden",
          open
            ? "visible translate-y-0 opacity-100 pointer-events-auto"
            : "invisible -translate-y-2 opacity-0 pointer-events-none",
        )}
      >
        <div className="p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-700">
            {arabic ? "خدماتنا" : "OUR SERVICES"}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-x-8 gap-y-7">
            {items.map((service) => {
              const Icon = resolveServiceIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  to={arabic ? "/ar/services/$slug" : "/services/$slug"}
                  params={{ slug: service.slug }}
                  role="menuitem"
                  className="group -m-2 flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-[#C8894F]/8"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold text-primary transition-colors group-hover:text-[#C8894F]">
                      {service.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm text-slate-500">
                      {service.summary}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="border-t border-border px-8 py-5">
          <Link
            to={servicesPath}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            {arabic ? "عرض كل الخدمات" : "View all services"}
            <ArrowRight
              className="size-4 rtl-mirror transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  return (
    <Link
      to={arabic ? "/ar" : "/"}
      className="wordmark"
      aria-label={arabic ? "وجهان — الصفحة الرئيسية" : "Wijhan home"}
    >
      <img
        src={wijhanLogo}
        alt={arabic ? "شعار وجهان" : "Wijhan"}
        className={cn("wordmark-logo", light && "wordmark-logo--light")}
      />
    </Link>
  );
}

/**
 * Mobile/tablet counterpart of <ServicesMenu>: the mega-menu becomes an
 * accordion row — the label still links to /services, the chevron button
 * expands the individual services underneath.
 */
function MobileServicesAccordion({
  arabic,
  label,
  index,
  onNavigate,
}: {
  arabic: boolean;
  label: string;
  index: number;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: services } = useServices(arabic ? "ar" : "en");
  const items = (services ?? []).slice(0, 6);
  const panelId = "mobile-services-panel";

  return (
    <div className="border-b border-border">
      <div className="flex items-center gap-2">
        <Link
          to={arabic ? "/ar/services" : "/services"}
          onClick={onNavigate}
          className="flex min-h-14 flex-1 items-center justify-between py-3 text-xl"
        >
          <span>{label}</span>
          <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
        </Link>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={
              expanded
                ? arabic
                  ? "إخفاء الخدمات"
                  : "Hide services"
                : arabic
                  ? "عرض الخدمات"
                  : "Show services"
            }
            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ChevronDown
              className={cn("size-5 transition-transform duration-200", expanded && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>
      <div
        id={panelId}
        hidden={!expanded}
        className="grid gap-1 pb-4 ps-1 sm:grid-cols-2 sm:gap-x-6"
      >
        {items.map((service) => {
          const Icon = resolveServiceIcon(service.icon);
          return (
            <Link
              key={service.id}
              to={arabic ? "/ar/services/$slug" : "/services/$slug"}
              params={{ slug: service.slug }}
              onClick={onNavigate}
              className="flex min-h-12 items-center gap-3 rounded-lg py-1.5 text-base text-foreground transition-colors hover:text-accent"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {service.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const activeNav = arabic ? navAr : nav;
  const hash = useLocation({ select: (location) => location.hash });
  const close = () => setOpen(false);

  // Any navigation (link, back/forward, language switch) closes the panel.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the full-height panel is open: lock page scroll behind it (the panel
  // scrolls on its own), close on Escape, and close if the viewport grows to
  // the desktop nav breakpoint (tablet rotation / window resize).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="site-header">
      <div className="site-header__bar">
        <div className="site-header__inner">
          <Wordmark />
          <nav
            className="hidden items-center gap-2 lg:flex xl:gap-5"
            aria-label={arabic ? "التنقل الرئيسي" : "Primary navigation"}
          >
            {activeNav.map(([to, label]) =>
              to === "/services" || to === "/ar/services" ? (
                <ServicesMenu key={to} arabic={arabic} label={label} />
              ) : (
                <Link
                  key={to}
                  to={to}
                  className="nav-link"
                  activeProps={{ className: "nav-link nav-link-active" }}
                >
                  {label}
                </Link>
              ),
            )}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to={localizedPath(pathname, arabic)}
              {...(hash ? { hash } : {})}
              onClick={saveFormDraft}
              className="language-switch"
              lang={arabic ? "en" : "ar"}
            >
              <Globe className="size-4" aria-hidden="true" />
              {arabic ? "English" : "العربية"}
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </Link>
            <Link to={arabic ? "/ar/contact" : "/contact"} hash="start" className="nav-cta">
              {arabic ? "ابدأ مشروعك" : "Start a Project"}{" "}
              <ArrowUpRight className="size-4 rtl-mirror" aria-hidden="true" />
            </Link>
          </div>
          <button
            type="button"
            className="icon-control lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={
              open
                ? arabic
                  ? "إغلاق القائمة"
                  : "Close menu"
                : arabic
                  ? "فتح القائمة"
                  : "Open menu"
            }
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-menu"
          className="mobile-menu lg:hidden"
          aria-label={arabic ? "قائمة الجوال" : "Mobile navigation"}
        >
          <div className="site-container flex flex-col py-6 sm:py-8">
            {[
              ...activeNav,
              [arabic ? "/ar/contact" : "/contact", arabic ? "تواصل معنا" : "Contact"] as const,
            ].map(([to, label], index) =>
              to === "/services" || to === "/ar/services" ? (
                <MobileServicesAccordion
                  key={to}
                  arabic={arabic}
                  label={label}
                  index={index}
                  onNavigate={close}
                />
              ) : (
                <Link
                  key={to}
                  to={to}
                  onClick={close}
                  className="flex min-h-14 items-center justify-between border-b border-border py-3 text-xl"
                >
                  <span>{label}</span>
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                </Link>
              ),
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to={localizedPath(pathname, arabic)}
                {...(hash ? { hash } : {})}
                onClick={() => {
                  saveFormDraft();
                  close();
                }}
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
                lang={arabic ? "en" : "ar"}
              >
                <Globe className="size-4" aria-hidden="true" />
                {arabic ? "English" : "العربية"}
              </Link>
              <Link
                to={arabic ? "/ar/contact" : "/contact"}
                hash="start"
                onClick={close}
                className="nav-cta justify-center"
              >
                {arabic ? "ابدأ مشروعك" : "Start a Project"}
                <ArrowUpRight className="size-4 rtl-mirror" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

let colorContext: CanvasRenderingContext2D | null | undefined;

/** Resolves any CSS color (rgb, oklch, oklab, color-mix, ...) to sRGB 0-255 + alpha 0-1. */
function toRgba(color: string): [number, number, number, number] | null {
  if (colorContext === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    colorContext = canvas.getContext("2d", { willReadFrequently: true });
  }
  const ctx = colorContext;
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0, (data[3] ?? 0) / 255];
}

export function FloatingContactButtons() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const containerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const phone = phoneRef.current;
    if (!container || !phone) return;

    const check = () => {
      const rect = phone.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      container.style.pointerEvents = "none";
      let el = document.elementFromPoint(x, y);
      container.style.pointerEvents = "";

      // Theme colors are oklch(); computed styles keep that syntax, so it must be
      // normalized to sRGB before measuring luminance (see toRgba).
      // Sections painted with a gradient/image (no flat background-color) opt in
      // with data-surface="dark" | "light".
      let rgba: [number, number, number, number] | null = null;
      while (el && el !== document.documentElement) {
        const surface = (el as HTMLElement).dataset?.["surface"];
        if (surface) {
          setOnDark(surface === "dark");
          return;
        }
        const parsed = toRgba(getComputedStyle(el).backgroundColor);
        if (parsed && parsed[3] > 0.5) {
          rgba = parsed;
          break;
        }
        el = el.parentElement;
      }
      if (!rgba) {
        setOnDark(false);
        return;
      }
      const [r, g, b] = rgba;
      const srgb = [r, g, b].map((c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      }) as [number, number, number];
      const luminance = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
      setOnDark(luminance < 0.35);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] end-[max(1rem,env(safe-area-inset-right),env(safe-area-inset-left))] z-40 flex flex-col gap-3 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:end-[max(1.5rem,env(safe-area-inset-right),env(safe-area-inset-left))]"
    >
      <a
        ref={phoneRef}
        href={`tel:${PHONE_NUMBER}`}
        aria-label={arabic ? "اتصل بنا" : "Call us"}
        className={cn(
          "flex size-12 items-center justify-center rounded-full shadow-lg transition hover:scale-105 sm:size-14",
          onDark ? "bg-[oklch(0.84_0.015_80)] text-primary" : "bg-primary text-primary-foreground",
        )}
      >
        <Phone className="size-6 sm:size-7" aria-hidden="true" />
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={arabic ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
        className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:size-14"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 sm:size-7"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.33 4.97L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2Zm0 1.67c2.21 0 4.29.86 5.85 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.55-3.71 8.25-8.27 8.25a8.3 8.3 0 0 1-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.55 3.71-8.23 8.26-8.23Zm-4.5 4.6c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.72 4.19 3.71 2.07.83 2.49.66 2.94.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.11-.14.15-.24.23-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42Z" />
        </svg>
      </a>
    </div>
  );
}

function FooterColumn({
  title,
  titleTo,
  children,
}: {
  title: string;
  titleTo?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {titleTo ? (
        <Link
          to={titleTo}
          className="inline-flex min-h-11 min-w-11 items-center text-xs font-bold uppercase tracking-wider text-primary-foreground/45 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent lg:pointer-fine:min-h-0"
        >
          {title}
        </Link>
      ) : (
        <p className="flex min-h-11 items-center text-xs font-bold uppercase tracking-wider text-primary-foreground/45 lg:pointer-fine:min-h-0">
          {title}
        </p>
      )}
      <div className="mt-2 flex flex-col text-sm lg:mt-5 lg:gap-3">{children}</div>
    </div>
  );
}

export function SiteFooter() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const locale = arabic ? "ar" : "en";
  const activeNav = arabic ? navAr : nav;
  const { data: services } = useServices(locale);
  const { data: work } = useWork(locale);
  const caseStudies = work?.case_studies.slice(0, 4) ?? [];
  const linkClassName =
    "flex min-h-11 items-center py-1 text-primary-foreground/65 transition-colors hover:text-primary-foreground lg:pointer-fine:min-h-0 lg:pointer-fine:py-0";

  return (
    <footer className="bg-primary pb-[env(safe-area-inset-bottom)] text-primary-foreground">
      <div className="site-container py-16 md:py-20">
        <div className="grid gap-14 border-b border-primary-foreground/15 pb-14 lg:grid-cols-[1fr_2fr]">
          <div>
            <Wordmark light />
            <p className="mt-7 max-w-md text-lg leading-7 text-primary-foreground/65">
              {arabic ? "شركة هندسة منتجات رقمية" : "Product Engineering Company"}
            </p>
            <p className="mt-2 max-w-md font-display text-2xl text-primary-foreground">
              {arabic
                ? "«نفهم العمل قبل أن نكتب الكود.»"
                : "“We understand the business before writing the code.”"}
            </p>
            <div className="mt-7 space-y-0 text-sm text-primary-foreground/65 lg:space-y-1">
              <a
                href="mailto:hello@wijhan.com"
                dir="ltr"
                className="flex min-h-11 w-fit items-center transition-colors hover:text-primary-foreground lg:pointer-fine:min-h-0"
              >
                hello@wijhan.com
              </a>
              <a
                href="tel:+201000580504"
                dir="ltr"
                className="flex min-h-11 w-fit items-center transition-colors hover:text-primary-foreground lg:pointer-fine:min-h-0"
              >
                +20 100 058 0504
              </a>
              <p>
                {arabic
                  ? "بيفرلي هيلز، الشيخ زايد، الجيزة، مصر"
                  : "Beverly Hills, Sheikh Zayed, Giza, Egypt"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <FooterColumn
              title={arabic ? "الخدمات" : "Services"}
              titleTo={arabic ? "/ar/services" : "/services"}
            >
              {(services ?? []).slice(0, 6).map((service) => (
                <Link
                  key={service.id}
                  to={arabic ? "/ar/services/$slug" : "/services/$slug"}
                  params={{ slug: service.slug }}
                  className={linkClassName}
                >
                  {service.title}
                </Link>
              ))}
            </FooterColumn>
            <FooterColumn
              title={arabic ? "دراسات الحالة" : "Case Studies"}
              titleTo={arabic ? "/ar/case-studies" : "/case-studies"}
            >
              {caseStudies.map((item) => (
                <Link
                  key={item.id}
                  to={arabic ? "/ar/work/$slug" : "/work/$slug"}
                  params={{ slug: item.slug }}
                  className={linkClassName}
                >
                  {item.title}
                </Link>
              ))}
            </FooterColumn>
            <FooterColumn title={arabic ? "الشركة" : "Company"}>
              {[
                ...activeNav,
                [arabic ? "/ar/contact" : "/contact", arabic ? "تواصل معنا" : "Contact"] as const,
              ].map(([to, label]) => (
                <Link key={to} to={to} className={linkClassName}>
                  {label}
                </Link>
              ))}
            </FooterColumn>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-7 text-xs text-primary-foreground/45 sm:flex-row sm:justify-between">
          <p>
            {arabic ? "© 2026 وجهان. جميع الحقوق محفوظة." : "© 2026 Wijhan. All rights reserved."}
          </p>
          <p>{arabic ? "نخدم الأعمال حول العالم" : "Serving businesses globally"}</p>
        </div>
      </div>
    </footer>
  );
}
