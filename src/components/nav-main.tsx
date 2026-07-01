'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/lib/nav-config';

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  function isActive(url: string, items?: { url: string }[]) {
    if (items?.length) {
      return items.some((sub) => pathname.startsWith(sub.url));
    }
    // Exact match for dashboard, prefix match for everything else
    return url === '/admin' ? pathname === '/admin' : pathname.startsWith(url);
  }

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel className="font-body text-xs uppercase tracking-widest text-terracotta-light">
        Menu
      </SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => {
          const active = isActive(item.url, item.items);
          const Icon = item.icon;

          return (
            <Collapsible key={item.title} asChild defaultOpen={active}>
              <SidebarMenuItem className="pb-2">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={active && !item.items?.length}
                >
                  <Link href={item.items?.length ? '#' : item.url}>
                    <Icon className="size-4" />
                    <span className="font-body">{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRightIcon />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname.startsWith(subItem.url)}
                            >
                              <Link href={subItem.url}>
                                <span className="font-body">
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
