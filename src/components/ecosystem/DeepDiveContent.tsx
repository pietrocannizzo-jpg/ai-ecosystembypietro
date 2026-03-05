import { Loader2, Sparkles, Zap, Layers, RefreshCw, PlusCircle, ExternalLink, GitBranch, TrendingUp, Clock, Shield, Code, Tag, Link2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // Legacy fields for backward compat with cached data
  recentNews?: Array<{ date: string; headline: string; summary?: string; source: string; url?: string }>;
  useCases?: Array<{ title: string; description: string }>;
  proTips?: Array<{ tip: string }>;
}

interface DeepDiveContentProps {
  loading: boolean;
  data: DeepDiveData | null;
  color: string;
  toolName: string;
  onRetry: () => void;
  onRegenerate: () => void;
}

const speedConfig: Record<string, { color: string; label: string }> = {
  Fast: { color: "hsl(var(--neon-green))", label: "⚡ Fast" },
  Medium: { color: "hsl(var(--neon-amber))", label: "⏱ Medium" },
  Slow: { color: "hsl(var(--neon-rose))", label: "🐢 Slow" },
};

const costConfig: Record<string, { color: string; label: string }> = {
  Free: { color: "hsl(var(--neon-green))", label: "Free" },
  Low: { color: "hsl(var(--neon-cyan))", label: "$" },
  Medium: { color: "hsl(var(--neon-amber))", label: "$$" },
  High: { color: "hsl(var(--neon-rose))", label: "$$$" },
  Enterprise: { color: "hsl(var(--neon-purple))", label: "Enterprise" },
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

export const DeepDiveContent = ({ loading, data, color, toolName, onRetry, onRegenerate }: DeepDiveContentProps) => {
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
        <p className="text-xs text-muted-foreground">Something went wrong. Try again.</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 font-mono text-xs">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Models Comparison */}
      {data.models.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <Layers className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">Models & Products</h4>
          </div>
          <div className="divide-y divide-border/20">
            {data.models.map((m, i) => (
              <div key={i} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const s = speedConfig[m.speed] || { color: "hsl(var(--muted-foreground))", label: m.speed };
                      return (
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                          style={{ color: s.color, borderColor: `${s.color}40`, background: `${s.color}10` }}
                        >
                          {s.label}
                        </span>
                      );
                    })()}
                    {(() => {
                      const c = costConfig[m.costTier] || { color: "hsl(var(--muted-foreground))", label: m.costTier };
                      return (
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                          style={{ color: c.color, background: `${c.color}15` }}
                        >
                          {c.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{m.bestFor}</p>
                <p className="text-[10px] font-mono mt-1" style={{ color: `${color}cc` }}>
                  ✦ {m.keyStrength}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Differences */}
      {data.differences.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <Zap className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">Key Differences</h4>
          </div>
          <div className="px-4 py-3 space-y-3">
            {data.differences.map((d, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1 rounded-full shrink-0 mt-0.5" style={{ background: `${color}60` }} />
                <div>
                  <span className="text-xs font-medium text-foreground">{d.name}</span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{d.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Changelog — THE STAR */}
      {data.featureChangelog && data.featureChangelog.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}25`, background: `${color}04` }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: `${color}15` }}>
            <Clock className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color }}>Feature Changelog</h4>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] top-3 bottom-3 w-px" style={{ background: `${color}20` }} />
            
            <div className="py-2">
              {data.featureChangelog.map((entry, i) => {
                const typeConf = changelogTypeConfig[entry.type] || changelogTypeConfig.capability;
                return (
                  <div key={i} className="relative flex items-start gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                    {/* Timeline dot */}
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

      {/* Community Sentiment */}
      {data.community && (
        <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <TrendingUp className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">Community</h4>
          </div>
          <div className="px-4 py-3 space-y-3">
            {/* Sentiment + GitHub row */}
            <div className="flex items-center gap-3 flex-wrap">
              {data.community.sentiment && (
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{sentimentConfig[data.community.sentiment]?.emoji || "⚪"}</span>
                  <span
                    className="text-[10px] font-mono font-medium"
                    style={{ color: sentimentConfig[data.community.sentiment]?.color || "hsl(var(--muted-foreground))" }}
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
              <p className="text-[11px] text-muted-foreground leading-relaxed">{data.community.sentimentSummary}</p>
            )}
            
            {/* Notable Projects */}
            {data.community.notableProjects && data.community.notableProjects.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Notable Projects</span>
                {data.community.notableProjects.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 pl-2">
                    <span className="text-[10px] shrink-0 mt-0.5">→</span>
                    <div>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-foreground hover:underline">
                          {p.name}
                        </a>
                      ) : (
                        <span className="text-[11px] font-medium text-foreground">{p.name}</span>
                      )}
                      <p className="text-[10px] text-muted-foreground/60">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Missing from Database */}
      {data.missingFromDatabase && data.missingFromDatabase.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}25`, background: `${color}04` }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: `${color}15` }}>
            <PlusCircle className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color }}>Not In Your Database</h4>
          </div>
          <div className="px-4 py-3 space-y-2">
            {data.missingFromDatabase.map((m, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="text-sm shrink-0">🆕</span>
                <div>
                  <span className="text-xs font-medium text-foreground">{m.name}</span>
                  {m.releaseDate && (
                    <span className="text-[9px] font-mono text-muted-foreground ml-2">{m.releaseDate}</span>
                  )}
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{m.description}</p>
                </div>
              </div>
            ))}
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
