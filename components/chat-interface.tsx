"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./chat-message";
import { ImageUpload } from "./image-upload";
import { AlertCircle, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import Star from "@/public/icons/star";
import Send from "@/public/icons/send";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  image?: string;
  isEditing?: boolean;
  generationTime?: number;
}

interface ChatInterfaceProps {
  apiKey: string;
  isApiKeySet: boolean;
  temperature: number;
  aspectRatio: string;
  outputLength: number;
  topP: number;
  systemInstructions: string;
}

export function ChatInterface({
  apiKey,
  isApiKeySet,
  temperature,
  aspectRatio,
  outputLength,
  topP,
  systemInstructions,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (isLoading && generationStartTime) {
      const timer = setInterval(() => {
        setElapsedTime((Date.now() - generationStartTime) / 1000);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isLoading, generationStartTime]);

  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setTimeout(() => {
        setRetryAfter(retryAfter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (retryAfter === 0) {
      setRetryAfter(null);
      setError(null);
    }
  }, [retryAfter]);

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || !isApiKeySet || isLoading) return;

    setError(null);
    setRetryAfter(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
      image: uploadedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setUploadedImage(null);
    setIsLoading(true);
    setGenerationStartTime(Date.now());
    setElapsedTime(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          prompt: newMessage,
          image: uploadedImage,
          systemInstruction: systemInstructions,
          temperature,
          aspectRatio,
          outputLength,
          topP,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            image: msg.image,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const finalTime =
          (Date.now() - (generationStartTime || Date.now())) / 1000;
        const modelMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: data.text || "",
          image: data.image || undefined,
          generationTime: finalTime,
        };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        setError(data.error || "Failed to generate content");
        if (data.retryAfter) {
          setRetryAfter(data.retryAfter);
        }
        // Remove the failed user message
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please check your connection and try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setGenerationStartTime(null);
      setElapsedTime(0);
    }
  };

  const handleEditMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, content: newContent, isEditing: false } : msg
      )
    );
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-40 lg:pb-10 space-y-6 scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="flex gap-2 justify-center items-center text-4xl sm:text-5xl font-medium mb-2">
                <Star className="size-[42px] sm:size-[52px]" />
                AI Studio
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Enter your API key in the sidebar to begin
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReSubmit={() => {
                  if (message.role === "model") {
                    const prevContent = messages.find(
                      (_, idx) => idx === index - 1
                    )?.content;

                    if (!prevContent) return;

                    handleSendMessage(prevContent);

                    // Delete Messages including the current one
                    setMessages((prev) =>
                      prev.filter((msg) => msg.id < message.id)
                    );
                    return;
                  }

                  handleSendMessage(message.content);

                  // Delete Messages after the current one
                  setMessages((prev) =>
                    prev.filter((msg) => msg.id <= message.id)
                  );
                }}
              />
            ))}
            {isLoading && (
              <div className="flex flex-col items-start gap-4 border border-transparent hover:border-[#3d3d3d] rounded-lg p-4 w-full">
                <p className="text-xs text-gray-400 mb-2">Model</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-200 text-sm">{error}</p>
            {retryAfter !== null && (
              <p className="text-red-300 text-xs mt-2">
                Please wait {retryAfter} seconds before trying again.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="fixed lg:relative bottom-0 w-full p-6">
        <div className="space-y-4">
          <div
            className={`flex flex-col gap-3 bg-offblack-secondary justify-center items-start ${
              uploadedImage ? "rounded-3xl" : "rounded-full"
            } px-4 py-3`}
          >
            <div className="flex justify-end items-center w-full h-full">
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
                            setUploadedImage(result); // same as when selecting file
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
                className="flex-1 text-white placeholder-gray-500 rounded-full border-0 resize-none focus-visible:border-0 focus-visible:ring-0 focus:outline-none focus:border-0 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed min-h-full max-h-[120px]"
              />
              <ImageUpload onImageUpload={setUploadedImage} />
              <Button
                onClick={() => handleSendMessage(input)}
                disabled={
                  !input.trim() ||
                  !isApiKeySet ||
                  isLoading ||
                  (retryAfter !== null && retryAfter > 0)
                }
                className="bg-yellow-400 hover:bg-yellow-600 text-black font-medium rounded-full size-8"
              >
                <Send />
              </Button>
            </div>

            {uploadedImage && (
              <div className="relative px-2 mt-2">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded"
                  className="w-full h-[200] object-cover rounded"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-5 bg-black rounded-full size-8 cursor-pointer flex items-center justify-center text-white text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
