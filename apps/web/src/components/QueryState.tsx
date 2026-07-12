import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  children: ReactNode;
}

// Every API-backed list renders the same three states before its data:
// loading → error → empty. This wraps that boilerplate so each tab stays focused
// on its actual content.
export default function QueryState({
  isLoading,
  isError,
  isEmpty,
  emptyMessage = "Nothing recorded yet.",
  errorMessage = "Couldn't load this data.",
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-600 rounded-lg py-6 text-center text-sm">
        {errorMessage}
      </div>
    );
  }

  if (isEmpty) {
    return <p className="text-sm text-muted-foreground text-center py-8">{emptyMessage}</p>;
  }

  return <>{children}</>;
}
