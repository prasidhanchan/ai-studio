import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "./sidebar";
import Star from "@/public/icons/star";
import Menu from "@/public/icons/menu";
import Link from "next/link";
import GitHub from "@/public/icons/github";

interface HeaderProps {
  apiKey: string;
  handleSetApiKey: (key: string) => void;
  isApiKeySet: boolean;
  temperature: number;
  setTemperature: (value: number) => void;
  aspectRatio: string;
  setAspectRatio: (value: string) => void;
  outputLength: number;
  setOutputLength: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  systemInstructions: string;
  setSystemInstructions: (value: string) => void;
}

export function Header({
  apiKey,
  handleSetApiKey,
  isApiKeySet,
  temperature,
  setTemperature,
  aspectRatio,
  setAspectRatio,
  outputLength,
  setOutputLength,
  topP,
  setTopP,
  systemInstructions,
  setSystemInstructions,
}: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
      <Link href="/" className="flex flex-col">
        <h1 className="flex gap-2 justify-start items-center text-2xl font-semibold">
          <Star />
          AI Studio
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Create Nano Banana images without watermark
        </p>
      </Link>

      <Link
        href="https://github.com/prasidhanchan/ai-studio"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col"
      >
        <GitHub />
      </Link>

      {isMobile && (
        <Drawer direction="right">
          <DrawerTrigger>
            <Menu />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle></DrawerTitle>
            <Sidebar
              apiKey={apiKey}
              onApiKeyChange={handleSetApiKey}
              isApiKeySet={isApiKeySet}
              temperature={temperature}
              onTemperatureChange={setTemperature}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              outputLength={outputLength}
              onOutputLengthChange={setOutputLength}
              topP={topP}
              onTopPChange={setTopP}
              systemInstructions={systemInstructions}
              onSystemInstructionsChange={setSystemInstructions}
            />
          </DrawerContent>
        </Drawer>
      )}
    </header>
  );
}
