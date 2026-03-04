import { Loader2, Sparkles, Zap, Target, Lightbulb, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeepDiveData {
  models: Array<{ name: string; bestFor: string; speed: string; costTier: string; keyStrength: string }>;
  differences: Array<{ name: string; description: string }>;
  useCases: Array<{ title: string; description: string }>;
  proTips: Array<{ tip: string }>;
}

interface DeepDiveContentProps {
  loading: boolean;
  data: DeepDiveData | null;
  color: string;
  toolName: string;
  onRetry: () => void;
  onRegenerate: () => void;
}

const speedBadge = (speed: string) => {
  const colors: Record<string, string> = {
    Fast: "hsl(var(--neon-green))",
    Medium: "hsl(var(--neon-amber))",
    Slow: "hsl(var(--neon-rose))",
  };
  return colors[speed] || "hsl(var(--muted-foreground))";
};

const costBadge = (cost: string) => {
  const map: Record<string, string> = { Free: "💚", Low: "💛", Medium: "🟠", High: "🔴", Enterprise: "💎" };
  return map[cost] || "⚪";
};

export const DeepDiveContent = ({ loading, data, color, toolName, onRetry, onRegenerate }: DeepDiveContentProps) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color }} />
        <p className="text-xs font-mono text-muted-foreground">Analyzing {toolName}...</p>
        <p className="text-[10px] font-mono text-muted-foreground/50">This takes a few seconds</p>
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
            <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">Models</h4>
          </div>
          <div className="divide-y divide-border/20">
            {data.models.map((m, i) => (
              <div key={i} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
                      style={{ color: speedBadge(m.speed), borderColor: `${speedBadge(m.speed)}40` }}
                    >
                      {m.speed}
                    </span>
                    <span className="text-[10px]">{costBadge(m.costTier)}</span>
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

      {/* What Makes Each Different */}
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

      {/* Use Cases */}
      {data.useCases.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <Target className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold text-foreground uppercase tracking-wider">Best Use Cases</h4>
          </div>
          <div className="px-4 py-3 space-y-2.5">
            {data.useCases.map((uc, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="text-[10px] font-mono shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border border-border/30 bg-muted/40" style={{ color }}>
                  {i + 1}
                </span>
                <div>
                  <span className="text-xs font-medium text-foreground">{uc.title}</span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tips */}
      {data.proTips.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}20`, background: `${color}06` }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: `${color}15` }}>
            <Lightbulb className="w-3.5 h-3.5" style={{ color }} />
            <h4 className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color }}>Pro Tips</h4>
          </div>
          <div className="px-4 py-3 space-y-2.5">
            {data.proTips.map((t, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="text-sm shrink-0">💡</span>
                <p className="text-[11px] text-foreground/80 leading-relaxed">{t.tip}</p>
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
