import { useEffect, useRef, useState } from "react";
import { renderInline } from "./inline";

// Interactive walk-through of layerwise source patching and the CoT Mediation
// Index, ported from the paper's page at adityanagarsekar.github.io. The mock
// model's numbers are illustrative; the profiles underneath are the paper's.

const NL = 24;
const TAU_DROP = 1e-4;
const TAU_DEN = 1e-3;
const BASE = -0.36;
const W = ["Q:", "Can", "penguins", "cross", "deserts?", "Think:", "penguins", "need", "cold,", "deserts", "are", "hot,", "so", "A:", "No"];
const COT = [6, 7, 8, 9, 10, 11, 12];
const ANS = 14;

const TX = 66;
const TW = 4.8;
const GAP = 3;
const Y1 = 46;
const Y2 = 118;
const PY0 = 172;
const CELL = (548 - TX) / NL;
const BY0 = 218;
const HY = 326;

const BOXES = (() => {
  let x = TX;
  return W.map((w) => {
    const wd = Math.round(w.length * TW + 6);
    const box = { x, w: wd };
    x += wd + GAP;
    return box;
  });
})();

// Real profiles: [model, mean CMI, layers, active layer ranges, % active].
const PROF = [
  ["Phi-mini-MoE-instruct", 0.123, 32, [[0, 31]], 27.03],
  ["Phi-4-mini-reasoning", 0.082, 32, [[1, 1], [2, 2], [4, 4], [8, 8], [10, 10], [12, 12], [14, 16], [21, 31]], 12.66],
  ["Qwen3-1.7B", 0.0555, 28, [[0, 8], [26, 27]], 8.21],
  ["Phi-3.5-mini-instruct", 0.0452, 36, [[2, 6], [8, 14], [25, 29], [33, 35]], 5.14],
  ["phi-2", 0.0107, 32, [[29, 31]], 2.66],
  ["Qwen3-0.6B", 0.0107, 32, [[29, 31]], 2.66],
  ["DialoGPT-large", 0.0137, 36, [[0, 2]], 1.94],
  ["phi-1_5", 0.0092, 24, [[21, 22]], 1.25],
  ["phi-4", 0.0065, 40, [[3, 5], [38, 38]], 0.75],
  ["Qwen3-8B", 0.0014, 36, [[33, 33]], 0.14],
  ["Qwen3-4B", 0.0, 36, [], 0.0],
];

const PROCEDURE = [
  ["run", "Run the model on $x_c$ and on $x_{\\neg c}$ with hidden states enabled."],
  ["copy", "Copy the No-CoT hidden states at positions $\\mathcal{C}$, layer $\\ell$, into the With-CoT hidden-state tensor."],
  ["recomp", "Recompute $\\log P(y \\mid x_c)$ under a context manager that patches layer $\\ell$ during the forward pass."],
  ["ret", "Return baseline minus patched log-probability, clipped at zero; repeat on $\\mathcal{N}$ for the control drop."],
];

const QUANTITIES = [
  ["dcot", "$\\Delta_{\\mathrm{cot},\\ell} = \\max\\big(0,\\ \\log P(y \\mid x_c) - \\log P(y \\mid \\mathrm{patch}_{\\mathcal{C}})\\big)$"],
  ["dctrl", "$\\Delta_{\\mathrm{ctrl},\\ell} = \\max\\big(0,\\ \\log P(y \\mid x_c) - \\log P(y \\mid \\mathrm{patch}_{\\mathcal{N}})\\big)$, averaged over 8 draws of $\\mathcal{N}$"],
  ["cmi", "$\\mathrm{CMI}_\\ell = \\dfrac{\\max(0,\\ \\Delta_{\\mathrm{cot},\\ell} - \\Delta_{\\mathrm{ctrl},\\ell})}{\\max(\\Delta_{\\mathrm{cot},\\ell} + \\Delta_{\\mathrm{ctrl},\\ell},\\ \\tau_{\\mathrm{den}})}$, or $0$ if the drops sum to less than $\\tau_{\\mathrm{drop}}$"],
];

const INTRO = (
  <>
    <b>You are the auditor.</b> The model answered “No” after writing a rationale (orange span). Did the
    answer actually depend on that text? Pick a layer, patch the rationale positions with the No-CoT
    states, then patch a control set, and read off CMI. Or run all layers to draw the whole row.
  </>
);

