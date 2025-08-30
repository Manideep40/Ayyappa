"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useLanguage } from "@/components/language-provider";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Select language">
          <Globe className="w-4 h-4 mr-2" />
          {compact ? current?.code.toUpperCase() : current?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-0">
        <DropdownMenuLabel className="px-2 py-2">Choose Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-64">
          <div className="py-1">
            <DropdownMenuRadioGroup value={language} onValueChange={(v) => setLanguage(v as any)}>
              {LANGUAGES.map((l) => (
                <DropdownMenuRadioItem key={l.code} value={l.code}>
                  {l.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
