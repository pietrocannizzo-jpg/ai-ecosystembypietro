import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Layers, Newspaper, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureCard } from "@/components/anthropic/FeatureCard";
import { NewsCard } from "@/components/anthropic/NewsCard";
import { ChangelogEntry } from "@/components/anthropic/ChangelogEntry";
import {
  features,
  news,
  featureCategories,
  type FeatureStatus,
} from "@/data/anthropicData";

const statusFilters: { id: FeatureStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shipped", label: "Shipped" },
  { id: "beta", label: "Beta" },
  { id: "planned", label: "Planned" },
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatus, setActiveStatus] = useState<FeatureStatus | "all">("all");

  const filteredFeatures = useMemo(() => {
    let items = features;
    if (activeCategory !== "all") {
      items = items.filter((f) => f.category === activeCategory);
    }
    if (activeStatus !== "all") {
      items = items.filter((f) => f.status === activeStatus);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.tags.some((t) => t.includes(q))
      );
    }
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search, activeCategory, activeStatus]);

  const filteredNews = useMemo(() => {
    if (!search) return news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const q = search.toLowerCase();
    return news
      .filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search]);

  const changelogItems = useMemo(() => {
    return [...features].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border/60 bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider text-accent uppercase">
                Live · April 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-foreground mb-3">
              Anthropic Tracker
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
              Follow every Claude model, API update, product launch, and research milestone — all in one place.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Sticky search */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search features, news, updates…"
              className="pl-9 pr-8 h-9 text-sm font-mono bg-card border-border"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="bg-card border border-border h-9">
            <TabsTrigger value="features" className="gap-1.5 text-xs font-mono data-[state=active]:bg-background">
              <Layers className="w-3.5 h-3.5" />
              Features
              <span className="text-[10px] text-muted-foreground ml-0.5">{filteredFeatures.length}</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-1.5 text-xs font-mono data-[state=active]:bg-background">
              <Newspaper className="w-3.5 h-3.5" />
              News
              <span className="text-[10px] text-muted-foreground ml-0.5">{filteredNews.length}</span>
            </TabsTrigger>
            <TabsTrigger value="changelog" className="gap-1.5 text-xs font-mono data-[state=active]:bg-background">
              <Clock className="w-3.5 h-3.5" />
              Changelog
            </TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            {/* Category + status filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {featureCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors whitespace-nowrap ${
                      activeCategory === cat.id
                        ? "bg-foreground text-background"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex gap-1">
                {statusFilters.map((sf) => (
                  <button
                    key={sf.id}
                    onClick={() => setActiveStatus(sf.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors ${
                      activeStatus === sf.id
                        ? "bg-foreground text-background"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredFeatures.map((feature, i) => (
                  <FeatureCard key={feature.id} feature={feature} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {filteredFeatures.length === 0 && (
              <p className="text-center py-12 text-sm text-muted-foreground font-mono">
                No features match your filters
              </p>
            )}
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
              {filteredNews.map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))}
              {filteredNews.length === 0 && (
                <p className="text-center py-12 text-sm text-muted-foreground font-mono">
                  No news matches your search
                </p>
              )}
            </div>
          </TabsContent>

          {/* Changelog Tab */}
          <TabsContent value="changelog">
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
              {changelogItems.map((feature, i) => (
                <ChangelogEntry key={feature.id} feature={feature} index={i} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">
            Anthropic Tracker · April 2026
          </p>
          <p className="text-[9px] font-mono tracking-wider text-muted-foreground/25 mt-1">
            by Pietro Cannizzo
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
