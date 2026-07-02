'use client';

import { useState } from 'react';
import { ClassArmSelector } from './_components/class-arm-selector';
import { AssignmentPanel } from './_components/assignment-panel';

export default function TeacherAssignmentsPage() {
  const [selectedClassArmId, setSelectedClassArmId] = useState<string | null>(
    null,
  );
  const [selectedClassArmLabel, setSelectedClassArmLabel] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <ClassArmSelector
        selectedClassArmId={selectedClassArmId}
        onSelect={(classArmId, label, section) => {
          setSelectedClassArmId(classArmId);
          setSelectedClassArmLabel(label);
          setSelectedSection(section);
        }}
      />

      {selectedClassArmId ? (
        <AssignmentPanel
          classArmId={selectedClassArmId}
          label={selectedClassArmLabel}
          section={selectedSection}
        />
      ) : (
        <div className="bg-card/30 border border-border p-12 text-center">
          <p className="font-body text-sm text-violet">
            Select a class and arm above to continue with teacher assignments.
          </p>
        </div>
      )}
    </div>
  );
}
