import { useState } from "react";
import { Search, Plus, Minus, Maximize, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/cardData";

interface ToolbarProps {
  search: string;
  onSearchChange: (s: string) => void;
  hiddenCategories: Set<string>;
  onToggleCategory: (catId: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const Toolbar = ({
  search, onSearchChange,
  hiddenCategories, onToggleCategory,
  zoom, onZoomIn, onZoomOut, onFitAll,
  onExport, onImport,
}: ToolbarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-border/50" style={{ background: "hsl(230 25% 7% / 0.85)" }}>
      <div className="flex items-center gap-3 px-4 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <span className="text-lg">🧠</span>
          <h1 className="font-display font-bold text-sm text-foreground hidden sm:block">
            AI & Defence Tracker
          </h1>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search tools..."
            className="pl-8 h-8 text-xs bg-muted/50 border-border/50"
          />
        </div>

        {/* Category filters - scrollable */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-lg">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onToggleCategory(cat.id)}
              className="text-[10px] font-mono px-2 py-1 rounded-full whitespace-nowrap transition-all shrink-0"
              style={{
                background: hiddenCategories.has(cat.id) ? "transparent" : `${cat.color}20`,
                color: hiddenCategories.has(cat.id) ? "hsl(215 15% 55%)" : cat.color,
                border: `1px solid ${hiddenCategories.has(cat.id) ? "hsl(230 15% 18%)" : cat.color + "40"}`,
                opacity: hiddenCategories.has(cat.id) ? 0.5 : 1,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground mr-1">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomOut}>
            <Minus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomIn}>
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onFitAll}>
            <Maximize className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onExport}>
            <Download className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onImport}>
            <Upload className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
