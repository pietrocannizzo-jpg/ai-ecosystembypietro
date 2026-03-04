import { useState, useCallback, useMemo } from "react";
import { InfiniteCanvas } from "@/components/canvas/InfiniteCanvas";
import { MapCard } from "@/components/canvas/MapCard";
import { CardDetailModal } from "@/components/canvas/CardDetailModal";
import { Toolbar } from "@/components/canvas/Toolbar";
import { Minimap } from "@/components/canvas/Minimap";
import { CenterHub } from "@/components/canvas/CenterHub";
import { defaultCards, categories } from "@/data/cardData";
import type { CardData } from "@/data/cardData";

const Index = () => {
  const [cards] = useState<CardData[]>(defaultCards);
  const [zoom, setZoom] = useState(0.18);
  const [panX, setPanX] = useState(-500);
  const [panY, setPanY] = useState(-500);
  const [search, setSearch] = useState("");
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const handleCanvasState = useCallback((state: { zoom: number; panX: number; panY: number }) => {
    setZoom(state.zoom);
    setPanX(state.panX);
    setPanY(state.panY);
  }, []);

  const toggleCategory = useCallback((catId: string) => {
    setHiddenCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  const visibleCards = useMemo(() => {
    return cards.filter(c => !hiddenCategories.has(c.category));
  }, [cards, hiddenCategories]);

  const isCardDimmed = useCallback((card: CardData) => {
    if (!search) return false;
    const q = search.toLowerCase();
    return !(
      card.title.toLowerCase().includes(q) ||
      card.summary.toLowerCase().includes(q) ||
      card.tags.some(t => t.toLowerCase().includes(q)) ||
      card.subcategory.toLowerCase().includes(q) ||
      card.subProducts.some(sp => sp.name.toLowerCase().includes(q))
    );
  }, [search]);

  const fitAll = useCallback(() => {
    if (visibleCards.length === 0) return;
    const xs = visibleCards.map(c => c.positionX);
    const ys = visibleCards.map(c => c.positionY);
    const minX = Math.min(...xs) - 200;
    const maxX = Math.max(...xs) + 500;
    const minY = Math.min(...ys) - 200;
    const maxY = Math.max(...ys) + 400;
    const worldW = maxX - minX;
    const worldH = maxY - minY;
    const vw = window.innerWidth;
    const vh = window.innerHeight - 48;
    const newZoom = Math.min(vw / worldW, vh / worldH) * 0.9;
    setPanX(-minX * newZoom + (vw - worldW * newZoom) / 2);
    setPanY(-minY * newZoom + (vh - worldH * newZoom) / 2 + 48);
    setZoom(Math.max(0.1, Math.min(1, newZoom)));
  }, [visibleCards]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify({ cards, version: 1 }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-defence-tracker.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [cards]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        console.log("Imported:", data);
        // TODO: merge imported data
      } catch {
        console.error("Invalid JSON");
      }
    };
    input.click();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        hiddenCategories={hiddenCategories}
        onToggleCategory={toggleCategory}
        zoom={zoom}
        onZoomIn={() => setZoom(z => Math.min(3, z * 1.2))}
        onZoomOut={() => setZoom(z => Math.max(0.1, z / 1.2))}
        onFitAll={fitAll}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="pt-12 h-full">
        <InfiniteCanvas
          zoom={zoom}
          panX={panX}
          panY={panY}
          onStateChange={handleCanvasState}
        >
          {() => (
            <>
              <CenterHub centerX={5000} centerY={5000} />
              {visibleCards.map(card => (
                <MapCard
                  key={card.id}
                  card={card}
                  dimmed={isCardDimmed(card)}
                  onClick={() => setSelectedCard(card)}
                />
              ))}
            </>
          )}
        </InfiniteCanvas>
      </div>

      <Minimap
        cards={visibleCards}
        zoom={zoom}
        panX={panX}
        panY={panY}
        viewportWidth={window.innerWidth}
        viewportHeight={window.innerHeight - 48}
      />

      <CardDetailModal
        card={selectedCard}
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
};

export default Index;
