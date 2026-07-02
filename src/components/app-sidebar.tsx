'use client';

import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getNavConfig } from '@/lib/nav-config';
import Image from 'next/image';
import Link from 'next/link';
import { CurrentUser } from '@/lib/types';

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: CurrentUser }) {
  const { navMain } = getNavConfig(user.userRole);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
                href="/"
              >
                <div className="flex items-center py-1">
                  <Image
                    src="/assets/logo/crestview-logo.png"
                    alt="Crestview Academy"
                    width={1962}
                    height={485}
                    priority
                    className="h-7 w-auto object-contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
