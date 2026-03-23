import { useState, useMemo, useRef } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/ecosystem/HeroSection";
import { SearchBar } from "@/components/ecosystem/SearchBar";
import { CategoryTabs } from "@/components/ecosystem/CategoryTabs";
import { ToolCard } from "@/components/ecosystem/ToolCard";
import { ComparisonTable } from "@/components/ecosystem/ComparisonTable";
import { AddToolDialog } from "@/components/ecosystem/AddToolDialog";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/cardData";
import type { CardData } from "@/data/cardData";
import { useTools } from "@/hooks/useTools";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut } from "lucide-react";

const SectionHeader = ({ category, count }: { category: { id: string; label: string; color: string; description: string }; count: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          className="w-2.5 h-2.5 rounded-full"
          style={{ 
            background: category.color,
            boxShadow: `0 0 10px ${category.color}50`,
          }}
          animate={isInView ? { scale: [0, 1.4, 1], opacity: [0, 1] } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <h2 className="text-lg font-display font-bold text-foreground">
          {category.label}
        </h2>
        <span className="text-xs font-mono text-muted-foreground">
          {count}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-5 ml-5 max-w-2xl">
        {category.description}
      </p>
      {/* Decorative line */}
      <motion.div
        className="h-px ml-5 mb-4 max-w-xs"
        style={{ background: `linear-gradient(90deg, ${category.color}30, transparent)` }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [constellationMode, setConstellationMode] = useState(false);
  const { data: allCards = [], isLoading } = useTools();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Parallax for the whole page
  const { scrollY } = useScroll();
  const controlsOpacity = useTransform(scrollY, [0, 200], [0, 1]);

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
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Sticky search bar */}
      <div id="tool-results" className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} allCards={allCards} onNavigate={(id) => navigate(`/tool/${id}`)} />
            </div>
            <div className="flex-shrink-0">
              <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
            </div>
            <Button
              size="sm"
              variant={constellationMode ? "default" : "outline"}
              onClick={() => setConstellationMode((v) => !v)}
              className="gap-1.5 text-xs font-mono shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Constellation</span>
            </Button>
            {user ? (
              <>
                <AddToolDialog />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={signOut}
                  className="gap-1.5 text-xs font-mono text-muted-foreground"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="gap-1.5 text-xs font-mono"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign in</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {/* Active filters indicator */}
        {(search || activeCategory) && !isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center gap-2"
          >
            <span className="text-xs font-mono text-muted-foreground">
              {filteredCards.length} tool{filteredCards.length !== 1 ? "s" : ""} found
            </span>
            {(search || activeCategory) && (
              <button
                onClick={() => { setSearch(""); setActiveCategory(null); }}
                className="text-[10px] font-mono text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </motion.div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <motion.div
              className="inline-flex items-center gap-2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="w-2 h-2 rounded-full bg-neon-cyan glow-cyan" />
              <span className="text-muted-foreground text-sm font-mono">Loading ecosystem...</span>
            </motion.div>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm font-mono">
              {search ? `No tools found matching "${search}"` : "No tools available yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-0 relative" ref={gridContainerRef}>
            <ConstellationOverlay
              cards={filteredCards}
              enabled={constellationMode}
              containerRef={gridContainerRef as React.RefObject<HTMLElement>}
            />
            {groupedCards.map(({ category, cards }) => (
              <section
                key={category.id}
                className="relative py-10"
              >
                <SectionHeader category={category} count={cards.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  <AnimatePresence mode="popLayout">
                    {cards.map((card, i) => (
                      <ToolCard
                        key={card.id}
                        card={card}
                        index={i}
                        onClick={() => navigate(`/tool/${card.id}`)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                <ComparisonTable category={category} cards={cards} />
              </section>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-20 pb-10">
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/15 to-transparent mb-8" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">
            AI Ecosystem Explorer · March 2026
          </p>
          <p className="text-[9px] font-mono tracking-wider text-muted-foreground/25 mt-2">
            by Pietro Cannizzo
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
