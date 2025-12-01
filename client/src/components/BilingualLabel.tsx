import { Label } from "@/components/ui/label";

interface BilingualLabelProps {
  english: string;
  gujarati: string;
  htmlFor?: string;
  required?: boolean;
}

export default function BilingualLabel({ english, gujarati, htmlFor, required }: BilingualLabelProps) {
  return (
    <div className="space-y-0.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {english}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>
      <p className="text-xs text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
        {gujarati}
      </p>
    </div>
  );
}
