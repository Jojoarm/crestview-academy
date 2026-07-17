'use client';

import { useMemo, useState } from 'react';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ApiError } from '@/lib/api-client';

import { TimetableGrid } from './timetable-grid';
import { useTeacherTimetable } from '@/hooks/teacher/use-timetable';

interface ClassArmOption {
  key: string;
  classLevel: string;
  arm: string;
}

export function TimetableView() {
  const { data: entries, isLoading, error } = useTeacherTimetable();
  const [classArmKey, setClassArmKey] = useState('');

  // Distinct homeroom class arms this teacher is the class teacher for —
  // usually one, but a teacher could conceivably have more than one.
  const classArmOptions = useMemo<ClassArmOption[]>(() => {
    const map = new Map<string, ClassArmOption>();
    (entries ?? [])
      .filter((e) => e.roles.includes('ClassTeacher'))
      .forEach((e) => {
        const key = `${e.classArm.classLevel}__${e.classArm.arm}`;
        if (!map.has(key)) {
          map.set(key, {
            key,
            classLevel: e.classArm.classLevel,
            arm: e.classArm.arm,
          });
        }
      });
    return Array.from(map.values());
  }, [entries]);

  const activeClassArmKey = classArmKey || classArmOptions[0]?.key || '';

  const classTimetableEntries = useMemo(() => {
    if (!entries) return [];
    return entries.filter(
      (e) =>
        e.roles.includes('ClassTeacher') &&
        `${e.classArm.classLevel}__${e.classArm.arm}` === activeClassArmKey,
    );
  }, [entries, activeClassArmKey]);

  // Subject periods taught elsewhere — explicitly excludes anything that's
  // also part of the teacher's own homeroom, since the Class Timetable tab
  // already shows that class's full schedule (including periods they
  // personally teach there). No duplication between the two tabs.
  const subjectTimetableEntries = useMemo(() => {
    if (!entries) return [];
    return entries.filter(
      (e) =>
        e.roles.includes('SubjectTeacher') && !e.roles.includes('ClassTeacher'),
    );
  }, [entries]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Header />
        <Card className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {error instanceof ApiError
              ? error.message
              : 'Could not load your timetable.'}
          </p>
        </Card>
      </div>
    );
  }

  const hasClassTimetable = classArmOptions.length > 0;
  const hasSubjectTimetable = subjectTimetableEntries.length > 0;

  if (!hasClassTimetable && !hasSubjectTimetable) {
    return (
      <div className="space-y-6">
        <Header />
        <Card className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            No timetable has been set up for you yet.
          </p>
        </Card>
      </div>
    );
  }

  // Only one of the two applies to this teacher — skip the tab chrome.
  if (hasClassTimetable && !hasSubjectTimetable) {
    return (
      <div className="space-y-6">
        <Header />
        {classArmOptions.length > 1 && (
          <ClassArmSwitcher
            options={classArmOptions}
            value={activeClassArmKey}
            onChange={setClassArmKey}
          />
        )}
        <TimetableGrid entries={classTimetableEntries} showClassArm={false} />
      </div>
    );
  }

  if (!hasClassTimetable && hasSubjectTimetable) {
    return (
      <div className="space-y-6">
        <Header />
        <TimetableGrid
          entries={subjectTimetableEntries}
          emptyMessage="No subject periods scheduled yet."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />
      <Tabs defaultValue="class" className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="class" className="font-body">
              Class Timetable
            </TabsTrigger>
            <TabsTrigger value="subject" className="font-body">
              My Subject Periods
            </TabsTrigger>
          </TabsList>
          {classArmOptions.length > 1 && (
            <ClassArmSwitcher
              options={classArmOptions}
              value={activeClassArmKey}
              onChange={setClassArmKey}
            />
          )}
        </div>
        <TabsContent value="class" className="mt-4">
          <TimetableGrid entries={classTimetableEntries} showClassArm={false} />
        </TabsContent>
        <TabsContent value="subject" className="mt-4">
          <TimetableGrid entries={subjectTimetableEntries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="font-sans font-semibold text-2xl text-foreground">
        My Timetable
      </h1>
      <p className="font-body text-sm text-muted-foreground">
        Your class&apos;s full schedule, and the periods you personally teach
        elsewhere.
      </p>
    </div>
  );
}

function ClassArmSwitcher({
  options,
  value,
  onChange,
}: {
  options: ClassArmOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-44 h-9 border-border font-body text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-background border-border shadow-lg">
        {options.map((o) => (
          <SelectItem key={o.key} value={o.key} className="font-body">
            {o.classLevel} {o.arm}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
