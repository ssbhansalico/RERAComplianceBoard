import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface BlockEntry {
  id: string;
  blockName: string;
  shops: string;
  offices: string;
  residential: string;
}

interface BlockTableProps {
  blocks: BlockEntry[];
  onBlocksChange: (blocks: BlockEntry[]) => void;
}

export default function BlockTable({ blocks, onBlocksChange }: BlockTableProps) {
  const addBlock = () => {
    const newBlock: BlockEntry = {
      id: crypto.randomUUID(),
      blockName: "",
      shops: "0",
      offices: "0",
      residential: "0",
    };
    onBlocksChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      onBlocksChange(blocks.filter((b) => b.id !== id));
    }
  };

  const updateBlock = (id: string, field: keyof BlockEntry, value: string) => {
    onBlocksChange(
      blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  return (
    <div className="space-y-3">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-foreground">
          Block Details / Unit Distribution
        </h3>
        <p className="text-xs text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
          બ્લોક નંબર અને તેમાં શોપ્સ, ઓફીસ અને રેસિડેન્શિયલની સંખ્યા
        </p>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium">Block No./Name</span>
                  <p className="text-xs font-normal text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
                    બ્લોક નંબર
                  </p>
                </div>
              </TableHead>
              <TableHead>
                <div className="space-y-0.5">
                  <span className="text-xs font-medium">Shops</span>
                  <p className="text-xs font-normal text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
                    શોપ્સની સંખ્યા
                  </p>
                </div>
              </TableHead>
              <TableHead>
                <div className="space-y-0.5">
                  <span className="text-xs font-medium">Offices</span>
                  <p className="text-xs font-normal text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
                    ઓફીસની સંખ્યા
                  </p>
                </div>
              </TableHead>
              <TableHead>
                <div className="space-y-0.5">
                  <span className="text-xs font-medium">Residential</span>
                  <p className="text-xs font-normal text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
                    રેસિડેન્શિયલની સંખ્યા
                  </p>
                </div>
              </TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((block, index) => (
              <TableRow key={block.id} className={index % 2 === 0 ? "" : "bg-muted/30"}>
                <TableCell>
                  <Input
                    value={block.blockName}
                    onChange={(e) => updateBlock(block.id, "blockName", e.target.value)}
                    placeholder="e.g., A, B, Tower-1"
                    className="h-8 text-sm"
                    data-testid={`input-block-name-${index}`}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={block.shops}
                    onChange={(e) => updateBlock(block.id, "shops", e.target.value)}
                    className="h-8 text-sm"
                    data-testid={`input-block-shops-${index}`}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={block.offices}
                    onChange={(e) => updateBlock(block.id, "offices", e.target.value)}
                    className="h-8 text-sm"
                    data-testid={`input-block-offices-${index}`}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={block.residential}
                    onChange={(e) => updateBlock(block.id, "residential", e.target.value)}
                    className="h-8 text-sm"
                    data-testid={`input-block-residential-${index}`}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBlock(block.id)}
                    disabled={blocks.length <= 1}
                    className="h-8 w-8"
                    data-testid={`button-remove-block-${index}`}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addBlock}
        className="gap-1"
        data-testid="button-add-block"
      >
        <Plus className="h-4 w-4" />
        Add Block
      </Button>
    </div>
  );
}
