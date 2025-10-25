"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Download from "@/public/icons/download";

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  timestamp?: string;
}

export function ImagePreviewModal({
  isOpen,
  imageUrl,
  onClose,
  timestamp,
}: ImagePreviewModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-image-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#2a2a2a] border-[#3d3d3d] rounded-xl px-4 py-5 max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-white text-md font-medium">
            {timestamp ||
              `Generated Image ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}.png`}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-400 hover:bg-transparent"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-400 hover:bg-transparent"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Generated"
            className="max-h-[70vh] max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
