"use client";

import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Add from "@/public/icons/add";

export function ImageUpload({
  images,
  onImageUpload,
}: {
  images: string[];
  onImageUpload: (images: string[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files).slice(0, 5); // max 5
    const newImages: string[] = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newImages.push(result);

        // Once all files are read, append to existing images
        if (newImages.length === selectedFiles.length) {
          const combined = [...images, ...newImages].slice(0, 5); // max 5
          onImageUpload(combined);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ""; // reset input
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-full"
      >
        <Add />
      </Button>
    </>
  );
}
