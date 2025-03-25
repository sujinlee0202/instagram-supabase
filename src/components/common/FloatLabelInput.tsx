import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FloatLabelInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function FloatLabelInput({ id, label, type = "text", value, onChange, className }: FloatLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const shouldFloat = isFocused || value.length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn("peer h-10 px-3", "border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring")}
      />
      <Label
        htmlFor={id}
        className={cn("absolute left-3 bg-white px-1 text-muted-foreground transition-all duration-200 ease-in-out", shouldFloat ? "text-xs -top-2.5" : "text-sm top-1/2 -translate-y-1/2")}
      >
        {label}
      </Label>
    </div>
  );
}