function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function mockProfile(kind) {
  const r = rng(kind === "band" ? 3 : kind === "spread" ? 5 : 9);
  const cot = [];
  const ctrl = [];
  for (let l = 0; l < NL; l++) {
    const n1 = r() - 0.5;
    const n2 = r() - 0.5;
    if (kind === "band") {
      cot.push(0.04 + 0.85 * Math.exp(-Math.pow((l - 15) / 1.7, 2)) + 0.04 * n1);
      ctrl.push(0.06 + (0.02 * l) / NL + 0.03 * n2);
    } else if (kind === "spread") {
      cot.push(0.2 + 0.16 * Math.abs(n1) * 2 + 0.05 * Math.sin(l));
      ctrl.push(0.09 + 0.03 * n2);
    } else {
      cot.push(0.07 + 0.035 * n1);
      ctrl.push(0.07 + 0.035 * n2);
    }
  }
  return { cot: cot.map((v) => Math.max(0, v)), ctrl: ctrl.map((v) => Math.max(0, v)) };
}

function cmiOf(dc, dn) {
  if (dc + dn < TAU_DROP) return 0;
  return Math.max(0, dc - dn) / Math.max(dc + dn, TAU_DEN);
}

function heat(v) {
  const stops = [
    [0, [17, 17, 17]],
    [0.35, [106, 27, 154]],
    [0.7, [240, 146, 40]],
    [1, [255, 227, 106]],
  ];
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const [a0, ac] = stops[i - 1];
      const [b0, bc] = stops[i];
      const u = (v - a0) / (b0 - a0);
      return `rgb(${ac.map((c, j) => Math.round(c + (bc[j] - c) * u)).join(",")})`;
    }
  }
  return "rgb(255,227,106)";
}

const fmt = (x, d = 2) => (+x).toFixed(d);

function Sub({ children }) {
  return (
    <>
      <tspan fontSize="8" dy="3">
        {children}
      </tspan>
      <tspan dy="-3" />
    </>
  );
}

const TOKEN_STYLE = {
  plain: { fill: "#f4f4f1", stroke: "#cfcfc8" },
  cot: { fill: "#fdebd2", stroke: "#f09228" },
  ans: { fill: "#e8f7e6", stroke: "#4cbf48" },
  blank: { fill: "#fff", stroke: "#ddd", dash: "3 2" },
  src: { fill: "#eef3fa", stroke: "#1772d0" },
};

