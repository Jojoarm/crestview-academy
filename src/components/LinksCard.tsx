import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LinksCardProps {
  href: string;
  label: string;
  sub?: string;
}

export function LinksCard({ href, label, sub }: LinksCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between px-8 py-7 transition-colors duration-200 bg-(--warm-white) hover:bg-terracotta"
    >
      <QuickNavItem label={label} sub={sub} />
    </Link>
  );
}

function QuickNavItem({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {sub && (
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] mb-1 text-terracotta-light group-hover:text-white/60 transition-colors duration-200">
          {sub}
        </p>
      )}
      <div className="flex items-center justify-between">
        <span className="font-heading text-(--charcoal) text-xl group-hover:text-white transition-colors duration-200">
          {label}
        </span>
        <ArrowRight className="size-4 text-terracotta group-hover:text-white group-hover:translate-x-1 transition-all duration-200 shrink-0" />
      </div>
    </div>
  );
}
