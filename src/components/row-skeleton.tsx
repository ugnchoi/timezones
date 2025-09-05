export function RowSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-3 py-3 animate-pulse">
      <div>
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="mt-2 h-3 w-20 rounded bg-muted" />
      </div>
      <div className="h-7 w-16 rounded bg-muted justify-self-start" />
      <div className="h-5 w-24 rounded bg-muted justify-self-end" />
    </div>
  );
}
