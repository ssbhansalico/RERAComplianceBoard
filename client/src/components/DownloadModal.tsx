import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  downloadType: "PNG" | "PDF";
}

export default function DownloadModal({ isOpen, onClose, onDownload, downloadType }: DownloadModalProps) {
  const handleDownload = () => {
    onDownload();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Download {downloadType}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Click below to download your RERA board as a {downloadType}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleDownload}
            data-testid="button-download-submit"
          >
            Download {downloadType}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
