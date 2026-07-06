'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClasses } from '@/hooks/admin/use-classes';
import type { ClassLevel, Section } from '@/types/class';

type Props = {
  selectedClassArmId: string | null;
  onSelect: (classArmId: string, label: string, section: Section) => void;
};

export function TimetableClassArmSelector({
  selectedClassArmId,
  onSelect,
}: Props) {
  const [selectedClassId, setSelectedClassId] = useState('');
  const { data } = useClasses();
  const classes = data?.data ?? [];

  const selectedClass = classes.find(
    (c: ClassLevel) => c.id === selectedClassId,
  );
  const arms = selectedClass?.classArms ?? [];

  function handleArmChange(classArmId: string) {
    const arm = arms.find((a) => a.id === classArmId);
    if (!arm || !selectedClass) return;
    onSelect(
      classArmId,
      `${selectedClass.name} — Arm ${arm.arm.name}`,
      selectedClass.section,
    );
  }

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-sans font-semibold text-lg text-foreground">
          Select Class Arm
        </h2>
        <p className="font-body text-xs text-muted-foreground mt-0.5">
          Choose a class and arm to view or build its timetable
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
          <SelectTrigger className="h-11 border-border font-body sm:max-w-56">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border shadow-lg">
            {classes.map((c: ClassLevel) => (
              <SelectItem key={c.id} value={c.id} className="font-body">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedClassArmId ?? ''}
          onValueChange={handleArmChange}
          disabled={!selectedClassId || arms.length === 0}
        >
          <SelectTrigger className="h-11 border-border font-body sm:max-w-56">
            <SelectValue
              placeholder={
                !selectedClassId
                  ? 'Select class first'
                  : arms.length === 0
                    ? 'No arms assigned'
                    : 'Select arm'
              }
            />
          </SelectTrigger>
          <SelectContent className="bg-background border-border shadow-lg">
            {arms.map((ca) => (
              <SelectItem key={ca.id} value={ca.id} className="font-body">
                Arm {ca.arm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
