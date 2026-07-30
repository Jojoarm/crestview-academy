'use client';

import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ClassArmStudent } from '@/types/class';

interface RosterTableProps {
  students: ClassArmStudent[];
  selectedIds: Set<string>;
  onToggle: (studentId: string) => void;
  onToggleAll: () => void;
}

export function RosterTable({
  students,
  selectedIds,
  onToggle,
  onToggleAll,
}: RosterTableProps) {
  const allSelected =
    students.length > 0 && students.every((s) => selectedIds.has(s.id));

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border/30 hover:bg-transparent">
          <TableHead className="w-10">
            <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
          </TableHead>
          <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground">
            Student
          </TableHead>
          <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground">
            Admission No.
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id} className="border-border/20">
            <TableCell>
              <Checkbox
                checked={selectedIds.has(student.id)}
                onCheckedChange={() => onToggle(student.id)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 image-border shrink-0">
                  <AvatarImage
                    src={student.photoUrl ?? undefined}
                    alt={student.user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-deep-violet image-border text-primary-foreground text-xs font-body font-medium">
                    {getInitials(student.user.name)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-body text-sm text-foreground">
                  {student.user.name}
                </p>
              </div>
            </TableCell>
            <TableCell className="font-body text-sm text-muted-foreground tabular-nums">
              {student.admissionNumber}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
