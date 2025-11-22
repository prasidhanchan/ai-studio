"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("Auto");
  const [resolution, setResolution] = useState("1K");
  const [enableGrounding, setEnableGrounding] = useState(false);
  const [stopSequences, setStopSequences] = useState<string[]>([]);
  const [outputLength, setOutputLength] = useState(8192);
  const [topP, setTopP] = useState(0.95);
  const [systemInstructions, setSystemInstructions] = useState("");

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    setIsApiKeySet(!!key);
  };

  return (
    <div className="flex h-screen text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Header
          apiKey={apiKey}
          handleSetApiKey={handleSetApiKey}
          model={model}
          handleSetModel={setModel}
          isApiKeySet={isApiKeySet}
          temperature={temperature}
          setTemperature={setTemperature}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          resolution={resolution}
          onResolutionChange={setResolution}
          enableGrounding={enableGrounding}
          onEnableGrounding={setEnableGrounding}
          stopSequences={stopSequences}
          setStopSequences={setStopSequences}
          outputLength={outputLength}
          setOutputLength={setOutputLength}
          topP={topP}
          setTopP={setTopP}
          systemInstructions={systemInstructions}
          setSystemInstructions={setSystemInstructions}
        />
        <ChatInterface
          apiKey={apiKey}
          selectedModel={model}
          resolution={resolution}
          isApiKeySet={isApiKeySet}
          temperature={temperature}
          aspectRatio={aspectRatio}
          enableGrounding={enableGrounding}
          stopSequences={stopSequences}
          outputLength={outputLength}
          topP={topP}
          systemInstructions={systemInstructions}
        />
      </div>

      {/* Right Sidebar */}
      <Sidebar
        apiKey={apiKey}
        onApiKeyChange={handleSetApiKey}
        model={model}
        onModelChange={setModel}
        isApiKeySet={isApiKeySet}
        temperature={temperature}
        onTemperatureChange={setTemperature}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        resolution={resolution}
        onResolutionChange={setResolution}
        enableGrounding={enableGrounding}
        onEnableGrounding={setEnableGrounding}
        stopSequences={stopSequences}
        onStopSequencesChange={setStopSequences}
        outputLength={outputLength}
        onOutputLengthChange={setOutputLength}
        topP={topP}
        onTopPChange={setTopP}
        systemInstructions={systemInstructions}
        onSystemInstructionsChange={setSystemInstructions}
        className="hidden lg:block"
      />
    </div>
  );
}
