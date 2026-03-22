import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { getLogoUrl } from "@/data/companyLogos";
import { categories } from "@/data/cardData";
import type { CardData } from "@/data/cardData";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  allCards?: CardData[];
  onNavigate?: (cardId: string) => void;
}

export const SearchBar = ({ value, onChange, allCards = [], onNavigate }: SearchBarProps) => {
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = value.length >= 1
    ? allCards
        .filter((c) => {
          const q = value.toLowerCase();
          return (
            c.title.toLowerCase().includes(q) ||
            c.subcategory.toLowerCase().includes(q) ||
            c.tags.some((t) => t.toLowerCase().includes(q))
          );
        })
        .slice(0, 6)
    : [];

  const showDropdown = focused && value.length >= 1 && results.length > 0;

  useEffect(() => {
    setSelectedIndex(-1);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        onNavigate?.(results[selectedIndex].id);
        setFocused(false);
      } else if (e.key === "Escape") {
        setFocused(false);
      }
    },
    [showDropdown, selectedIndex, results, onNavigate]
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search tools, categories, tags..."
        className="pl-10 pr-10 h-11 text-sm bg-card border-border rounded-xl focus:border-foreground/30 focus:ring-foreground/10 placeholder:text-muted-foreground/60"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Instant results dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 glass-strong rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {results.map((card, i) => {
              const logoUrl = getLogoUrl(card.id);
              const cat = categories.find((c) => c.id === card.category);
              return (
                <button
                  key={card.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onNavigate?.(card.id);
                    setFocused(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    i === selectedIndex ? "bg-muted/60" : "hover:bg-muted/40"
                  }`}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={card.title}
                      className="w-7 h-7 rounded-md object-contain bg-muted/50 p-0.5 border border-border/50 shrink-0"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-sm border border-border/50 shrink-0"
                      style={{ background: `${card.color}10` }}
                    >
                      {card.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{card.title}</div>
                    <div className="text-[10px] font-mono truncate" style={{ color: cat?.color }}>
                      {card.subcategory}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                </button>
              );
            })}
            {value.length >= 1 && (
              <div className="px-3.5 py-2 border-t border-border/50 text-[10px] font-mono text-muted-foreground/60">
                {results.length} result{results.length !== 1 ? "s" : ""} · ↑↓ navigate · ↵ select
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
