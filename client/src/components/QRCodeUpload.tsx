import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  imageUrl: string | null;
}

export default function QRCodeUpload({ onImageChange, imageUrl }: QRCodeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">QR Code Image</span>
        <span className="text-red-600">*</span>
      </div>
      <p className="text-xs text-muted-foreground" lang="gu" style={{ fontFamily: "'Noto Sans Gujarati', sans-serif" }}>
        ક્યુઆર કોડ ઈમેજ (ઓછામાં ઓછું 15 સે.મી. x 15 સે.મી.)
      </p>
      
      {imageUrl ? (
        <div className="relative border rounded-md p-4 bg-card">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 border rounded overflow-hidden bg-white flex items-center justify-center">
              <img src={imageUrl} alt="QR Code Preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">QR Code Uploaded</p>
              <p className="text-xs text-muted-foreground">Click Replace to change the image</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                data-testid="button-replace-qr"
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                data-testid="button-remove-qr"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center transition-colors cursor-pointer ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          data-testid="dropzone-qr"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              {isDragging ? (
                <ImageIcon className="h-6 w-6 text-primary" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop your QR code image here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse (PNG, JPG, JPEG)
              </p>
            </div>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
        data-testid="input-qr-file"
      />
    </div>
  );
}
