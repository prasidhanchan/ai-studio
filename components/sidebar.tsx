"use client";

import { useEffect, useState } from "react";
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
import { Banana, ChevronDown, Trash2, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import EyeOpen from "@/public/icons/eye-open";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import NanoBanana from "@/public/icons/nano-banana";
import Star from "@/public/icons/star";
import Info from "@/public/icons/info";
import Brain from "@/public/icons/brain";
import { Switch } from "./ui/switch";
import Google from "@/public/icons/google";
import Close from "@/public/icons/close";

interface SidebarProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  isApiKeySet: boolean;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  resolution: string;
  onResolutionChange: (resolution: string) => void;
  enableGrounding: boolean;
  onEnableGrounding: (enable: boolean) => void;
  stopSequences: string[];
  onStopSequencesChange: (sequences: string[]) => void;
  outputLength: number;
  onOutputLengthChange: (value: number) => void;
  topP: number;
  onTopPChange: (value: number) => void;
  systemInstructions: string;
  onSystemInstructionsChange: (value: string) => void;
  className?: string;
}

const models = [
  {
    name: "Gemini 3 Pro Image Preview",
    codeName: "Nano Banana Pro",
    model: "gemini-3-pro-image-preview",
    costText: "Text • Input: $2.00 / Output: $12.00",
    costImage: "Image (*Output per image) • Input: $2.00 / Output: $0.134",
    knowledge: "Jan 2025",
  },
  {
    name: "Gemini 2.5 Flash Image",
    codeName: "Nano Banana",
    model: "gemini-2.5-flash-image",
    costText: "Text • Input: $0.30 / Output: $2.50",
    costImage: "Image (*Output per image) • Input: $0.30 / Output: $0.039",
    knowledge: "Jun 2025",
  },
];

