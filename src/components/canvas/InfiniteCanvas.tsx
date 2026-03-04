import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}

interface InfiniteCanvasProps {
  children: (state: CanvasState) => ReactNode;
  zoom: number;
  panX: number;
  panY: number;
  onStateChange: (state: CanvasState) => void;
}

export const InfiniteCanvas = ({ children, zoom, panX, panY, onStateChange }: InfiniteCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.max(0.1, Math.min(3, zoom + delta * zoom));
      
      // Zoom toward cursor
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const scale = newZoom / zoom;
        const newPanX = cx - scale * (cx - panX);
        const newPanY = cy - scale * (cy - panY);
        onStateChange({ zoom: newZoom, panX: newPanX, panY: newPanY });
      }
    } else {
      // Pan
      onStateChange({ zoom, panX: panX - e.deltaX, panY: panY - e.deltaY });
    }
  }, [zoom, panX, panY, onStateChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      isPanning.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      (e.currentTarget as HTMLElement).style.cursor = "grabbing";
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    onStateChange({ zoom, panX: panX + dx, panY: panY + dy });
  }, [zoom, panX, panY, onStateChange]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    isPanning.current = false;
    (e.currentTarget as HTMLElement).style.cursor = "grab";
  }, []);

  // Touch support
  const touches = useRef<{ dist: number; midX: number; midY: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isPanning.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touches.current = {
        dist: Math.hypot(dx, dy),
        midX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        midY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      onStateChange({ zoom, panX: panX + dx, panY: panY + dy });
    } else if (e.touches.length === 2 && touches.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / touches.current.dist;
      const newZoom = Math.max(0.1, Math.min(3, zoom * scale));
      touches.current.dist = dist;
      onStateChange({ zoom: newZoom, panX, panY });
    }
  }, [zoom, panX, panY, onStateChange]);

  const handleTouchEnd = useCallback(() => {
    isPanning.current = false;
    touches.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden cursor-grab relative"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(230 15% 18% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(230 15% 18% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          backgroundPosition: `${panX}px ${panY}px`,
        }}
      />
      
      {/* Canvas content */}
      <div
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children({ zoom, panX, panY })}
      </div>
    </div>
  );
};
