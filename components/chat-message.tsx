"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePreviewModal } from "./image-preview-modal";
import Star from "@/public/icons/star";
import Delete from "@/public/icons/delete";
import Check from "@/public/icons/check";
import Copy from "@/public/icons/copy";
import Edit from "@/public/icons/edit";
import Fullscreen from "@/public/icons/fullscreen";
import Download from "@/public/icons/download";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "./ui/textarea";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  images?: string[];
  isEditing?: boolean;
  generationTime?: number;
}

export function ChatMessage({
  message,
  onEdit,
  onDelete,
  onReSubmit,
}: {
  message: Message;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReSubmit: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  const handleDownloadImage = (image: string) => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `generated-image-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={selectedImage || ""}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedImage(null);
        }}
        timestamp={`Generated Image ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}.png`}
      />

      <div
        className="relative flex justify-center w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating button group above message */}
        <div
          className={`absolute bg-offblack-secondary rounded-full p-1 -top-5 right-4 z-10 flex gap-2 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {!isEditing ? (
            <>
              {message.role === "user" ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                    title="Edit"
                  >
                    <Edit />
                  </Button>
                  <Button
                    onClick={onReSubmit}
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-yellow-400 hover:bg-white/10 rounded-full"
                    title="Resend"
                  >
                    <Star />
                  </Button>
                  <Button
                    onClick={() => onDelete(message.id)}
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full"
                    title="Delete"
                  >
                    <Delete />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(message.content)
                    }
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                    title="Copy"
                  >
                    <Copy />
                  </Button>
                  <Button
                    onClick={onReSubmit}
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-yellow-400 hover:bg-white/10 rounded-full"
                    title="Resend"
                  >
                    <Star />
                  </Button>
                  <Button
                    onClick={() => onDelete(message.id)}
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full"
                    title="Delete"
                  >
                    <Delete />
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button
              onClick={handleSave}
              size="icon"
              variant="outline"
              className="border-[#2a2a2a] text-white hover:text-gray-400 hover:bg-white/10 rounded-full border-0"
              title="Save"
            >
              <Check />
            </Button>
          )}
        </div>

        {/* Message Box */}
        <div
          className={`border rounded-lg p-4 w-full transition-all ${
            isHovered ? "border-[#3d3d3d]" : "border-transparent"
          }`}
        >
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-2">
              {message.role === "user" ? "User" : "Model"}
            </p>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="border-0 text-white focus-visible:ring-0 p-0 resize-none min-h-0"
                />

                <div className="flex gap-5">
                  {message.images &&
                    message.images?.length > 0 &&
                    message.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt="Generated"
                        className="rounded-lg max-h-56 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ))}
                </div>
              </div>
            ) : (
              <>
                <div className="min-w-full text-sm text-white prose pb-2">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children, ...props }) => (
                        <a
                          href={href}
                          target="_blank" // opens in a new tab
                          rel="noopener noreferrer"
                          className="text-brand"
                          {...props}
                        >
                          {children}
                        </a>
                      ),
                      // override <strong> (used for **bold**)
                      strong: ({ children, ...props }) => (
                        <span
                          {...props}
                          className="font-semibold" // replace bold with semibold
                        >
                          {children}
                        </span>
                      ),
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>

                <div className="flex gap-5">
                  {message.images &&
                    message.images?.length > 0 &&
                    message.images.map((image, index) => (
                      <div
                        key={index}
                        className="mt-4 relative group cursor-pointer max-h-96"
                        onClick={() => {
                          setIsPreviewOpen(true);
                          setSelectedImage(image);
                        }}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt="Generated"
                          className="rounded-lg max-h-56 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute bottom-2 left-1 right-0 max-w-[90px] bg-offblack opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full flex justify-center gap-2 p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image);
                              setIsPreviewOpen(true);
                            }}
                            className="rounded-full"
                            title="Fullscreen"
                          >
                            <Fullscreen className="text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadImage(image);
                            }}
                            className="rounded-full"
                            title="Download"
                          >
                            <Download className="text-white" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
