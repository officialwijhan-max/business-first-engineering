import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The one pill-shaped button used for every tab, filter, toggle, chip, and
 * secondary CTA across the site: same radius, sizing, and states everywhere,
 * so a filter tab on /work and a "View Our Work" link look like siblings.
 *
 * - variant="tab": interactive tab/filter/toggle — pass `active` to switch
 *   between the accent-tinted active look and the neutral inactive one.
 * - variant="outline": a plain secondary button (no active state) — pass
 *   `tone="dark"` when it sits on a dark/primary background (hero sections)
 *   so it uses the primary-foreground tokens instead of the light-bg ones.
 */
const pillButtonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border font-bold leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      size: {
        default: "px-3 py-2.5 text-[.8rem]",
        lg: "px-6 py-3 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type PillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof pillButtonVariants> & {
    asChild?: boolean;
    /** "tab": active/inactive tab, filter, or toggle. "outline": plain secondary button. */
    variant?: "tab" | "outline";
    /** Only meaningful for variant="tab" — selected/pressed state. */
    active?: boolean;
    /** Which background it sits on. "dark" swaps outline buttons to primary-foreground tokens and active tabs to a solid accent fill. */
    tone?: "light" | "dark";
    /** Optional leading icon; placed first in markup so it mirrors correctly in RTL. */
    icon?: React.ComponentType<{ className?: string }>;
  };

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      className,
      size,
      variant = "outline",
      active = false,
      tone = "light",
      icon: Icon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = props.asChild ? Slot : "button";
    const { asChild: _asChild, ...rest } = props;

    const stateClasses =
      variant === "tab"
        ? active
          ? tone === "dark"
            ? "pill-button--active border-accent bg-accent text-accent-foreground"
            : "pill-button--active border-accent bg-accent/12 text-accent"
          : "border-border bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground"
        : tone === "dark"
          ? "border-primary-foreground/35 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          : "border-input bg-background text-foreground hover:border-accent hover:text-accent";

    // Slot (asChild) requires exactly one child element — only wrap in a
    // fragment when there's actually an icon to add; otherwise pass the
    // single child straight through so Slot can clone it directly.
    const content = Icon ? (
      <>
        <Icon className="size-4" aria-hidden="true" />
        {children}
      </>
    ) : (
      children
    );

    return (
      <Comp
        ref={ref}
        className={cn(pillButtonVariants({ size, className }), stateClasses)}
        {...rest}
      >
        {content}
      </Comp>
    );
  },
);
PillButton.displayName = "PillButton";

export { PillButton, pillButtonVariants };
