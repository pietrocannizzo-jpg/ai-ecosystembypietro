import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Users, Trophy, TrendingUp } from "lucide-react";
import { categories } from "@/data/cardData";
import { useTools } from "@/hooks/useTools";
import { ToolCard } from "@/components/ecosystem/ToolCard";
import { ComparisonTable } from "@/components/ecosystem/ComparisonTable";
import { Button } from "@/components/ui/button";

export default function CategoryLanding() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { tools, loading } = useTools();
  
  const category = categories.find(cat => cat.id === categoryId);
  const categoryCards = tools.filter(card => card.category === categoryId);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryDescription = (id: string) => {
    switch (id) {
      case "llm-chatbots":
        return "AI assistants & large language models powering conversational AI, reasoning, and content generation";
      case "coding-tools":
        return "AI-powered IDEs, code generators, and app builders transforming software development";
      case "image-gen":
        return "Text-to-image AI models creating photorealistic art, designs, and visual content";
      case "video-gen":
        return "AI video creation tools producing cinema-grade footage from text and image prompts";
      case "audio-music":
        return "AI-powered voice synthesis, music generation, transcription, and audio editing tools";
      case "agents-infra":
        return "Autonomous AI agents, orchestration frameworks, and multi-agent collaboration platforms";
      case "business-tools":
        return "Enterprise AI solutions for productivity, analytics, automation, and business intelligence";
      case "research-data":
        return "AI tools for data analysis, research acceleration, and scientific discovery applications";
      default:
        return "Explore cutting-edge AI tools and platforms in this category.";
    }
  };

  const getCategoryStats = () => {
    const totalTools = categoryCards.length;
    const avgRating = 4.2; // Mock data
    const totalUsers = "2.3M"; // Mock data
    
    return { totalTools, avgRating, totalUsers };
  };

  const stats = getCategoryStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explorer
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: category.color }}
            >
              {category.label.charAt(0)}
            </div>
            <h1 className="text-4xl font-display font-bold">{category.label}</h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {getCategoryDescription(category.id)}
          </p>

          {/* Category Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4" style={{ color: category.color }} />
                <span className="text-2xl font-bold">{stats.totalTools}</span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Tools</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4" style={{ color: category.color }} />
                <span className="text-2xl font-bold">{stats.avgRating}</span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Avg Rating</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4" style={{ color: category.color }} />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Users</span>
            </div>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: category.color }} />
            All {category.label} Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <ToolCard card={card} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Comparison Table */}
        {categoryCards.length >= 3 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-display font-bold mb-6">Compare Top Tools</h2>
            <ComparisonTable 
              cards={categoryCards.slice(0, 6)} 
              categoryColor={category.color}
            />
          </motion.section>
        )}
      </div>
    </div>
  );
}