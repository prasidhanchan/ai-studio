"use client";

import type React from "react";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Add from "@/public/icons/add";

export function ImageUpload({
  onImageUpload,
}: {
  onImageUpload: (image: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }

    // Reset so same file can be picked again
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="ghost"
        size="icon"
        className=" text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-full"
      >
        <Add />
      </Button>
    </>
  );
}
