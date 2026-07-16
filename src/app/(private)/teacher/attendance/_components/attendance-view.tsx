'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TakeAttendancePanel } from './take-attendance-panel';
import { AttendanceHistoryPanel } from './attendance-history-panel';
import { useTeacherClasses } from '@/hooks/teacher/use-classes';
import { formatClassArmLabel } from '@/lib/utils';

export function AttendanceView() {
  const { data: classArms, isLoading } = useTeacherClasses();
  const [classArmId, setClassArmId] = useState('');

  const activeClassArmId = classArmId || classArms?.[0]?.id || '';

  if (isLoading) {
    return <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />;
  }

  if (!classArms || classArms.length === 0) {
    return (
      <div className="rounded-xl border border-border p-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          You&apos;re not a class teacher for any arm this session, so
          there&apos;s no attendance register to manage here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-semibold text-2xl text-foreground">
            Attendance
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Take and review daily attendance for your class.
          </p>
        </div>

        {classArms.length > 1 && (
          <Select value={activeClassArmId} onValueChange={setClassArmId}>
            <SelectTrigger className="w-44 h-9 border-border font-body text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border shadow-lg">
              {classArms.map((ca) => (
                <SelectItem key={ca.id} value={ca.id} className="font-body">
                  {formatClassArmLabel(ca)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs defaultValue="take" className="w-full">
        <TabsList>
          <TabsTrigger value="take" className="font-body">
            Take Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="font-body">
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="take" className="mt-4">
          <TakeAttendancePanel classArmId={activeClassArmId} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <AttendanceHistoryPanel classArmId={activeClassArmId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
