import { useState } from "react";
import BackgroundToggle from "../BackgroundToggle";

export default function BackgroundToggleExample() {
  const [value, setValue] = useState<"yellow" | "white">("yellow");

  return (
    <div className="p-4 bg-background max-w-md">
      <BackgroundToggle value={value} onChange={setValue} />
      <p className="mt-4 text-sm text-muted-foreground">
        Selected: {value}
      </p>
    </div>
  );
}
