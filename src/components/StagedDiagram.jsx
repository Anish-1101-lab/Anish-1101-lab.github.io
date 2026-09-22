import { useEffect, useState } from "react";

// Shows a multi-stage figure one stage at a time: each stage is its own crop
// of the real figure, filling the tile by itself, crossfading to the next.
function StagedDiagram({ slides, stageMs = 1800, size = 104 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), stageMs);
    return () => clearInterval(timer);
  }, [slides.length, stageMs]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt=""
          className="absolute inset-0 h-full w-full object-contain p-1.5 transition-opacity duration-500"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1">
        {slides.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1 w-1 rounded-full transition-colors duration-300 ${
              i === index ? "bg-zinc-700" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default StagedDiagram;
