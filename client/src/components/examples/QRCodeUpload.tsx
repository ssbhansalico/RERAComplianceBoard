import { useState } from "react";
import QRCodeUpload from "../QRCodeUpload";

export default function QRCodeUploadExample() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="p-4 bg-background max-w-md">
      <QRCodeUpload imageUrl={imageUrl} onImageChange={setImageUrl} />
    </div>
  );
}