export function Sidebar({
  apiKey,
  onApiKeyChange,
  model,
  onModelChange,
  isApiKeySet,
  temperature,
  onTemperatureChange,
  aspectRatio,
  onAspectRatioChange,
  resolution,
  onResolutionChange,
  stopSequences,
  onStopSequencesChange,
  enableGrounding,
  onEnableGrounding,
  outputLength,
  onOutputLengthChange,
  topP,
  onTopPChange,
  systemInstructions,
  onSystemInstructionsChange,
  className,
}: SidebarProps) {
  const [selectedModel, setSelectedModel] = useState(model);
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [stopSequenceInput, setStopSequenceInput] = useState("");
  const [savedApiKey, setSavedApiKey] = useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ai_studio_key");
    const storedModel = localStorage.getItem("ai_studio_model");
    if (storedModel) {
      setSelectedModel(storedModel);
      onModelChange(storedModel);
    } else {
      localStorage.setItem("ai_studio_model", selectedModel);
    }

    if (stored) {
      try {
        setSavedApiKey(stored);
        setLocalApiKey(stored);
        if (stored) {
          onApiKeyChange(stored);
        }
      } catch (e) {
        console.error("Failed to parse saved API key:", e);
      }
    }
  }, []);

  const handleApiKeySubmit = () => {
    if (!localApiKey.trim()) return;

    const updated = localApiKey.trim();
    localStorage.setItem("ai_studio_key", updated);
    setSavedApiKey(updated);
    onApiKeyChange(updated);
  };

  const handleDeleteApiKey = () => {
    localStorage.removeItem("ai_studio_key");
    setSavedApiKey("");
    onApiKeyChange("");
    setLocalApiKey("");
    setShowDeleteDialog(false);
  };

  const handleModelSelect = (model: string) => {
    localStorage.setItem("ai_studio_model", model);
    setSelectedModel(model);
    onModelChange(model);
  };

  const handleAddStopSequence = () => {
    if (
      stopSequenceInput.trim() &&
      !stopSequences.includes(stopSequenceInput.trim())
    ) {
      onStopSequencesChange([...stopSequences, stopSequenceInput.trim()]);
      setStopSequenceInput("");
    }
  };

  const handleRemoveStopSequence = (sequence: string) => {
    onStopSequencesChange(stopSequences.filter((s) => s !== sequence));
  };

  return (
    <div
      className={cn(
        "w-full lg:w-75 border-l border-[#2a2a2a] overflow-y-auto p-4 pb-10 space-y-2 scrollbar",
        className
      )}
    >
      {/* Model Info */}
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger className="cursor-pointer">
          <div className="flex flex-col justify-center items-start text-start space-y-1 bg-offblack border border-offblack p-3 rounded-xl">
            {selectedModel ? (
              <h3 className="text-sm mb-2">
                {
                  models.find((model) => model.model === selectedModel)
                    ?.codeName
                }
              </h3>
            ) : (
              <div className="h-6 bg-gray-400 rounded-lg w-[50%] animate-pulse" />
            )}
            {selectedModel ? (
              <p className="text-xs text-white/40">{selectedModel}</p>
            ) : (
              <div className="h-4 bg-gray-400 rounded-md w-[80%] animate-pulse" />
            )}
            <p className="text-xs text-white/40">
              State-of-the-art image generation and editing model.
            </p>
          </div>
        </DrawerTrigger>
        <DrawerContent className="min-w-full md:min-w-auto md:max-w-md!">
          <div className="flex flex-col justify-center items-start gap-4 p-4">
            <h1 className="flex justify-between items-center font-medium w-full">
              Model Selection{" "}
              <button onClick={() => setOpen(false)} className="cursor-pointer">
                <Close className="size-4" />
              </button>
            </h1>
            {models.map((model) => (
              <div
                key={model.model}
                onClick={() => {
                  handleModelSelect(model.model);
                  setOpen(false);
                }}
                className={`${
                  model.model === selectedModel ? "bg-[#333232]" : "bg-offblack"
                } flex flex-col justify-center items-start cursor-pointer text-start hover:bg-[#353535] space-y-1 border border-offblack p-3 rounded-xl w-full transition-colors`}
              >
                <div className="flex justify-start items-center gap-2 mb-4">
                  <div className="flex justify-center items-center rounded-lg p-1 size-9 bg-gray-700">
                    <NanoBanana className="size-4.5" />
                  </div>

                  <h3 className="flex flex-col justify-center items-start text-sm">
                    {model.codeName}
                    <p className="text-[11px] text-gray-400">{model.model}</p>
                  </h3>
                </div>
                <p className="flex justify-center items-center gap-1.5 text-xs text-gray-400">
                  <Star className="size-3" /> {model.name}
                </p>
                <p className="flex justify-center items-center gap-1.5 text-xs text-gray-400">
                  <Info className="size-3" /> State-of-the-art image generation
                  and editing model.
                </p>
                <p className="flex justify-center items-center gap-1.5 text-xs text-gray-400">
                  <span className="mx-0.5">$</span>
                  {model.costText}
                </p>
                <p className="flex justify-center items-center gap-1.5 text-xs text-gray-400">
                  <span className="mx-0.5">$</span>
                  {model.costImage}
                </p>
                <p className="flex justify-center items-center gap-1.5 text-xs text-gray-400">
                  <Brain className="size-3" /> Knowledge cut off:{" "}
                  {model.knowledge}
                </p>
              </div>
            ))}
          </div>
          <DrawerTitle></DrawerTitle>
        </DrawerContent>
      </Drawer>

      {/* API Key Input */}
      <div className="flex flex-col gap-y-2 bg-offblack-secondary border border-offblack p-3 rounded-xl">
        <span className="text-sm">Gemini API Key</span>

        <div className="flex justify-start items-center gap-2">
          <Input
            type={showKey ? "text" : "password"}
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="bg-offblack-secondary border-0 px-1 text-white text-xs! placeholder-gray-600 focus-visible:ring-0 focus-visible:border-0 "
          />
          <EyeOpen
            className="size-5 cursor-pointer"
            onClick={() => setShowKey(!showKey)}
          />
        </div>
        <Button
          onClick={handleApiKeySubmit}
          className="w-full hover:bg-white-600 text-black font-medium mt-2"
        >
          {isApiKeySet ? "Update Key" : "Set API Key"}
        </Button>

        {savedApiKey && (
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="w-full text-xs flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete API Key
          </Button>
        )}

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
          <SelectContent className="bg-[#1c1c1c] border-offblack-secondary">
            <SelectItem value="Auto">Auto</SelectItem>
            <SelectItem value="1:1">1:1</SelectItem>
            <SelectItem value="9:16">9:16</SelectItem>
            <SelectItem value="16:9">16:9</SelectItem>
            <SelectItem value="3:4">3:4</SelectItem>
            <SelectItem value="4:3">4:3</SelectItem>
            <SelectItem value="3:2">3:2</SelectItem>
            <SelectItem value="2:3">2:3</SelectItem>
            <SelectItem value="5:4">5:4</SelectItem>
            <SelectItem value="4:5">4:5</SelectItem>
            <SelectItem value="21:9">21:9</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resolution */}
      {selectedModel === "gemini-3-pro-image-preview" && (
        <div className="flex flex-col gap-y-2 mb-6 font-medium">
          <label className="text-sm">Resolution</label>
          <Select value={resolution} onValueChange={onResolutionChange}>
            <SelectTrigger className="bg-offblack-secondary border-offblack text-white w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1c1c1c] border-offblack-secondary">
              <SelectItem value="1K">1K</SelectItem>
              <SelectItem value="2K">2K</SelectItem>
              <SelectItem value="4K">4K</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tools */}
      {selectedModel === "gemini-3-pro-image-preview" && (
        <div className="border-t border-[#3d3d3d] pt-6 pb-3">
          <button
            onClick={() => setShowTools(!showTools)}
            className="flex items-center justify-between cursor-pointer w-full text-sm font-medium hover:text-gray-300 transition"
          >
            Tools
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showTools ? "rotate-180" : ""
              }`}
            />
          </button>
          {showTools && (
            <div className="flex justify-start items-center gap-2 text-sm mt-3 w-full">
              <span className="flex flex-col justify-between items-start w-full">
                Grounding with Google Search{" "}
                {enableGrounding && (
                  <span className="flex justify-center items-center gap-1 text-[11px]">
                    Source: <Google className="size-2.5 mb-0.5" /> Google Search
                  </span>
                )}
              </span>
              <Switch
                checked={enableGrounding}
                onCheckedChange={onEnableGrounding}
              />
            </div>
          )}
        </div>
      )}

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
            {/* Stop Sequence */}
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-center gap-2 w-full">
                <label className="text-sm font-medium w-full">
                  Add stop sequence
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={stopSequenceInput}
                    onChange={(e) => setStopSequenceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddStopSequence();
                      }
                    }}
                    placeholder="Add stop..."
                    className="bg-offblack border-offblack text-white focus-visible:ring-0 focus-visible:border-offblack w-[90%]"
                  />
                </div>
              </div>
              {stopSequences.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {stopSequences.map((sequence) => (
                    <div
                      key={sequence}
                      className="bg-offblack-secondary border border-[#2a2a2a] rounded-full px-2 py-1 flex items-center gap-2 text-sm"
                    >
                      <span>{sequence}</span>
                      <button
                        onClick={() => handleRemoveStopSequence(sequence)}
                        className="text-gray-400 hover:text-white transition cursor-pointer"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Output Length */}
            <div className="flex justify-between items-center gap-2">
              <label className="text-sm">Output length</label>
              <Input
                type="text"
                value={outputLength}
                onChange={(e) => onOutputLengthChange(Number(e.target.value))}
                className="bg-offblack border-offblack text-white focus-visible:ring-0 focus-visible:border-offblack w-[50%]"
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1c1c1c] border border-offblack-secondary">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete API Key?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. The API key will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-offblack-secondary border-offblack text-white hover:bg-offblack hover:text-white/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteApiKey}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
