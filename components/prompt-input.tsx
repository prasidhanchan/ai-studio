import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "./image-upload";
import Send from "@/public/icons/send";
import { X } from "lucide-react";

interface PromptInputProps {
  input: string;
  setInput: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (newMessage: string, images: string[]) => void;
  isApiKeySet: boolean;
  isLoading: boolean;
  retryAfter: number | null;
  uploadedImages: string[];
  setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PromptInput({
  input,
  setInput,
  handleKeyDown,
  handleSendMessage,
  isApiKeySet,
  isLoading,
  retryAfter,
  uploadedImages,
  setUploadedImages,
}: PromptInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setUploadedImages((prev: string[]) => {
            if (prev.length < 5) return [...prev, result];
            return prev;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div
      className={`relative flex flex-col gap-3 bg-offblack-secondary justify-center items-start ${
        uploadedImages.length > 0 ? "rounded-3xl" : "rounded-4xl"
      } px-4 py-3`}
    >
      {isDragging && (
        <div className="absolute inset-0 rounded-full border-5 border-dashed border-blue-400 pointer-events-none" />
      )}
      <div className={`flex justify-end items-center w-full h-full`}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex-1 rounded-full transition-all`}
        >
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => {
              const items = e.clipboardData?.items;
              if (items) {
                for (let i = 0; i < items.length; i++) {
                  const item = items[i];
                  if (item.type.indexOf("image") !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        setUploadedImages((prev: string[]) => {
                          if (prev.length < 5) return [...prev, result];
                          return prev;
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }
              }
            }}
            placeholder="Start typing a prompt"
            disabled={
              !isApiKeySet ||
              isLoading ||
              (retryAfter !== null && retryAfter > 0)
            }
            className="w-full text-white placeholder-gray-500 border-0 resize-none focus-visible:border-0 focus-visible:ring-0 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed min-h-full max-h-[120px]"
          />
        </div>

        <ImageUpload
          images={uploadedImages}
          onImageUpload={setUploadedImages}
        />

        <Button
          onClick={() => handleSendMessage(input, uploadedImages)}
          disabled={
            !input.trim() ||
            !isApiKeySet ||
            isLoading ||
            (retryAfter !== null && retryAfter > 0)
          }
          className="bg-yellow-400 hover:bg-yellow-600 text-black font-medium rounded-full size-8 ml-2"
        >
          <Send />
        </Button>
      </div>

      {uploadedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 px-2">
          {uploadedImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-[200] object-cover rounded"
              />
              <button
                onClick={() =>
                  setUploadedImages((prev) => prev.filter((_, i) => i !== idx))
                }
                className="absolute top-2 right-2 bg-black rounded-full size-8 cursor-pointer flex items-center justify-center text-white text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
