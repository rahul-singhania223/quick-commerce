import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function Wrapper({ children, className }: Props) {
  return (
    <div className={cn("max-w-7xl w-full h-full", className)}>{children}</div>
  );
}
