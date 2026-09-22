import { useEffect, useRef } from "react";

function segmentLengths(points) {
  const lens = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    lens.push(Math.hypot(x2 - x1, y2 - y1));
  }
  return lens;
}

function pointAt(points, lens, total, t) {
  let target = t * total;
  for (let i = 0; i < lens.length; i += 1) {
    if (target <= lens[i] || i === lens.length - 1) {
      const f = lens[i] === 0 ? 0 : target / lens[i];
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      return [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f];
    }
    target -= lens[i];
  }
  return points[0];
}

function makePulse({ path, durationMs, delayMs = 0, color, radius = 3 }) {
  const lens = segmentLengths(path);
  const total = lens.reduce((a, b) => a + b, 0);
  return { path, lens, total, durationMs, delayMs, color, radius };
}

// Renders a real diagram figure with small glowing pulses continuously
// traveling its actual wires — waypoints are read directly off the
// diagram's own pixels (see the `paths` prop callers), never synthesized.
function SignalFlowDiagram({ src, imgSize, paths, size = 104, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const [imgW, imgH] = imgSize;
    const pulses = paths.map(makePulse);

    let raf;
    const start = performance.now();

    function draw(now) {
      raf = requestAnimationFrame(draw);
      if (!img.complete || img.naturalWidth === 0) return;

      const scale = Math.min(size / imgW, size / imgH);
      const destW = imgW * scale;
      const destH = imgH * scale;
      const destX = (size - destW) / 2;
      const destY = (size - destH) / 2;

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, imgW, imgH, destX, destY, destW, destH);

      const elapsed = now - start;
      pulses.forEach(({ path, lens, total, durationMs, delayMs, color, radius }) => {
        const local = elapsed - delayMs;
        if (local < 0) return;
        const t = (local % durationMs) / durationMs;
        const [px, py] = pointAt(path, lens, total, t);
        const cx = destX + px * scale;
        const cy = destY + py * scale;

        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3);
        glow.addColorStop(0, `rgba(${color}, 0.9)`);
        glow.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgb(${color})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [src, size, imgSize, paths]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

export default SignalFlowDiagram;
