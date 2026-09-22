import { useEffect, useRef } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

// Reveals a real paper figure one step at a time, left to right, against a
// black screen — no re-colored or synthesized data, just the actual image
// masked open progressively. A small caption at the bottom tracks the
// current step (a layer index, a model/sequence-length label, etc).
function FigureReveal({
  src,
  size = 104,
  steps = 32,
  stepMs = 130,
  holdMs = 1100,
  fadeMs = 350,
  labelPrefix = "LAYER",
  labels,
  className = "",
}) {
  const canvasRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const buildMs = steps * stepMs;
    const cycleMs = buildMs + holdMs;

    const img = new Image();
    img.src = src;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let raf;
    const start = performance.now();

    function draw(now) {
      raf = requestAnimationFrame(draw);
      if (!img.complete || img.naturalWidth === 0) return;

      const t = (now - start) % cycleMs;
      const revealedCount = Math.min(steps, Math.max(1, Math.floor(t / stepMs) + 1));
      const stepIndex = revealedCount - 1;

      let alpha = 1;
      const fadeStart = cycleMs - fadeMs;
      if (t >= fadeStart) {
        alpha = Math.max(0, 1 - (t - fadeStart) / fadeMs);
      }

      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;
      const scale = Math.min(size / srcW, size / srcH);
      const destW = srcW * scale;
      const destH = srcH * scale;
      const destX = (size - destW) / 2;
      const destY = (size - destH) / 2;

      ctx.clearRect(0, 0, size, size);
      ctx.globalAlpha = alpha;
      const revealedSrcW = t < buildMs ? (srcW * revealedCount) / steps : srcW;
      ctx.drawImage(img, 0, 0, revealedSrcW, srcH, destX, destY, revealedSrcW * scale, destH);
      ctx.globalAlpha = 1;

      if (counterRef.current) {
        const label = labels ? labels[stepIndex] : `${labelPrefix} ${pad(stepIndex)}`;
        counterRef.current.textContent = label;
        counterRef.current.style.opacity = String(alpha * 0.85);
      }
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [src, size, steps, stepMs, holdMs, fadeMs, labelPrefix, labels]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: size, height: size }} />
      <span
        ref={counterRef}
        className="absolute inset-x-0 bottom-1 text-center font-mono text-[8px] font-semibold tracking-widest text-white"
      />
    </div>
  );
}

export default FigureReveal;
