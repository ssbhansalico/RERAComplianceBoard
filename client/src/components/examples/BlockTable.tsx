import { useState } from "react";
import BlockTable, { type BlockEntry } from "../BlockTable";

export default function BlockTableExample() {
  const [blocks, setBlocks] = useState<BlockEntry[]>([
    { id: "1", blockName: "A", shops: "5", offices: "10", residential: "20" },
    { id: "2", blockName: "B", shops: "0", offices: "15", residential: "25" },
  ]);

  return (
    <div className="p-4 bg-background">
      <BlockTable blocks={blocks} onBlocksChange={setBlocks} />
    </div>
  );
}
