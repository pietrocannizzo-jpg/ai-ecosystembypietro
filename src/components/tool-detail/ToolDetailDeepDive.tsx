import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock, Rocket, Sparkles, Briefcase, Globe, Layers, Package, Code, Shield, TrendingUp, Handshake, FlaskConical, GitBranch, Tag, Link2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { HowItCompares } from "./HowItCompares";
import type { CardData, TimelineEntry } from "@/data/cardData";

interface Props {
  card: CardData;
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

const CHANGELOG_TYPES = new Set(["model", "product", "api", "update", "launch"]);

const FeatureChangelog = ({ timeline, color }: { timeline: TimelineEntry[]; color: string }) => {
  const sorted = [...timeline]
    .filter((e) => CHANGELOG_TYPES.has(e.type))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}25`, background: `${color}04` }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: `${color}15` }}>
          <Clock className="w-3.5 h-3.5" style={{ color }} />
          <h4 className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color }}>
            Feature Changelog
          </h4>
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">
            {sorted.length} events
          </span>
        </div>
        <div className="relative">
          <div className="absolute left-[27px] top-3 bottom-3 w-px" style={{ background: `${color}20` }} />
          <div className="py-2">
            {sorted.map((entry, i) => {
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
  );
};

export const ToolDetailDeepDive = ({ card }: Props) => {
  const hasCachedTimeline = card.timeline && card.timeline.some((e) => CHANGELOG_TYPES.has(e.type));

  return (
    <div className="space-y-8">
      {/* How It Compares — real competitor cards */}
      <HowItCompares card={card} />

      {/* Feature Changelog — from timeline data */}
      {hasCachedTimeline && (
        <FeatureChangelog timeline={card.timeline} color={card.color} />
      )}
    </div>
  );
};
