'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimetableGrid } from './_components/timetable-grid';
import { PeriodSlotsTab } from './_components/period-slots-tab';
import { TimetableClassArmSelector } from './_components/timetable-class-arm-selector';
import type { Section } from '@/types/class';

export default function TimetablePage() {
  const [selectedClassArmId, setSelectedClassArmId] = useState<string | null>(
    null,
  );
  const [selectedSection, setSelectedSection] = useState<Section | ''>('');
  const [selectedLabel, setSelectedLabel] = useState('');

  return (
    <Tabs defaultValue="timetable" className="flex flex-col gap-6">
      <TabsList className="bg-muted border border-border w-fit">
        <TabsTrigger
          value="timetable"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Timetable
        </TabsTrigger>
        <TabsTrigger
          value="period-slots"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Period Slots
        </TabsTrigger>
      </TabsList>

      <TabsContent value="timetable" className="mt-0 flex flex-col gap-6">
        <TimetableClassArmSelector
          selectedClassArmId={selectedClassArmId}
          onSelect={(classArmId, label, section) => {
            setSelectedClassArmId(classArmId);
            setSelectedLabel(label);
            setSelectedSection(section);
          }}
        />

        {selectedClassArmId ? (
          <TimetableGrid
            classArmId={selectedClassArmId}
            section={selectedSection}
            label={selectedLabel}
          />
        ) : (
          <div className="bg-card/40 border border-border p-12 text-center">
            <p className="font-body text-sm text-deep-violet">
              Select a class and arm above to view or edit its timetable.
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="period-slots" className="mt-0">
        <PeriodSlotsTab />
      </TabsContent>
    </Tabs>
  );
}
