import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Sparkles, ChevronLeft, ChevronRight, Rocket, DollarSign, Cpu, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTools } from "@/hooks/useTools";
import { getLogoUrl } from "@/data/companyLogos";
import { categories } from "@/data/cardData";
import type { CardData, TimelineEntry } from "@/data/cardData";
import { ToolDetailDeepDive } from "@/components/tool-detail/ToolDetailDeepDive";

const typeColors: Record<string, string> = {
  launch: "var(--neon-cyan)",
  update: "var(--neon-amber)",
  funding: "var(--neon-green)",
  milestone: "var(--neon-purple)",
  model: "160 84% 39%",
  product: "217 91% 60%",
  api: "263 70% 50%",
  safety: "38 92% 50%",
  business: "330 81% 60%",
  partnership: "187 92% 43%",
  research: "262 83% 75%",
};

const typeLabels: Record<string, string> = {
  launch: "Launch",
  update: "Update",
  funding: "Funding",
  milestone: "Milestone",
  model: "Model",
  product: "Product",
  api: "API",
  safety: "Safety",
  business: "Business",
  partnership: "Partnership",
  research: "Research",
};

const TimelineNode = ({
  entry,
  index,
  isSelected,
  onClick,
  color,
}: {
  entry: TimelineEntry;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  color: string;
}) => {
  const nodeColor = `hsl(${typeColors[entry.type] || typeColors.launch})`;

  return (
    <div className="flex flex-col items-center shrink-0 relative" style={{ width: 160 }}>
      <span className="text-[10px] font-mono text-muted-foreground mb-2 whitespace-nowrap">
        {entry.date}
      </span>
      <motion.button
        onClick={onClick}
        className="relative z-10 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        style={{
          width: isSelected ? 20 : 14,
          height: isSelected ? 20 : 14,
          borderColor: nodeColor,
          background: isSelected ? nodeColor : "hsl(var(--background))",
          boxShadow: isSelected ? `0 0 16px ${nodeColor}60` : "none",
        }}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
      />
      <span
        className="text-[8px] font-mono uppercase tracking-wider mt-2 px-2 py-0.5 rounded-full border"
        style={{
          color: nodeColor,
          borderColor: `${nodeColor}40`,
          background: `${nodeColor}10`,
        }}
      >
        {typeLabels[entry.type] || entry.type}
      </span>
      <p className="text-[10px] text-center text-muted-foreground mt-1.5 leading-tight max-w-[140px] line-clamp-2">
        {entry.description}
      </p>
    </div>
  );
};

const pricingColorMap: Record<string, { bg: string; text: string; border: string }> = {
  free: { bg: "hsl(142 71% 45% / 0.12)", text: "hsl(142 71% 55%)", border: "hsl(142 71% 45% / 0.25)" },
  freemium: { bg: "hsl(180 70% 45% / 0.12)", text: "hsl(180 70% 55%)", border: "hsl(180 70% 45% / 0.25)" },
  paid: { bg: "hsl(25 95% 53% / 0.12)", text: "hsl(25 95% 63%)", border: "hsl(25 95% 53% / 0.25)" },
  "open-source": { bg: "hsl(270 70% 60% / 0.12)", text: "hsl(270 70% 70%)", border: "hsl(270 70% 60% / 0.25)" },
};

/* ── Section wrapper with animation ── */
const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ icon, title, color, count }: { icon: React.ReactNode; title: string; color: string; count?: number }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
    <span className="text-[10px]" style={{ color }}>{icon}</span>
    <h3 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">{title}</h3>
    {count !== undefined && (
      <span className="text-[10px] font-mono text-muted-foreground">{count}</span>
    )}
  </div>
);

const ToolDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: allCards = [], isLoading } = useTools();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const card = useMemo(() => allCards.find((c) => c.id === slug), [allCards, slug]);
  const cat = card ? categories.find((c) => c.id === card.category) : null;
  const logoUrl = card ? getLogoUrl(card.id) : null;

  const updateScrollState = () => {
    const el = timelineRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = timelineRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollState);
      return () => el.removeEventListener("scroll", updateScrollState);
    }
  }, [card]);

  useEffect(() => {
    if (selectedIndex === null || !timelineRef.current) return;
    const node = timelineRef.current.children[selectedIndex] as HTMLElement;
    if (node) {
      node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedIndex]);

  const scrollTimeline = (dir: "left" | "right") => {
    const el = timelineRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <span className="text-muted-foreground text-sm font-mono">Loading...</span>
        </motion.div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-mono text-sm">Tool not found</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2 font-mono text-xs">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to ecosystem
        </Button>
      </div>
    );
  }

  const selectedEntry = selectedIndex !== null ? card.timeline[selectedIndex] : null;
  const pricingStyle = card.pricing ? pricingColorMap[card.pricing] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Button>

          <div className="flex items-center gap-3 min-w-0 flex-1">
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt={`${card.title} logo`}
                className="w-8 h-8 rounded-lg object-contain bg-muted/50 p-1 border border-border/50 shrink-0"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg border border-border/50 shrink-0"
                style={{ background: `${card.color}10` }}
              >
                {card.icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-foreground text-sm sm:text-base truncate">
                  {card.title}
                </h1>
                {/* Resource link */}
                {card.links.length > 0 && (
                  <a
                    href={card.links[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/60 transition-colors"
                    title="Visit website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                  style={{
                    background: `${card.color}10`,
                    borderColor: `${card.color}25`,
                    color: card.color,
                  }}
                >
                  {card.subcategory}
                </span>
                {cat && (
                  <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                    {cat.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Product Timeline (horizontal) ─── */}
      {card.timeline.length > 0 && (
        <div className="relative border-b border-border/50 bg-card/50">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card/50 to-transparent z-10 pointer-events-none" />

          {canScrollLeft && (
            <button
              onClick={() => scrollTimeline("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/80 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollTimeline("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/80 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
              <h2 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">
                Product Timeline
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">
                {card.timeline.length} events
              </span>
            </div>

            <div className="relative">
              <div
                className="absolute left-0 right-0 h-px top-[30px] z-0"
                style={{ background: `linear-gradient(90deg, transparent, ${card.color}30, ${card.color}30, transparent)` }}
              />

              <div
                ref={timelineRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 pt-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {card.timeline.map((entry, i) => (
                  <TimelineNode
                    key={i}
                    entry={entry}
                    index={i}
                    isSelected={selectedIndex === i}
                    onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                    isFirst={i === 0}
                    isLast={i === card.timeline.length - 1}
                    color={card.color}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedEntry && (
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-4 px-4 py-3 rounded-xl border"
                    style={{
                      borderColor: `${card.color}25`,
                      background: `${card.color}06`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{selectedEntry.date}</span>
                      <span
                        className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border"
                        style={{
                          color: `hsl(${typeColors[selectedEntry.type] || typeColors.launch})`,
                          borderColor: `hsl(${typeColors[selectedEntry.type] || typeColors.launch} / 0.3)`,
                          background: `hsl(${typeColors[selectedEntry.type] || typeColors.launch} / 0.1)`,
                        }}
                      >
                        {typeLabels[selectedEntry.type] || selectedEntry.type}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{selectedEntry.description}</p>

                    {card.subProducts
                      .filter(
                        (sp) =>
                          selectedEntry.description.toLowerCase().includes(sp.name.toLowerCase()) ||
                          sp.name.toLowerCase().includes(selectedEntry.description.toLowerCase().split(" ")[0])
                      )
                      .map((sp, i) => (
                        <div
                          key={i}
                          className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-muted/40 border border-border/30"
                        >
                          <span className="text-sm shrink-0">{sp.icon}</span>
                          <div>
                            <span className="text-xs font-medium text-foreground">{sp.name}</span>
                            <p className="text-[10px] text-muted-foreground">{sp.description}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ─── Main content ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ── Overview ── */}
        <Section delay={0.1}>
          <p className="text-sm text-foreground/80 leading-relaxed">{card.summary}</p>

          {(card.pricing || card.bestFor || card.modelUsed) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {card.pricing && pricingStyle && (
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border"
                  style={{ background: pricingStyle.bg, borderColor: pricingStyle.border }}
                >
                  <DollarSign className="w-4 h-4 shrink-0" style={{ color: pricingStyle.text }} />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Pricing</span>
                    <span className="text-xs font-semibold" style={{ color: pricingStyle.text }}>
                      {card.price || card.pricing}
                    </span>
                  </div>
                </div>
              )}
              {card.bestFor && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-muted/40 border border-border/50">
                  <Target className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Best For</span>
                    <span className="text-xs font-medium text-foreground">{card.bestFor}</span>
                  </div>
                </div>
              )}
              {card.modelUsed && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-muted/40 border border-border/50">
                  <Cpu className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Model</span>
                    <span className="text-xs font-medium text-foreground">{card.modelUsed}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {card.quickstart && (
            <div className="mt-4">
              <a
                href={card.quickstart}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 border hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `${card.color}15`,
                  borderColor: `${card.color}30`,
                  color: card.color,
                }}
              >
                <Rocket className="w-3.5 h-3.5" />
                Get Started
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            </div>
          )}

          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-full border"
                  style={{
                    borderColor: `${card.color}20`,
                    color: card.color,
                    background: `${card.color}06`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* ── What It Does ── */}
        <Section delay={0.2}>
          <SectionTitle icon={<Sparkles className="w-3.5 h-3.5" />} title="What It Does" color={card.color} />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {card.summary}
            {card.bestFor && ` Ideal for ${card.bestFor.toLowerCase()}.`}
            {card.subProducts.length > 0 && ` Includes ${card.subProducts.slice(0, 3).map(sp => sp.name).join(", ")}${card.subProducts.length > 3 ? ` and ${card.subProducts.length - 3} more` : ""}.`}
          </p>
        </Section>

        {/* ── Key Features (card grid) ── */}
        {card.subProducts.length > 0 && (
          <Section delay={0.3}>
            <SectionTitle icon={<Zap className="w-3.5 h-3.5" />} title="Key Features" color={card.color} count={card.subProducts.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {card.subProducts.map((sp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                  className="group p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200"
                  style={{
                    boxShadow: "0 1px 3px hsl(var(--background) / 0.5)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0 mt-0.5">{sp.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{sp.name}</span>
                        {sp.releaseDate && (
                          <span className="text-[9px] font-mono text-muted-foreground/60">
                            {sp.releaseDate}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{sp.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* ── AI Analysis divider ── */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" style={{ color: card.color }} />
              AI Analysis
            </span>
          </div>
        </div>

        {/* ── Deep Dive (How It Compares + Feature Changelog) ── */}
        <ToolDetailDeepDive card={card} />

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-border/50 to-transparent mb-4" />
          <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
            AI Ecosystem Explorer
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
