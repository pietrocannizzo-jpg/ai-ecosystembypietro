import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/ecosystem/HeroSection";
import { SearchBar } from "@/components/ecosystem/SearchBar";
import { CategoryTabs } from "@/components/ecosystem/CategoryTabs";
import { ToolCard } from "@/components/ecosystem/ToolCard";
import { ToolDetailSheet } from "@/components/ecosystem/ToolDetailSheet";
import { AddToolDialog } from "@/components/ecosystem/AddToolDialog";
import { categories } from "@/data/cardData";
import type { CardData } from "@/data/cardData";
import { useTools } from "@/hooks/useTools";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const { data: allCards = [], isLoading } = useTools();

  const filteredCards = useMemo(() => {
    let cards = allCards;

    if (activeCategory) {
      cards = cards.filter((c) => c.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.subcategory.toLowerCase().includes(q) ||
          c.subProducts.some((sp) => sp.name.toLowerCase().includes(q))
      );
    }

    return cards;
  }, [allCards, search, activeCategory]);

  // Group by category for display
  const groupedCards = useMemo(() => {
    if (activeCategory) {
      const cat = categories.find((c) => c.id === activeCategory);
      return [{ category: cat!, cards: filteredCards }];
    }

    return categories
      .map((cat) => ({
        category: cat,
        cards: filteredCards.filter((c) => c.category === cat.id),
      }))
      .filter((g) => g.cards.length > 0);
  }, [filteredCards, activeCategory]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, hsl(var(--background)), hsl(230 20% 9%))" }}>
      <HeroSection />

      {/* Controls */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-border/30 bg-background/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <AddToolDialog />
          </div>
          <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm font-mono animate-pulse">Loading ecosystem...</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm font-mono">No tools found matching "{search}"</p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedCards.map(({ category, cards }) => (
              <section key={category.id}>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: category.color, boxShadow: `0 0 8px ${category.color}60` }}
                  />
                  <h2 className="text-lg font-display font-bold text-foreground">
                    {category.label}
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground">
                    {cards.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-5 ml-5 max-w-2xl">
                  {category.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  <AnimatePresence mode="popLayout">
                    {cards.map((card, i) => (
                      <ToolCard
                        key={card.id}
                        card={card}
                        index={i}
                        onClick={() => setSelectedCard(card)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-xs font-mono text-muted-foreground/50">
            AI Ecosystem Explorer · Updated March 2026
          </p>
        </div>
      </main>

      <ToolDetailSheet
        card={selectedCard}
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
};

export default Index;
