'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeeStructures, useFeeTypes } from '@/hooks/admin/use-fees';
import type { FeeStructure, FeeType } from '@/types/fee';
import { FeeTypeStructureCard } from './fee-type-structure-card';
import { CreateFeeStructureSheet } from './create-fee-structure-sheet';

export function FeeStructuresTab() {
  const [createOpen, setCreateOpen] = useState(false);
  const [preselectedFeeTypeId, setPreselectedFeeTypeId] = useState<
    string | null
  >(null);

  const { data: feeTypesData, isLoading: typesLoading } = useFeeTypes();
  const { data: structuresData, isLoading: structuresLoading } =
    useFeeStructures();

  const feeTypes = feeTypesData?.data ?? [];
  const structures = structuresData?.data ?? [];
  const isLoading = typesLoading || structuresLoading;

  // Group structures by feeTypeId
  const structuresByFeeType = structures.reduce<Record<string, FeeStructure[]>>(
    (acc, s) => {
      if (!acc[s.feeTypeId]) acc[s.feeTypeId] = [];
      acc[s.feeTypeId].push(s);
      return acc;
    },
    {},
  );

  function handleAddStructure(feeTypeId: string) {
    setPreselectedFeeTypeId(feeTypeId);
    setCreateOpen(true);
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-semibold text-lg text-foreground">
              Fee Structures
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              Grouped by fee type, each card shows amounts across classes and
              terms
            </p>
          </div>
          <Button
            onClick={() => {
              setPreselectedFeeTypeId(null);
              setCreateOpen(true);
            }}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Structure
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-card/40 border border-border p-5 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-7 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-px bg-border" />
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-10 bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : feeTypes.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="font-body text-sm text-muted-foreground">
              No fee types yet. Create a fee type first, then add structures to
              it.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {feeTypes.map((feeType: FeeType) => (
              <FeeTypeStructureCard
                key={feeType.id}
                feeType={feeType}
                structures={structuresByFeeType[feeType.id] ?? []}
                onAddStructure={() => handleAddStructure(feeType.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateFeeStructureSheet
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setPreselectedFeeTypeId(null);
        }}
        preselectedFeeTypeId={preselectedFeeTypeId}
      />
    </>
  );
}
