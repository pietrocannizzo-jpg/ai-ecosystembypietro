import type { CardData } from "@/data/cardData";

interface MinimapProps {
  cards: CardData[];
  zoom: number;
  panX: number;
  panY: number;
  viewportWidth: number;
  viewportHeight: number;
}

export const Minimap = ({ cards, zoom, panX, panY, viewportWidth, viewportHeight }: MinimapProps) => {
  if (cards.length === 0) return null;

  // Calculate bounds
  const xs = cards.map(c => c.positionX);
  const ys = cards.map(c => c.positionY);
  const minX = Math.min(...xs) - 200;
  const maxX = Math.max(...xs) + 500;
  const minY = Math.min(...ys) - 200;
  const maxY = Math.max(...ys) + 400;

  const worldW = maxX - minX;
  const worldH = maxY - minY;
  
  const mapW = 160;
  const mapH = 100;
  const scale = Math.min(mapW / worldW, mapH / worldH);

  // Viewport rect in minimap coords
  const vpX = (-panX / zoom - minX) * scale;
  const vpY = (-panY / zoom - minY) * scale;
  const vpW = (viewportWidth / zoom) * scale;
  const vpH = (viewportHeight / zoom) * scale;

  return (
    <div className="fixed bottom-4 right-4 z-40 rounded-lg border border-border/50 overflow-hidden backdrop-blur-sm" style={{ width: mapW, height: mapH, background: "hsl(230 25% 7% / 0.8)" }}>
      {/* Card dots */}
      {cards.map(card => (
        <div
          key={card.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: (card.positionX - minX) * scale,
            top: (card.positionY - minY) * scale,
            background: card.color,
            opacity: 0.7,
          }}
        />
      ))}
      {/* Viewport indicator */}
      <div
        className="absolute border border-foreground/40 rounded-sm"
        style={{
          left: Math.max(0, vpX),
          top: Math.max(0, vpY),
          width: Math.min(vpW, mapW),
          height: Math.min(vpH, mapH),
          background: "hsl(210 20% 92% / 0.05)",
        }}
      />
    </div>
  );
};
