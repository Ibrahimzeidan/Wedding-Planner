type EmptyStateProps = {
  message?: string;
};

export default function EmptyState({ message = "No providers match these filters yet." }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-lg bg-white p-8 text-center text-sm text-stone-600 shadow-sm">
        {message}
      </div>
    </div>
  );
}
