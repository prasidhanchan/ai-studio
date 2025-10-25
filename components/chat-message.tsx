"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { ImagePreviewModal } from "./image-preview-modal";
import Star from "@/public/icons/star";
import Delete from "@/public/icons/delete";
import Check from "@/public/icons/check";
import Copy from "@/public/icons/copy";
import Edit from "@/public/icons/edit";
import Fullscreen from "@/public/icons/fullscreen";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  image?: string;
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
  const [showTime, setShowTime] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  const handleDownloadImage = () => {
    if (!message.image) return;
    const link = document.createElement("a");
    link.href = message.image;
    link.download = `generated-image-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    if (seconds < 1) return `${String(seconds.toFixed(2))}s`;
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={message.image || ""}
        onClose={() => setIsPreviewOpen(false)}
        timestamp={`Generated Image ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}.png`}
      />

      <div
        className={`flex gap-4 justify-center w-full`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`border border-transparent hover:border-[#3d3d3d] rounded-lg p-4 w-full`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {message.role === "user" && (
                <p className="text-xs text-gray-400 mb-2">User</p>
              )}
              {message.role === "model" && (
                <p className="text-xs text-gray-400 mb-2">Model</p>
              )}
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="border-0 text-white focus-visible:border-0 focus-visible:ring-0"
                  />
                </div>
              ) : (
                <>
                  <p className="text-sm text-white whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.image && (
                    <div
                      className="mt-4 relative group cursor-pointer max-h-96"
                      onMouseEnter={() => setShowTime(true)}
                      onMouseLeave={() => setShowTime(false)}
                      onClick={() => setIsPreviewOpen(true)}
                    >
                      <img
                        src={message.image || "/placeholder.svg"}
                        alt="Generated"
                        className="rounded-lg max-h-96 object-cover"
                        onError={(e) => {
                          console.log("Image failed to load:", message.image);
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      {/* {showTime && message.generationTime !== undefined && (
                        <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-sm text-white">
                          {formatTime(message.generationTime)}
                        </div>
                      )} */}

                      {/* Bottom center action bar */}
                      <div className="absolute bottom-2 left-1 right-0 max-w-[90px] bg-offblack hover:bg-offblack opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 rounded-full flex justify-center gap-2 p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPreviewOpen(true);
                          }}
                          className="shrink-0 bg-transparent rounded-full"
                          title="View fullscreen"
                        >
                          <Fullscreen className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage();
                          }}
                          className="p-2 shrink-0 rounded-full"
                          title="Download image"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div
              className={`relative p-1 rounded-full bg-offblack-secondary -top-10 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {!isEditing ? (
                <div className="flex gap-2">
                  {message.role === "user" && (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                      >
                        <Edit />
                      </Button>

                      {/* Star */}
                      <Button
                        onClick={onReSubmit}
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full"
                      >
                        <Star />
                      </Button>

                      {/* delete */}
                      <Button
                        onClick={() => onDelete(message.id)}
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full"
                      >
                        <Delete />
                      </Button>
                    </>
                  )}

                  {message.role === "model" && (
                    <>
                      <Button
                        onClick={() =>
                          navigator.clipboard.writeText(message.content)
                        }
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                      >
                        <Copy />
                      </Button>

                      {/* Star */}
                      <Button
                        onClick={onReSubmit}
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full"
                      >
                        <Star />
                      </Button>

                      {/* Delete */}
                      <Button
                        onClick={() => onDelete(message.id)}
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-full"
                      >
                        <Delete />
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    handleSave();
                  }}
                  size="icon"
                  variant="outline"
                  className="border-[#2a2a2a] text-white hover:text-gray-400 bg-transparent! hover:bg-white/10! rounded-full border-0"
                >
                  <Check />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
