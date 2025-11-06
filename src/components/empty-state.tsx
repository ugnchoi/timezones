'use client';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="rounded-lg border shadow-sm p-10 text-center space-y-3">
      <div className="text-base text-muted-foreground">
        Add cities to see local time & weather.
      </div>
      <Button onClick={onAdd}>➕ Add your first city</Button>
    </div>
  );
}
