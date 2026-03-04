import { motion } from "framer-motion";
import { categories } from "@/data/cardData";

interface CategoryTabsProps {
  active: string | null;
  onSelect: (id: string | null) => void;
}

export const CategoryTabs = ({ active, onSelect }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`text-xs font-mono px-4 py-2 rounded-full border transition-all duration-200 ${
          active === null
            ? "bg-foreground/10 border-foreground/20 text-foreground"
            : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(active === cat.id ? null : cat.id)}
          className="text-xs font-mono px-4 py-2 rounded-full border transition-all duration-200"
          style={{
            background: active === cat.id ? `${cat.color}15` : "transparent",
            borderColor: active === cat.id ? `${cat.color}40` : "hsl(var(--border) / 0.5)",
            color: active === cat.id ? cat.color : "hsl(var(--muted-foreground))",
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
