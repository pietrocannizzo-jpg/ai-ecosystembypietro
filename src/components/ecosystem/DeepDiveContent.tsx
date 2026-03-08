import { Loader2, Sparkles, Zap, RefreshCw, ExternalLink, GitBranch, TrendingUp, Clock, Shield, Code, Tag, Link2, Trash2, Rocket, Globe, Briefcase, Handshake, FlaskConical, Package, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { TimelineEntry } from "@/data/cardData";

interface FeatureChangelogEntry {
  date: string;
  feature: string;
  description: string;
  type: string;
  url?: string;
}

interface CommunityData {
  githubUrl?: string | null;
  githubStars?: string | null;
  sentiment?: "positive" | "mixed" | "negative";
  sentimentSummary?: string;
  notableProjects?: Array<{ name: string; description: string; url?: string }>;
}

export interface DeepDiveData {
  models: Array<{ name: string; bestFor: string; speed: string; costTier: string; keyStrength: string }>;
  differences: Array<{ name: string; description: string }>;
  featureChangelog?: FeatureChangelogEntry[];
  community?: CommunityData;
  missingFromDatabase?: Array<{ name: string; description: string; releaseDate: string }>;
  recentNews?: Array<{ date: string; headline: string; summary?: string; source: string; url?: string }>;
  useCases?: Array<{ title: string; description: string }>;
  proTips?: Array<{ tip: string }>;
}

interface DeepDiveContentProps {
  loading: boolean;
  data: DeepDiveData | null;
  color: string;
  toolName: string;
  timeline?: TimelineEntry[];
  onRetry: () => void;
  onRegenerate: () => void;
}

const timelineTypeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  launch:      { icon: <Rocket className="w-3 h-3" />,       label: "Launch",      color: "hsl(160, 84%, 39%)" },
  update:      { icon: <Sparkles className="w-3 h-3" />,     label: "Update",      color: "hsl(38, 92%, 50%)" },
  funding:     { icon: <Briefcase className="w-3 h-3" />,    label: "Funding",     color: "hsl(142, 71%, 45%)" },
  milestone:   { icon: <Globe className="w-3 h-3" />,        label: "Milestone",   color: "hsl(270, 70%, 60%)" },
  model:       { icon: <Layers className="w-3 h-3" />,       label: "New Model",   color: "hsl(262, 83%, 58%)" },
  product:     { icon: <Package className="w-3 h-3" />,      label: "Product",     color: "hsl(217, 91%, 60%)" },
  api:         { icon: <Code className="w-3 h-3" />,         label: "API",         color: "hsl(180, 70%, 45%)" },
  safety:      { icon: <Shield className="w-3 h-3" />,       label: "Safety",      color: "hsl(38, 92%, 50%)" },
  business:    { icon: <TrendingUp className="w-3 h-3" />,   label: "Business",    color: "hsl(330, 81%, 60%)" },
  partnership: { icon: <Handshake className="w-3 h-3" />,    label: "Partnership", color: "hsl(187, 92%, 43%)" },
  research:    { icon: <FlaskConical className="w-3 h-3" />, label: "Research",    color: "hsl(262, 83%, 75%)" },
};

const changelogTypeConfig: Record<string, { icon: React.ReactNode; label: string; colorVar: string }> = {
  new_model: { icon: <Sparkles className="w-3 h-3" />, label: "New Model", colorVar: "--neon-purple" },
  api_change: { icon: <Code className="w-3 h-3" />, label: "API", colorVar: "--neon-cyan" },
  sdk_update: { icon: <GitBranch className="w-3 h-3" />, label: "SDK", colorVar: "--neon-blue" },
  security: { icon: <Shield className="w-3 h-3" />, label: "Security", colorVar: "--neon-green" },
  capability: { icon: <TrendingUp className="w-3 h-3" />, label: "Feature", colorVar: "--neon-amber" },
  pricing: { icon: <Tag className="w-3 h-3" />, label: "Pricing", colorVar: "--neon-rose" },
  integration: { icon: <Link2 className="w-3 h-3" />, label: "Integration", colorVar: "--neon-cyan" },
  deprecation: { icon: <Trash2 className="w-3 h-3" />, label: "Deprecated", colorVar: "--neon-rose" },
};

const sentimentConfig: Record<string, { emoji: string; color: string }> = {
  positive: { emoji: "🟢", color: "hsl(var(--neon-green))" },
  mixed: { emoji: "🟡", color: "hsl(var(--neon-amber))" },
  negative: { emoji: "🔴", color: "hsl(var(--neon-rose))" },
};

