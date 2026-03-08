import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "@/data/cardData";

interface CategoryTabsProps {
  active: string | null;
  onSelect: (id: string | null) => void;
}

export const CategoryTabs = ({ active, onSelect }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      <button
        onClick={() => onSelect(null)}
        className={`text-[11px] sm:text-xs font-mono px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
          active === null
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(active === cat.id ? null : cat.id)}
          className={`text-[11px] sm:text-xs font-mono px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
            active === cat.id
              ? "shadow-sm"
              : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
          }`}
          style={
            active === cat.id
              ? {
                  background: `${cat.color}15`,
                  borderColor: `${cat.color}40`,
                  color: cat.color,
                }
              : undefined
          }
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
