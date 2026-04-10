import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FeatureCard } from "@/components/anthropic/FeatureCard";
import { NewsCard } from "@/components/anthropic/NewsCard";
import { ChangelogEntry } from "@/components/anthropic/ChangelogEntry";
import {
  features,
  news,
  featureCategories,
  type FeatureStatus,
  type FeatureAccess,
  accessConfig,
} from "@/data/anthropicData";

const statusFilters: { id: FeatureStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shipped", label: "Shipped" },
  { id: "beta", label: "Beta" },
  { id: "planned", label: "Planned" },
];

const accessFilters: { id: FeatureAccess | "all"; label: string }[] = [
  { id: "all", label: "All Access" },
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro / Max" },
  { id: "api", label: "API" },
];

type TabId = "features" | "news" | "research" | "changelog";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("features");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatus, setActiveStatus] = useState<FeatureStatus | "all">("all");
  const [activeAccess, setActiveAccess] = useState<FeatureAccess | "all">("all");

  const filteredFeatures = useMemo(() => {
    let items = features;
    if (activeCategory !== "all") {
      items = items.filter((f) => f.category === activeCategory);
    }
    if (activeStatus !== "all") {
      items = items.filter((f) => f.status === activeStatus);
    }
    if (activeAccess !== "all") {
      items = items.filter((f) => f.access === activeAccess);
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
  }, [search, activeCategory, activeStatus, activeAccess]);

  const filteredNews = useMemo(() => {
    let items = news.filter((n) => n.type !== "research");
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search]);

  const filteredResearch = useMemo(() => {
    let items = news.filter((n) => n.type === "research");
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [search]);

  const changelogItems = useMemo(() => {
    return [...features].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "features", label: "Features", count: filteredFeatures.length },
    { id: "news", label: "News", count: filteredNews.length },
    { id: "research", label: "Research", count: filteredResearch.length },
    { id: "changelog", label: "Changelog" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
              April 2026 · Live
            </p>

            <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-foreground mb-3">
              Anthropic Tracker
            </h1>
            <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
              Every Claude model, API update, product launch, and research milestone — all in one place.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Sticky controls */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-9 pr-8 h-9 text-sm bg-transparent border-border"
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

          {/* Tabs */}
          <div className="flex items-center gap-6 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-display pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 text-[11px] font-mono text-muted-foreground">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
        {/* Features */}
        {activeTab === "features" && (
          <div className="space-y-5">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {featureCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(activeCategory === cat.id && cat.id !== "all" ? "all" : cat.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-mono transition-colors whitespace-nowrap ${
                      activeCategory === cat.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
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
                    onClick={() => setActiveStatus(activeStatus === sf.id && sf.id !== "all" ? "all" : sf.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-mono transition-colors ${
                      activeStatus === sf.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sf.label}
                  </button>
                ))}
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex gap-1">
                {accessFilters.map((af) => (
                  <button
                    key={af.id}
                    onClick={() => setActiveAccess(activeAccess === af.id && af.id !== "all" ? "all" : af.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-mono transition-colors ${
                      activeAccess === af.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {af.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredFeatures.map((feature, i) => (
                  <FeatureCard key={feature.id} feature={feature} index={i} />
                ))}
              </AnimatePresence>
            </div>

            {filteredFeatures.length === 0 && (
              <p className="text-center py-16 text-sm text-muted-foreground">
                No features match your filters
              </p>
            )}
          </div>
        )}

        {/* News */}
        {activeTab === "news" && (
          <div>
            {filteredNews.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
            {filteredNews.length === 0 && (
              <p className="text-center py-16 text-sm text-muted-foreground">
                No news matches your search
              </p>
            )}
          </div>
        )}

        {/* Research */}
        {activeTab === "research" && (
          <div>
            {filteredResearch.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i} />
            ))}
            {filteredResearch.length === 0 && (
              <p className="text-center py-16 text-sm text-muted-foreground">
                No research matches your search
              </p>
            )}
          </div>
        )}

        {/* Changelog */}
        {activeTab === "changelog" && (
          <div>
            {changelogItems.map((feature, i) => (
              <ChangelogEntry key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-20 pb-10">
          <div className="h-px w-16 mx-auto bg-border mb-6" />
          <p className="text-[11px] font-mono text-muted-foreground/50">
            by Pietro Cannizzo
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