export const DeepDiveContent = ({ loading, data, color, toolName, timeline, onRetry, onRegenerate }: DeepDiveContentProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color }} />
        <p className="text-xs font-mono text-muted-foreground">Analyzing {toolName}...</p>
        <p className="text-[10px] font-mono text-muted-foreground/50">Searching the web for latest features</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-xs text-muted-foreground">No analysis available yet.</p>
        <Button variant="outline" size="sm" onClick={onRegenerate} className="mt-3 font-mono text-xs gap-2">
          <RefreshCw className="w-3 h-3" />
          Generate Analysis
        </Button>
      </div>
    );
  }

  const sortedTimeline = timeline && timeline.length > 0
    ? [...timeline].sort((a, b) => b.date.localeCompare(a.date))
    : [];

  return (
    <div className="space-y-8">
      {/* ── How It Compares ── */}
      {data.differences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
            <Zap className="w-3.5 h-3.5" style={{ color }} />
            <h3 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">How It Compares</h3>
          </div>
          <div className="space-y-2.5">
            {data.differences.slice(0, 5).map((d, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: color }} />
                <div>
                  <span className="text-xs font-medium text-foreground">{d.name}</span>
                  <span className="text-xs text-muted-foreground"> — {d.description}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Community ── */}
      {data.community && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-xl border border-border/50 bg-muted/20 p-4"
        >
          <div className="flex items-center gap-3 flex-wrap">
            {data.community.sentiment && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{sentimentConfig[data.community.sentiment]?.emoji || "⚪"}</span>
                <span
                  className="text-[10px] font-mono font-medium"
                  style={{ color: sentimentConfig[data.community.sentiment]?.color }}
                >
                  {data.community.sentiment.charAt(0).toUpperCase() + data.community.sentiment.slice(1)} sentiment
                </span>
              </div>
            )}
            {data.community.githubStars && (
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                ⭐ {data.community.githubStars}
              </span>
            )}
            {data.community.githubUrl && (
              <a
                href={data.community.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1"
              >
                <GitBranch className="w-2.5 h-2.5" />
                GitHub
              </a>
            )}
          </div>
          {data.community.sentimentSummary && (
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{data.community.sentimentSummary}</p>
          )}
        </motion.div>
      )}

      {/* ── Feature Changelog (vertical timeline) ── */}
      {sortedTimeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}25`, background: `${color}04` }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: `${color}15` }}>
              <Clock className="w-3.5 h-3.5" style={{ color }} />
              <h4 className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color }}>
                Feature Changelog
              </h4>
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                {sortedTimeline.length} events
              </span>
            </div>
            <div className="relative">
              <div className="absolute left-[27px] top-3 bottom-3 w-px" style={{ background: `${color}20` }} />

              <div className="py-2">
                {sortedTimeline.map((entry, i) => {
                  const conf = timelineTypeConfig[entry.type] || timelineTypeConfig.update;
                  return (
                    <div key={i} className="relative flex items-start gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                      <div
                        className="relative z-10 w-3 h-3 rounded-full border-2 shrink-0 mt-1"
                        style={{
                          borderColor: conf.color,
                          background: i === 0 ? conf.color : "hsl(var(--background))",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-mono text-muted-foreground shrink-0">{entry.date}</span>
                          <span
                            className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
                            style={{
                              color: conf.color,
                              borderColor: `${conf.color}40`,
                              background: `${conf.color}15`,
                            }}
                          >
                            {conf.icon}
                            {conf.label}
                          </span>
                        </div>
                        <p className="text-xs text-foreground mt-1 leading-relaxed">{entry.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI-Generated Changelog fallback */}
      {sortedTimeline.length === 0 && data.featureChangelog && data.featureChangelog.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}25`, background: `${color}04` }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: `${color}15` }}>
            <Clock className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color }}>Feature Changelog</h4>
          </div>
          <div className="relative">
            <div className="absolute left-[27px] top-3 bottom-3 w-px" style={{ background: `${color}20` }} />
            <div className="py-2">
              {data.featureChangelog.map((entry, i) => {
                const typeConf = changelogTypeConfig[entry.type] || changelogTypeConfig.capability;
                return (
                  <div key={i} className="relative flex items-start gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                    <div
                      className="relative z-10 w-3 h-3 rounded-full border-2 shrink-0 mt-1"
                      style={{ borderColor: color, background: i === 0 ? color : "hsl(var(--background))" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-mono text-muted-foreground shrink-0">{entry.date}</span>
                        <span
                          className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
                          style={{
                            color: `hsl(var(${typeConf.colorVar}))`,
                            borderColor: `hsl(var(${typeConf.colorVar}) / 0.3)`,
                            background: `hsl(var(${typeConf.colorVar}) / 0.1)`,
                          }}
                        >
                          {typeConf.icon}
                          {typeConf.label}
                        </span>
                      </div>
                      <div className="mt-1">
                        {entry.url ? (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1"
                          >
                            {entry.feature}
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 text-muted-foreground" />
                          </a>
                        ) : (
                          <span className="text-xs font-medium text-foreground">{entry.feature}</span>
                        )}
                        <p className="text-[10px] text-muted-foreground/70 leading-relaxed mt-0.5">{entry.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Regenerate */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRegenerate}
        className="w-full gap-2 font-mono text-xs border-dashed mt-2"
        style={{ borderColor: `${color}30`, color }}
      >
        <RefreshCw className="w-3 h-3" />
        Regenerate Analysis
      </Button>
    </div>
  );
};
