import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import wijhanLogoAsset from "@/assets/wijhan-logo.png.asset.json";

const nav = [
  ["/about", "About"],
  ["/services", "Services"],
  ["/work", "Work"],
  ["/process", "Process"],
] as const;

const navAr = [
  ["/ar/about", "عن وِجهان"],
  ["/ar/services", "خدماتنا"],
  ["/ar/work", "أعمالنا"],
  ["/ar/process", "منهجيتنا"],
] as const;

function localizedPath(pathname: string, arabic: boolean) {
  if (arabic) return pathname === "/ar" ? "/" : pathname.replace(/^\/ar/, "") || "/";
  return pathname === "/" ? "/ar" : `/ar${pathname}`;
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="wordmark" aria-label="Wijhan home">
      <img
        src={wijhanLogoAsset.url}
        alt="Wijhan"
        className={cn("wordmark-logo", light && "wordmark-logo--light")}
      />
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const activeNav = arabic ? navAr : nav;

  return (
    <header className="site-header">
      <div className="site-container flex h-20 items-center justify-between">
        <Wordmark />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {activeNav.map(([to, label]) => (
            <Link key={to} to={to} className="nav-link" activeProps={{ className: "nav-link nav-link-active" }}>
              {label}
            </Link>
          ))}
          <Link to={arabic ? "/ar/contact" : "/contact"} className="nav-cta">
            {arabic ? "ابدأ مشروعاً" : "Start a Project"} <ArrowUpRight className="size-4 rtl-mirror" aria-hidden="true" />
          </Link>
          <Link to={localizedPath(pathname, arabic)} className="language-switch" lang={arabic ? "en" : "ar"}>
            {arabic ? "English" : "العربية"}
          </Link>
        </nav>
        <button
          type="button"
          className="icon-control lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? (arabic ? "إغلاق القائمة" : "Close menu") : (arabic ? "فتح القائمة" : "Open menu")}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open ? (
        <nav id="mobile-menu" className="mobile-menu lg:hidden" aria-label="Mobile navigation">
          <div className="site-container flex flex-col py-8">
            {[...activeNav, [arabic ? "/ar/contact" : "/contact", arabic ? "تواصل معنا" : "Contact"] as const].map(([to, label], index) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-border py-4 text-xl"
              >
                <span>{label}</span><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              </Link>
            ))}
            <Link to={localizedPath(pathname, arabic)} onClick={() => setOpen(false)} className="mt-6 text-sm font-semibold text-accent" lang={arabic ? "en" : "ar"}>{arabic ? "English" : "العربية"}</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const arabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const activeNav = arabic ? navAr : nav;
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="site-container py-16 md:py-20">
        <div className="grid gap-14 border-b border-primary-foreground/15 pb-14 md:grid-cols-[1.3fr_.7fr]">
          <div>
            <Wordmark light />
            <p className="mt-7 max-w-md text-lg leading-7 text-primary-foreground/65">
              {arabic ? "شركة هندسة منتجات رقمية" : "Product Engineering Company"}
            </p>
            <p className="mt-2 max-w-md font-display text-2xl text-primary-foreground">
              {arabic ? "«نفهم العمل قبل أن نكتب الكود.»" : "“We understand the business before writing the code.”"}
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-4 self-end text-sm" aria-label="Footer navigation">
            {[...activeNav, [arabic ? "/ar/contact" : "/contact", arabic ? "تواصل معنا" : "Contact"] as const].map(([to, label]) => (
              <Link key={to} to={to} className="text-primary-foreground/65 transition-colors hover:text-primary-foreground">
                {label}
              </Link>
            ))}
            <a href="https://wijhan.com" className="text-primary-foreground/65 transition-colors hover:text-primary-foreground">
              wijhan.com
            </a>
          </nav>
        </div>
        <div className="flex flex-col gap-2 pt-7 text-xs text-primary-foreground/45 sm:flex-row sm:justify-between">
          <p>{arabic ? "© 2026 وِجهان. جميع الحقوق محفوظة." : "© 2026 Wijhan. All rights reserved."}</p>
          <p>{arabic ? "نخدم الأعمال حول العالم" : "Serving businesses globally"}</p>
        </div>
      </div>
    </footer>
  );
}