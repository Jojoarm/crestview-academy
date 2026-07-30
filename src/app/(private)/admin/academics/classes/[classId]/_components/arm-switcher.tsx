'use client';

import { cn } from '@/lib/utils';
import type { ClassLevel } from '@/types/class';

interface ArmSwitcherProps {
  classLevel: ClassLevel;
  activeArmId: string;
  onArmChange: (armId: string) => void;
}

export function ArmSwitcher({
  classLevel,
  activeArmId,
  onArmChange,
}: ArmSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {classLevel.classArms.map((ca) => (
        <button
          key={ca.id}
          type="button"
          onClick={() => onArmChange(ca.id)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-body font-medium transition-colors',
            ca.id === activeArmId
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/70',
          )}
        >
          Arm {ca.arm.name}
          <span className="ml-1 opacity-70">({ca.capacity})</span>
        </button>
      ))}
    </div>
  );
}
