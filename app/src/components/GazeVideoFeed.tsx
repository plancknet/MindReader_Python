import { useEffect, useRef, useState } from "react";

interface GazeVideoFeedProps {
  active: boolean;
  className?: string;
}

export function GazeVideoFeed({ active, className }: GazeVideoFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active || !containerRef.current) {
      return;
    }

    const video = document.getElementById("webgazerVideoFeed");
    const overlay = document.getElementById("webgazerVideoCanvas");

    if (video instanceof HTMLVideoElement) {
      video.style.position = "static";
      video.style.margin = "0";
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.borderRadius = "1.75rem";
      video.style.objectFit = "cover";
      containerRef.current.appendChild(video);
      setReady(true);
    }

    if (overlay instanceof HTMLCanvasElement) {
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.borderRadius = "1.75rem";
      overlay.style.opacity = "0.3";
      overlay.style.pointerEvents = "none";
      containerRef.current.appendChild(overlay);
    }
  }, [active]);

  return (
    <div ref={containerRef} className={className} data-ready={ready}>
      {!ready && (
        <div className="flex h-full w-full items-center justify-center rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 text-sm uppercase tracking-[0.35em] text-slate-400">
          Preparando câmera...
        </div>
      )}
    </div>
  );
}
