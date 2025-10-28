"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat-interface";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [aspectRatio, setAspectRatio] = useState("Auto");
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
          isApiKeySet={isApiKeySet}
          temperature={temperature}
          setTemperature={setTemperature}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
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
          isApiKeySet={isApiKeySet}
          temperature={temperature}
          aspectRatio={aspectRatio}
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
        isApiKeySet={isApiKeySet}
        temperature={temperature}
        onTemperatureChange={setTemperature}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
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
