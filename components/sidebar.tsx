"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface SidebarProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isApiKeySet: boolean;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  outputLength: number;
  onOutputLengthChange: (value: number) => void;
  topP: number;
  onTopPChange: (value: number) => void;
  systemInstructions: string;
  onSystemInstructionsChange: (value: string) => void;
  className?: string;
}

export function Sidebar({
  apiKey,
  onApiKeyChange,
  isApiKeySet,
  temperature,
  onTemperatureChange,
  aspectRatio,
  onAspectRatioChange,
  outputLength,
  onOutputLengthChange,
  topP,
  onTopPChange,
  systemInstructions,
  onSystemInstructionsChange,
  className,
}: SidebarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const handleApiKeySubmit = () => {
    onApiKeyChange(localApiKey);
  };

  return (
    <div
      className={cn(
        "w-full lg:w-75 border-l border-[#2a2a2a] overflow-y-auto p-4 space-y-2 scrollbar",
        className
      )}
    >
      {/* Model Info */}
      <div className="space-y-1 bg-offblack border border-offblack p-3 rounded-xl">
        <h3 className="text-sm mb-2">Nano Banana</h3>
        <p className="text-xs text-white/40">gemini-2.5-flash-image</p>
        <p className="text-xs text-white/40">
          State-of-the-art image generation and editing model.
        </p>
      </div>

      {/* API Key Input */}
      <div className="flex flex-col gap-y-2 bg-offblack-secondary border border-offblack p-3 rounded-xl">
        <span className="text-sm">Gemini API Key</span>
        <Input
          type="password"
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="bg-offblack-secondary border-0 px-1 text-white text-xs! placeholder-gray-600 focus-visible:ring-0 focus-visible:border-0"
        />
        <Button
          onClick={handleApiKeySubmit}
          className="w-full hover:bg-white-600 text-black font-medium mt-2"
        >
          {isApiKeySet ? "Update Key" : "Set API Key"}
        </Button>
        {isApiKeySet && (
          <p className="text-xs text-green-500 w-full text-center mt-1">
            API Key configured
          </p>
        )}
      </div>

      {/* System Instructions */}
      <div className="space-y-2 bg-offblack-secondary border border-offblack p-3 rounded-xl">
        <label className="text-sm mb-2">System instructions</label>
        <p className="text-xs text-white/40">
          Optional tone and style instructions for the model
        </p>
        <Textarea
          value={systemInstructions}
          onChange={(e) => onSystemInstructionsChange(e.target.value)}
          placeholder="Add system instructions..."
          className="w-full bg-offblack-secondary border-0 px-1 text-white text-xs! placeholder-gray-600 p-2 resize-none h-20 focus-visible:ring-0 focus-visible:border-0"
        />
      </div>

      {/* Temperature */}
      <div className="space-y-3 border-t border-[#2a2a2a] pt-3 my-6">
        <div className="flex justify-between items-center mt-2">
          <label className="text-sm font-medium">Temperature</label>
          <span className="text-sm text-gray-400">
            {temperature.toFixed(2)}
          </span>
        </div>
        <Slider
          value={[temperature]}
          onValueChange={(value) => onTemperatureChange(value[0])}
          min={0}
          max={1}
          step={0.01}
          className="w-full"
        />
      </div>

      {/* Aspect Ratio */}
      <div className="flex flex-col gap-y-2 mb-6 font-medium">
        <label className="text-sm">Aspect ratio</label>
        <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger className="bg-offblack-secondary border-offblack text-white w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-offblack-secondary border-offblack">
            <SelectItem value="Auto">Auto</SelectItem>
            <SelectItem value="1:1">1:1</SelectItem>
            <SelectItem value="9:16">9:16</SelectItem>
            <SelectItem value="16:9">16:9</SelectItem>
            <SelectItem value="3:4">3:4</SelectItem>
            <SelectItem value="4:3">4:3</SelectItem>
            <SelectItem value="3:2">3:2</SelectItem>
            <SelectItem value="2:3">2:3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Settings */}
      <div className="border-t border-[#3d3d3d] pt-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between cursor-pointer w-full text-sm font-medium hover:text-gray-300 transition"
        >
          Advanced settings
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-4 mt-4">
            {/* Output Length */}
            <div className="flex flex-col gap-2">
              <label className="text-sm">Output length</label>
              <Input
                type="text"
                value={outputLength}
                onChange={(e) => onOutputLengthChange(Number(e.target.value))}
                className="bg-offblack border-offblack text-white focus-visible:ring-0 focus-visible:border-offblack"
              />
            </div>

            {/* Top P */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm">Top P</label>
                <span className="text-sm text-gray-400">{topP.toFixed(2)}</span>
              </div>
              <Slider
                value={[topP]}
                onValueChange={(value) => onTopPChange(value[0])}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
