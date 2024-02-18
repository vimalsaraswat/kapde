"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import SiteConfig from "@/config/site";

type NavItem = {
  title: string;
  href: string;
  description?: string;
};

export function MainNav({ items }: { items: NavItem[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuLink asChild>
          <Link href="/" className="text-xl font-bold">
            {SiteConfig.name}
          </Link>
        </NavigationMenuLink>

        {items.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[200px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
                {items.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, href, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || "#"}
          className={cn(
            "group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            <span>{title}</span>
            <ArrowRightIcon className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
