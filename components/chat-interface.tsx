"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { AlertCircle, X } from "lucide-react";
import Star from "@/public/icons/star";
import {
  GenerateContentConfig,
  GenerateContentParameters,
  GoogleGenAI,
  Tool,
  type Content,
  type Part,
} from "@google/genai";
import { PromptInput } from "./prompt-input";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  images?: string[];
  isEditing?: boolean;
  generationTime?: number;
}

interface ChatInterfaceProps {
  apiKey: string;
  selectedModel: string;
  isApiKeySet: boolean;
  temperature: number;
  aspectRatio: string;
  resolution: string;
  enableGrounding: boolean;
  stopSequences: string[];
  outputLength: number;
  topP: number;
  systemInstructions: string;
}

export function ChatInterface({
  apiKey,
  selectedModel,
  isApiKeySet,
  temperature,
  aspectRatio,
  resolution,
  enableGrounding,
  stopSequences,
  outputLength,
  topP,
  systemInstructions,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const tools: Tool[] = [{ googleSearch: {} }];

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

  const handleSendMessage = async (newMessage: string, images: string[]) => {
    if (!newMessage.trim() || !isApiKeySet || isLoading) return;

    setError(null);
    setRetryAfter(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
      images: images && images.length > 0 ? images : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setUploadedImages([]);
    setIsLoading(true);
    setGenerationStartTime(Date.now());
    setElapsedTime(0);

    try {
      // Initialize Gemini client
      const client = new GoogleGenAI({ apiKey });

      // Build contents array
      const contents: Content[] = [];

      // Add previous messages to context
      if (messages && messages.length > 0) {
        for (const msg of messages) {
          const parts: Part[] = [];

          // Add images if present
          if (msg.images && msg.images.length > 0) {
            for (const img of msg.images.slice(0, 5)) {
              const base64 = img.split(",")[1];
              parts.push({
                inlineData: {
                  mimeType: "image/png",
                  data: base64,
                },
                thoughtSignature: "skip_thought_signature_validator", // Workaround for Gemini 3
              });
            }
          }

          // Add text
          parts.push({
            text: msg.content,
            thoughtSignature: "skip_thought_signature_validator", // Workaround for Gemini 3
          });

          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts,
          });
        }
      }

      // Add current message
      const currentParts: any[] = [{ text: newMessage }];
      if (images && images.length > 0) {
        for (const img of images.slice(0, 5)) {
          const base64 = img.split(",")[1];
          currentParts.unshift({
            inlineData: {
              mimeType: "image/png",
              data: base64,
            },
          });
        }
      }
      contents.push({ role: "user", parts: currentParts });

      // Generation config
      const config: GenerateContentConfig = {
        temperature: temperature || 1,
        topP: topP || 0.95,
        stopSequences: stopSequences.length > 0 ? stopSequences : undefined,
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: aspectRatio !== "Auto" ? aspectRatio : undefined,
          imageSize:
            selectedModel === "gemini-3-pro-image-preview"
              ? resolution
              : undefined,
        },
        systemInstruction: [{ text: systemInstructions }],
        tools:
          enableGrounding && selectedModel === "gemini-3-pro-image-preview"
            ? tools
            : undefined,
      };

      const generationConfig: GenerateContentParameters = {
        model: selectedModel,
        contents,
        config,
      };

      if (outputLength) {
        config.maxOutputTokens = outputLength;
      }

      // Generate content
      const result = await client.models.generateContent(generationConfig);

      const text = result.text;

      // Extract generated images
      let imageData = null;
      if (result.candidates?.[0]?.content?.parts) {
        for (const part of result.candidates[0].content.parts) {
          if (part.inlineData) {
            const mimeType = part.inlineData.mimeType || "image/png";
            const base64 = part.inlineData.data;
            imageData = `data:${mimeType};base64,${base64}`;
            break;
          }
        }
      }

      // Add model response
      const finalTime =
        (Date.now() - (generationStartTime || Date.now())) / 1000;
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: text || "",
        images: imageData ? [imageData] : undefined,
        generationTime: finalTime,
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error: any) {
      console.error("Error:", error);

      let errorMessage = "Failed to generate content";
      let retryAfter: number | null = null;

      // Handle specific errors
      if (error?.message?.includes("429") || error?.status === 429) {
        errorMessage = "API quota exceeded. Please wait or upgrade your plan.";
        const retryMatch = error?.message?.match(/retry in (\d+)/i);
        if (retryMatch) {
          retryAfter = Number.parseInt(retryMatch[1]);
          setRetryAfter(retryAfter);
        }
      } else if (error?.message?.includes("401") || error?.status === 401) {
        errorMessage = "Invalid API key. Please check your Gemini API key.";
      } else if (error?.message?.includes("400") || error?.status === 400) {
        errorMessage = "Invalid request. Please pass a valid API key.";
      } else if (error?.message?.includes("CORS")) {
        errorMessage =
          "CORS error. The Gemini API may not support direct browser calls.";
      } else {
        errorMessage =
          error?.message || "Network error. Please check your connection.";
      }

      setError(errorMessage);
      // Remove the failed user message
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
      handleSendMessage(input, uploadedImages);
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

                    handleSendMessage(prevContent, message.images || []);

                    // Delete Messages including the current one
                    setMessages((prev) =>
                      prev.filter((msg) => msg.id < message.id)
                    );
                    return;
                  }

                  handleSendMessage(message.content, message.images || []);

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
                <div className="flex items-center gap-1">
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
          <PromptInput
            input={input}
            setInput={setInput}
            handleKeyDown={handleKeyDown}
            handleSendMessage={handleSendMessage}
            isApiKeySet={isApiKeySet}
            isLoading={isLoading}
            retryAfter={retryAfter}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
        </div>
      </div>
    </div>
  );
}
