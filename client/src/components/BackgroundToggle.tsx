import { cn } from "@/lib/utils";

interface BackgroundToggleProps {
  value: "yellow" | "white";
  onChange: (value: "yellow" | "white") => void;
}

export default function BackgroundToggle({ value, onChange }: BackgroundToggleProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-foreground">
          Board Background Color
        </h3>
        <p className="text-xs text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
          બોર્ડની પૃષ્ઠભૂમિનો રંગ
        </p>
      </div>
      
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange("yellow")}
          className={cn(
            "flex-1 p-4 rounded-md border-2 transition-all flex flex-col items-center gap-2",
            value === "yellow"
              ? "border-primary bg-primary/5"
              : "border-muted hover:border-primary/50"
          )}
          data-testid="button-bg-yellow"
        >
          <div className="w-12 h-12 rounded-md bg-yellow-300 border border-yellow-400"></div>
          <span className="text-sm font-medium">Yellow / પીળો</span>
        </button>
        
        <button
          type="button"
          onClick={() => onChange("white")}
          className={cn(
            "flex-1 p-4 rounded-md border-2 transition-all flex flex-col items-center gap-2",
            value === "white"
              ? "border-primary bg-primary/5"
              : "border-muted hover:border-primary/50"
          )}
          data-testid="button-bg-white"
        >
          <div className="w-12 h-12 rounded-md bg-white border border-gray-300"></div>
          <span className="text-sm font-medium">White / સફેદ</span>
        </button>
      </div>
    </div>
  );
}
