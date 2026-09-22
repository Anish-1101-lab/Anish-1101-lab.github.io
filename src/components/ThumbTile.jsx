import FigureReveal from "./FigureReveal";
import SignalFlowDiagram from "./SignalFlowDiagram";
import StagedDiagram from "./StagedDiagram";
import { initialsOf, stringToHue } from "../lib/color";

const TILE_SIZE = 104;

// Left-column thumbnail for a research row. With no figure it's a colored
// monogram tile; given a `reveal` config it plays a real figure back as a
// black screen lighting up left to right; given a `flow` config it renders
// a real diagram with glowing pulses traveling its actual wires; given a
// `stages` config it highlights one stage of a multi-stage diagram at a
// time; given an `image` it shows the paper's own figure directly, static
// or GIF-animated, with no added motion. Either way the thumbnail is pure
// imagery, matching the reference site's style.
function ThumbTile({ title, tag, href, reveal, flow, stages, image }) {
  const hue = stringToHue(title);
  const gradient = {
    background: `linear-gradient(155deg, hsl(${hue} 70% 52%), hsl(${(hue + 40) % 360} 70% 40%))`,
  };

  let tile;
  if (reveal) {
    tile = (
      <div className="thumb-tile flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black shadow-sm">
        <FigureReveal size={TILE_SIZE} {...reveal} />
      </div>
    );
  } else if (flow) {
    tile = (
      <div className="thumb-tile flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black shadow-sm">
        <SignalFlowDiagram size={TILE_SIZE} {...flow} />
      </div>
    );
  } else if (stages) {
    tile = (
      <div className="thumb-tile flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
        <StagedDiagram size={TILE_SIZE} {...stages} />
      </div>
    );
  } else if (image) {
    const fit = image.fit === "cover" ? "object-cover" : "object-contain";
    tile = (
      <div className="thumb-tile flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
        <img src={image.src} alt="" className={`h-full w-full ${fit}`} />
      </div>
    );
  } else {
    tile = (
      <div
        style={gradient}
        className="thumb-tile flex h-[104px] w-[104px] shrink-0 flex-col items-center justify-center rounded-xl text-center shadow-sm"
      >
        <span className="text-xl font-bold tracking-tight text-white/95">{initialsOf(title)}</span>
        {tag && (
          <span className="mt-1 px-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/80">
            {tag}
          </span>
        )}
      </div>
    );
  }

  if (!href) return tile;
  const internal = href.startsWith("#/");
  return (
    <a href={href} target={internal ? undefined : "_blank"} rel={internal ? undefined : "noreferrer"}>
      {tile}
    </a>
  );
}

export default ThumbTile;
