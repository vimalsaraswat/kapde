import * as React from "react";

import siteConfig from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cn(
        "container flex items-center justify-between gap-4 md:h-20 md:flex-row",
        className,
      )}
    >
      <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
        Built by{" "}
        <a
          href={siteConfig.links.twitter}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          Vimal Saraswat
        </a>
        . The source code is available on{" "}
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
      <ModeToggle />
    </footer>
  );
}