function Token({ box, y, label, kind, hit, faint }) {
  const s = TOKEN_STYLE[kind];
  return (
    <g>
      <rect
        x={box.x}
        y={y - 11}
        width={box.w}
        height={22}
        rx={4}
        fill={s.fill}
        stroke={s.stroke}
        strokeWidth={hit ? 2.5 : 1}
        strokeDasharray={s.dash}
        style={{ transition: "fill 0.3s, stroke 0.3s" }}
      />
      <text
        x={box.x + box.w / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9.5"
        fill={faint ? "#bbb" : "#222"}
      >
        {label}
      </text>
    </g>
  );
}

function Bar({ index, label, color, width, value }) {
  const y = BY0 + index * 26;
  return (
    <g>
      <text x={8} y={y} dominantBaseline="central" className="pa-lbl">
        {label}
      </text>
      <rect x={TX} y={y - 8} width={300} height={16} rx={8} fill="#ecece8" />
      <rect x={TX} y={y - 8} width={width} height={16} rx={8} fill={color} style={{ transition: "width 0.4s" }} />
      <text x={TX + 308} y={y} dominantBaseline="central" className="pa-stat">
        {value}
      </text>
    </g>
  );
}

function PatchingAudit() {
  const [view, setView] = useState(() => ({
    regime: "band",
    layer: 12,
    prof: mockProfile("band"),
    done: {},
    ctrlSet: null,
    arrows: null,
    hl: [],
    cap: INTRO,
    busy: false,
  }));
  // The async walk-through reads and writes this copy; every change is
  // mirrored into `view`, which is all the render reads.
  const ref = useRef({ ...view });
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = (ms) => new Promise((res) => setTimeout(res, reduce ? 0 : ms));
  const update = (patchState) => {
    Object.assign(ref.current, patchState);
    if (alive.current) setView({ ...ref.current });
  };

  function setLayer(l) {
    const S = ref.current;
    update({
      layer: l,
      arrows: null,
      hl: [],
      cap: (
        <>
          <b>Layer {l} selected.</b> Patch the rationale positions to see how much the answer's
          log-probability depends on the CoT hidden states at this layer, then patch a random control set of
          the same size to see how much any patch at this layer hurts.
        </>
      ),
    });
  }

  async function patch(kind, quick) {
    const S = ref.current;
    const l = S.layer;
    update({ busy: true });
    if (kind === "ctrl") {
      const pool = [];
      for (let i = 0; i < W.length; i++) if (!COT.includes(i) && i !== ANS) pool.push(i);
      const r = rng(100 + l);
      pool.sort(() => r() - 0.5);
      update({ ctrlSet: pool.slice(0, COT.length).sort((a, b) => a - b) });
    }

    update({
      hl: ["run"],
      ...(quick
        ? {}
        : {
            cap: (
              <>
                <b>Run both prompts.</b> The With-CoT and No-CoT prompts go through the model with hidden
                states kept at every layer. The baseline is log P(No | x<sub>c</sub>) = {fmt(BASE)}.
              </>
            ),
          }),
    });
    await delay(quick ? 60 : 700);

    update({
      hl: ["copy"],
      arrows: kind,
      ...(quick
        ? {}
        : {
            cap:
              kind === "cot" ? (
                <>
                  <b>Copy the No-CoT hidden states into the rationale positions at layer {l}.</b> Every other
                  position, and every other layer, keeps its With-CoT states. If the model was using the
                  rationale here, this is where the damage happens.
                </>
              ) : (
                <>
                  <b>Same patch on a random control set</b> of {COT.length} non-rationale positions at layer{" "}
                  {l} (positions {S.ctrlSet.join(", ")}). This measures how much any patch at this layer
                  hurts, and is averaged over 8 draws.
                </>
              ),
          }),
    });
    await delay(quick ? 80 : 900);

    update({ hl: ["recomp"] });
    await delay(quick ? 60 : 500);

    const dv = kind === "cot" ? S.prof.cot[l] : S.prof.ctrl[l];
    const d = { ...(S.done[l] || {}), [kind]: dv };
    let hl = ["ret", kind === "cot" ? "dcot" : "dctrl"];
    if (d.cot !== undefined && d.ctrl !== undefined) {
      d.cmi = cmiOf(d.cot, d.ctrl);
      hl = ["ret", "cmi"];
    }
    const next = { done: { ...S.done, [l]: d }, hl, busy: false };
    if (!quick) {
      next.cap = (
        <>
          {kind === "cot" ? (
            <>
              <b>
                CoT drop at layer {l}: Δ<sub>cot</sub> = {fmt(dv)}.
              </b>{" "}
              The answer's log-probability went from {fmt(BASE)} to {fmt(BASE - dv)}.
            </>
          ) : (
            <>
              <b>
                Control drop at layer {l}: Δ<sub>ctrl</sub> = {fmt(dv)}.
              </b>{" "}
              This is the cost of patching anything here; it is subtracted so that generic disruption does
              not count as mediation.
            </>
          )}
          {d.cmi !== undefined && (
            <>
              {" "}
              Both drops are in, so CMI<sub>{l}</sub> = {fmt(d.cmi)}
              {d.cmi > 0.5
                ? ": at this layer the answer routed through the rationale."
                : d.cmi > 0.1
                  ? ": partial mediation."
                  : ": the rationale text was not on the path to the answer here."}
            </>
          )}
        </>
      );
    }
    update(next);
  }

  async function runAll() {
    const S = ref.current;
    if (S.busy) return;
    for (let l = 0; l < NL; l++) {
      if (!alive.current) return;
      update({ layer: l });
      await patch("cot", true);
      await patch("ctrl", true);
      await delay(90);
    }
    let best = 0;
    for (let l = 0; l < NL; l++) if (S.done[l].cmi > S.done[best].cmi) best = l;
    const act = Object.keys(S.done)
      .filter((k) => S.done[k].cmi > 0.05)
      .map(Number);
    update({
      arrows: null,
      hl: [],
      cap: (
        <>
          <b>All {NL} layers audited.</b>{" "}
          {act.length === 0
            ? "No layer shows CoT-specific influence: a bypass regime. The model wrote a plausible rationale and did not use it."
            : act.length <= 8
              ? `Mediation is confined to layers ${act.join(", ")}, peaking at layer ${best} (CMI ${fmt(S.done[best].cmi)}): a narrow band, the signature the paper finds in reasoning-tuned models.`
              : `Mediation is spread over ${act.length} layers, peaking at ${best}: distributed routing, as the paper sees in the Mixture-of-Experts model.`}{" "}
          Compare with the real profiles below.
        </>
      ),
    });
  }

  function reset() {
    const S = ref.current;
    if (S.busy) return;
    update({ done: {}, ctrlSet: null, arrows: null, hl: [], cap: INTRO });
  }

  function changeRegime(regime) {
    const S = ref.current;
    if (S.busy) return;
    update({ regime, prof: mockProfile(regime), done: {}, ctrlSet: null, arrows: null, hl: [], cap: INTRO });
  }

  const l = view.layer;
  const d = view.done[l] || {};
  const P = Math.exp;
  const arrowPos = view.arrows === "cot" ? COT : view.arrows === "ctrl" ? view.ctrlSet || [] : [];
  const audited = Object.values(view.done).filter((v) => v.cmi !== undefined).length;

  const btn =
    "rounded-full border border-blue-700 bg-white px-3.5 py-1 text-[13px] text-blue-700 transition-colors hover:bg-blue-50 disabled:opacity-50 dark:border-blue-400 dark:bg-zinc-900 dark:text-blue-400 dark:hover:bg-zinc-800";
  const line = (on) =>
    `rounded py-0.5 transition-[background-color,box-shadow] duration-200 ${
      on ? "bg-[#fff1bf] shadow-[inset_3px_0_0_#f0b400] dark:bg-amber-900/40" : ""
    }`;

  return (
    <div className="patching-audit mt-6 xl:ml-[calc(50%-520px)] xl:w-[1040px]">
      <div className="grid gap-x-6 gap-y-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="min-w-0">
          <svg
            viewBox="0 0 560 420"
            role="img"
            aria-label="Layerwise source patching on a mock model: two prompts, a layer picker, log-probability bars and a CMI heatmap row"
            className="block h-auto w-full rounded-lg border border-zinc-200 bg-[#fafaf8] dark:border-zinc-800"
          >
            <defs>
              {[
                ["cot", "#f09228"],
                ["ctrl", "#1772d0"],
              ].map(([id, color]) => (
                <marker
                  key={id}
                  id={`pa-ar-${id}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill={color} />
                </marker>
              ))}
            </defs>

            {/* prompts */}
            <text x={8} y={Y1} dominantBaseline="central" className="pa-lbl">
              with CoT
            </text>
            <text x={8} y={Y2} dominantBaseline="central" className="pa-lbl">
              no CoT
            </text>
            <text x={8} y={Y2 + 18} dominantBaseline="central" className="pa-lbl pa-faint">
              (aligned)
            </text>
            <text x={BOXES[COT[0]].x} y={Y1 - 24} dominantBaseline="central" className="pa-lbl" fill="#c46a0a">
              rationale span → positions C
            </text>
            <text
              x={BOXES[ANS].x + BOXES[ANS].w / 2}
              y={Y1 - 24}
              textAnchor="middle"
              dominantBaseline="central"
              className="pa-lbl"
            >
              y
            </text>
            {W.map((w, i) => {
              const isCot = COT.includes(i);
              const hit = arrowPos.includes(i);
              return (
                <g key={i}>
                  <Token
                    box={BOXES[i]}
                    y={Y1}
                    label={w}
                    kind={isCot ? "cot" : i === ANS ? "ans" : "plain"}
                    hit={hit}
                  />
                  <Token
                    box={BOXES[i]}
                    y={Y2}
                    label={isCot ? "·" : w}
                    kind={hit ? "src" : isCot ? "blank" : i === ANS ? "ans" : "plain"}
                    faint={isCot && !hit}
                  />
                </g>
              );
            })}
            {arrowPos.map((i) => {
              const cx = BOXES[i].x + BOXES[i].w / 2;
              return (
                <path
                  key={`${view.arrows}-${i}`}
                  d={`M${cx},${Y2 - 12} L${cx},${Y1 + 13}`}
                  fill="none"
                  stroke={view.arrows === "cot" ? "#f09228" : "#1772d0"}
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  markerEnd={`url(#pa-ar-${view.arrows})`}
                />
              );
            })}

            {/* layer picker */}
            <text x={8} y={PY0 + 8} dominantBaseline="central" className="pa-lbl">
              layer ℓ
            </text>
            {Array.from({ length: NL }, (_, i) => (
              <rect
                key={i}
                x={TX + i * CELL}
                y={PY0}
                width={CELL - 2}
                height={16}
                rx={2}
                fill={i === l ? "#e0a800" : view.done[i]?.cmi !== undefined ? "#d5d5cf" : "#ecece8"}
                style={{ cursor: "pointer", transition: "fill 0.2s" }}
                onClick={() => !ref.current.busy && setLayer(i)}
              />
            ))}
            {Array.from({ length: NL / 4 }, (_, k) => (
              <text key={k} x={TX + k * 4 * CELL + 2} y={PY0 + 26} dominantBaseline="central" className="pa-lbl pa-faint">
                {k * 4}
              </text>
            ))}

            {/* log-probability bars */}
            <Bar
              index={0}
              label="baseline"
              color="#b3b3ad"
              width={300 * P(BASE)}
              value={
                <>
                  log P(y | x<Sub>c</Sub>) = {fmt(BASE)}
                </>
              }
            />
            <Bar
              index={1}
              label="CoT patch"
              color="#f09228"
              width={d.cot !== undefined ? 300 * P(BASE - d.cot) : 0}
              value={
                d.cot !== undefined ? (
                  <>
                    {fmt(BASE - d.cot)}  Δ<Sub>cot</Sub> = {fmt(d.cot)}
                  </>
                ) : (
                  "not yet"
                )
              }
            />
            <Bar
              index={2}
              label="ctrl patch"
              color="#1772d0"
              width={d.ctrl !== undefined ? 300 * P(BASE - d.ctrl) : 0}
              value={
                d.ctrl !== undefined ? (
                  <>
                    {fmt(BASE - d.ctrl)}  Δ<Sub>ctrl</Sub> = {fmt(d.ctrl)}
                  </>
                ) : (
                  "not yet"
                )
              }
            />
            <text x={8} y={BY0 + 3 * 26 + 2} dominantBaseline="central" className="pa-stat">
              {d.cmi !== undefined ? (
                <>
                  CMI<Sub>{l}</Sub> = max(0, {fmt(d.cot)} − {fmt(d.ctrl)}) / max({fmt(d.cot + d.ctrl)}, τ) ={" "}
                  <tspan fontWeight="700">{fmt(d.cmi)}</tspan>
                </>
              ) : d.cot !== undefined || d.ctrl !== undefined ? (
                "CMI needs both drops"
              ) : (
                ""
              )}
            </text>

            {/* CMI heatmap row */}
            <text x={8} y={HY + 9} dominantBaseline="central" className="pa-lbl">
              CMI
            </text>
            <text x={8} y={HY + 24} dominantBaseline="central" className="pa-lbl pa-faint">
              per layer
            </text>
            {Array.from({ length: NL }, (_, i) => (
              <rect
                key={i}
                x={TX + i * CELL}
                y={HY}
                width={CELL - 2}
                height={18}
                rx={2}
                fill={view.done[i]?.cmi !== undefined ? heat(view.done[i].cmi) : "#f2f2ee"}
                stroke={i === l ? "#e0a800" : "none"}
                strokeWidth={i === l ? 2 : 0}
                style={{ transition: "fill 0.3s" }}
              />
            ))}
            {Array.from({ length: 21 }, (_, i) => (
              <rect key={i} x={TX + i * 6} y={HY + 30} width={6} height={7} fill={heat(i / 20)} />
            ))}
            <text x={TX} y={HY + 48} dominantBaseline="central" className="pa-lbl pa-faint">
              0
            </text>
            <text x={TX + 126} y={HY + 48} dominantBaseline="central" className="pa-lbl pa-faint">
              1
            </text>
            <text x={TX + 150} y={HY + 36} dominantBaseline="central" className="pa-lbl pa-faint">
              black: no CoT-specific effect at that layer
            </text>
            <text x={TX + 150} y={HY + 50} dominantBaseline="central" className="pa-lbl pa-faint">
              yellow: the answer depended on the rationale there
            </text>
            <text x={548} y={404} textAnchor="end" dominantBaseline="central" className="pa-stat">
              {audited ? `${audited} of ${NL} layers audited` : ""}
            </text>
          </svg>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-zinc-600 dark:text-zinc-400">
            <label className="inline-flex items-center gap-1.5">
              mock model
              <select
                value={view.regime}
                onChange={(e) => changeRegime(e.target.value)}
                className="rounded border border-zinc-300 bg-white px-1 py-0.5 text-[12.5px] text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <option value="band">reasoning-tuned: narrow band</option>
                <option value="spread">mixture-of-experts: spread out</option>
                <option value="bypass">bypass: rationale unused</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5">
              layer ℓ
              <input
                type="range"
                min="0"
                max={NL - 1}
                step="1"
                value={l}
                onChange={(e) => !ref.current.busy && setLayer(+e.target.value)}
                className="w-[120px] accent-blue-700"
              />
              <span className="min-w-[2em] tabular-nums text-zinc-800 dark:text-zinc-200">{l}</span>
            </label>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <button type="button" className={btn} onClick={() => !ref.current.busy && patch("cot", false)}>
              Patch CoT positions
            </button>
            <button type="button" className={btn} onClick={() => !ref.current.busy && patch("ctrl", false)}>
              Patch control positions
            </button>
            <button type="button" className={btn} onClick={runAll}>
              Run all layers
            </button>
            <button type="button" className={btn} onClick={reset}>
              Reset
            </button>
          </div>
          <p className="mt-3 min-h-[58px] text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{view.cap}</p>
        </div>

        <div className="min-w-0 space-y-4 text-[13.5px] leading-[1.7] text-zinc-800 dark:text-zinc-200">
          <div className="overflow-x-auto border-y-2 border-zinc-700 px-3.5 pb-3 pt-2.5 dark:border-zinc-400">
            <p className="mb-2 border-b border-zinc-700 pb-1 font-bold dark:border-zinc-400">
              Procedure: layerwise source patching
            </p>
            <p className="mb-2 leading-snug">
              <b>Input:</b>{" "}
              {renderInline(
                "With-CoT prompt $x_c$, No-CoT prompt $x_{\\neg c}$, reference answer $y$, CoT positions $\\mathcal{C}$, layer $\\ell$.",
                "pa-in"
              )}
            </p>
            {PROCEDURE.map(([key, text]) => (
              <div key={key} className={line(view.hl.includes(key))}>
                {renderInline(text, `pa-${key}`)}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto border-y-2 border-zinc-700 px-3.5 pb-3 pt-2.5 dark:border-zinc-400">
            <p className="mb-2 border-b border-zinc-700 pb-1 font-bold dark:border-zinc-400">The three quantities</p>
            {QUANTITIES.map(([key, text]) => (
              <div key={key} className={line(view.hl.includes(key))}>
                {renderInline(text, `pa-${key}`)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[12.5px] leading-snug text-zinc-500 dark:text-zinc-400">
          The real profiles: 11 models on 20 StrategyQA prompts. Shaded cells are layers with nonzero CMI on at
          least one prompt; the number is the mean CMI over all layers and prompts.
        </p>
        {PROF.map(([name, mean, L, ranges, active]) => {
          const on = new Array(L).fill(false);
          ranges.forEach(([a, b]) => {
            for (let i = a; i <= b; i++) on[i] = true;
          });
          return (
            <div
              key={name}
              className="my-[3px] grid grid-cols-[96px_minmax(0,1fr)_46px] items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 sm:grid-cols-[150px_minmax(0,1fr)_54px_118px]"
            >
              <span className="truncate text-right text-zinc-500 dark:text-zinc-400">{name}</span>
              <span className="grid h-3 gap-px" style={{ gridTemplateColumns: `repeat(${L}, minmax(0, 1fr))` }}>
                {on.map((v, i) => (
                  <i
                    key={i}
                    title={`layer ${i}`}
                    className={`block rounded-[1px] ${v ? "bg-[#f09228]" : "bg-[#ecece8] dark:bg-zinc-800"}`}
                  />
                ))}
              </span>
              <span className="text-right tabular-nums">{fmt(mean, 4)}</span>
              <span className="relative isolate hidden pl-1 text-[11px] text-zinc-500 dark:text-zinc-400 sm:block">
                <i
                  className="absolute left-0 top-1/2 -z-10 -mt-[3px] h-1.5 rounded-[3px] bg-[#fdebd2] dark:bg-amber-900/50"
                  style={{ width: `${Math.min(100, active * 3.5)}%` }}
                />
                {fmt(active, 1)}% active
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PatchingAudit;
