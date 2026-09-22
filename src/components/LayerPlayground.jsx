import { useState } from "react";

// "Try the layers": a tiny linear-RNN instance (four state dimensions, a
// 64-step test signal) run live for each lrnnx layer. Ported from the paper's
// page at adityanagarsekar.github.io; the per-layer parameterisation follows
// the lrnnx source. Text fields hold trusted, static HTML (<sub>/<sup> only).

const L = 64;
const NST = 4;

const LAYERS = {
  s4: { name: "S4", mod: "lti", cls: "S4", kw: "", siso: true, lti: true, discs: ["kernel"], A: "dplr", direct: false, conv: true,
    rows: [["input mixing", "SISO: each channel has its own state-space model"], ["time variation", "time-invariant: A, B, C fixed for the whole sequence"], ["state matrix", "diagonal-plus-low-rank (DPLR) complex A, HiPPO-initialised"], ["discretisation", "inside the kernel computation; no scheme to choose"], ["how it runs", "as a long convolution: K<sub>k</sub> = C Ā<sup>k</sup> B̄ built once, applied by FFT"]],
    cap: "S4 never runs the recurrence at training time. It builds the kernel K once from (A, B, C, Δ) and convolves the input with it; the plot shows K and the output it produces. The DPLR structure is what makes that kernel cheap to compute." },
  s4d: { name: "S4D", mod: "lti", cls: "S4D", kw: ', disc="zoh"', siso: true, lti: true, discs: ["zoh", "bilinear"], A: "diag", direct: false, conv: true,
    rows: [["input mixing", "SISO: one state-space model per channel"], ["time variation", "time-invariant"], ["state matrix", "diagonal complex A: the diagonal simplification of S4"], ["discretisation", "ZOH by default; bilinear also available"], ["how it runs", "as a convolution, like S4"]],
    cap: "S4D keeps S4's convolutional view but drops the low-rank correction, so A is a plain complex diagonal and the kernel is a sum of damped complex exponentials." },
  s5: { name: "S5", mod: "lti", cls: "S5", kw: ', discretization="zoh"', siso: false, lti: true, discs: ["zoh", "bilinear", "dirac"], A: "diag", direct: false, conv: false,
    rows: [["input mixing", "MIMO: one shared state fed by all d<sub>model</sub> channels through a full B, read out through a full C"], ["time variation", "time-invariant"], ["state matrix", "diagonal complex A (HiPPO diagonalised), learned log step size"], ["discretisation", "zoh, bilinear or dirac, chosen by name"], ["how it runs", "parallel associative scan"]],
    cap: "S5 is the MIMO cousin of S4: a single state that every input channel writes into. Because A is diagonal the scan is cheap, and the discretisation is a separate, swappable step." },
  lru: { name: "LRU", mod: "lti", cls: "LRU", kw: "", siso: false, lti: true, discs: ["none"], A: "diag", direct: true, conv: false,
    rows: [["input mixing", "MIMO"], ["time variation", "time-invariant"], ["state matrix", "diagonal complex, parameterised directly in discrete time: λ<sub>n</sub> = exp(−exp ν<sub>n</sub> + i exp θ<sub>n</sub>), initialised on a ring r<sub>min</sub> ≤ |λ| ≤ r<sub>max</sub>"], ["discretisation", "none: there is no continuous-time A to discretise"], ["how it runs", "parallel scan, with a √(1 − |λ|²) input normalisation"]],
    cap: "The LRU skips the ODE story entirely: |λ| < 1 is guaranteed by the exp(−exp ν) form, so the decay slider sets |λ| itself and the step-size slider does nothing. lrnnx is the first public implementation." },
  event: { name: "Event-SSM", mod: "lti", cls: "S5", kw: ', discretization="async"', siso: false, lti: true, discs: ["async"], A: "diag", direct: false, conv: false, async_: true,
    rows: [["input mixing", "MIMO (an S5 state)"], ["time variation", "time-invariant dynamics, irregular time stamps"], ["state matrix", "diagonal complex A"], ["discretisation", "async: each step uses the time gap to the previous event as its own Δ"], ["how it runs", "scan over events, not over a fixed clock"]],
    cap: "For event streams the samples are not evenly spaced. The async scheme feeds the gap between events into the discretisation, so the state decays by the right amount between them. Switch the signal to sparse events to see Δ<sub>k</sub> vary." },
  mamba: { name: "Mamba (S6)", mod: "ltv", cls: "Mamba", kw: "", siso: true, lti: false, discs: ["zoh"], A: "real", direct: false, conv: false,
    rows: [["input mixing", "SISO per channel"], ["time variation", "selective: Δ<sub>k</sub> = softplus(W<sub>Δ</sub> u<sub>k</sub>), B<sub>k</sub> and C<sub>k</sub> are projections of the input"], ["state matrix", "diagonal real A = −exp(a), fixed; only the step and the projections move"], ["discretisation", "ZOH on A, Euler on B, with the input-dependent Δ<sub>k</sub>"], ["how it runs", "fused selective-scan CUDA kernel"]],
    cap: "Mamba's trick is to let the input decide how long each step is: a large input makes Δ<sub>k</sub> big, which writes strongly and forgets fast; a small input barely touches the state. The extra trace shows Δ<sub>k</sub>." },
  stream: { name: "STREAM", mod: "ltv", cls: "Mamba", kw: "", siso: true, lti: false, discs: ["async"], A: "real", direct: false, conv: false, async_: true,
    rows: [["input mixing", "SISO per channel"], ["time variation", "selective, plus event timing"], ["state matrix", "diagonal real A"], ["discretisation", "asymmetric: separate dt<sub>A</sub> and dt<sub>B</sub>, the time gap for decay and the selective Δ<sub>k</sub> for writing"], ["how it runs", "the Mamba kernel with integration time steps passed to forward()"]],
    cap: "STREAM is Mamba for event data: decay follows the real elapsed time while the write strength stays input-selective. In lrnnx it is the same Mamba class with integration time steps passed to the forward call." },
  rglru: { name: "RG-LRU", mod: "ltv", cls: "RGLRU", kw: "", siso: false, lti: false, discs: ["none"], A: "real", direct: true, conv: false,
    rows: [["input mixing", "per-channel diagonal state, Griffin-style"], ["time variation", "gated: a recurrence gate r<sub>k</sub> and an input gate i<sub>k</sub> computed from x<sub>k</sub>"], ["state matrix", "a = σ(a<sub>log</sub>) in (0, 1); per step a<sub>k</sub> = a<sup>c r<sub>k</sub></sup> with c = 8"], ["discretisation", "none"], ["how it runs", "h<sub>k</sub> = a<sub>k</sub> h<sub>k−1</sub> + √(1 − a<sub>k</sub>²) (i<sub>k</sub> ⊙ x<sub>k</sub>), Triton scan"]],
    cap: "RG-LRU is a gated version of the LRU with real decays: the recurrence gate raises a to a power between 0 and c, so the input can choose to remember (a<sub>k</sub> → 1) or reset. The extra trace shows a<sub>k</sub>. First public implementation." },
  s7: { name: "S7", mod: "ltv", cls: "S7", kw: "", siso: false, lti: false, discs: ["none"], A: "diag", direct: true, conv: false,
    rows: [["input mixing", "MIMO"], ["time variation", "selective through an input-dependent gate on the read-out"], ["state matrix", "DPLR-HiPPO initialised, run as a diagonal recurrence"], ["discretisation", "none: directly discrete"], ["how it runs", "scan, then y<sub>k</sub> ← σ(W<sub>g</sub> gelu(y<sub>k</sub>)) ⊙ y<sub>k</sub>"]],
    cap: "S7 simplifies selectivity: the state runs as a plain diagonal recurrence and the input-dependence enters through a gate on what is read out. The extra trace shows the gate. First public implementation." },
  cent: { name: "Centaurus", mod: "lti", cls: "Centaurus", kw: ', discretization="zoh"', siso: false, lti: false, discs: ["zoh"], A: "diag", direct: false, conv: false,
    rows: [["input mixing", "sub-states of size sub_state_dim; the mode (neck, pointwise, depthwise-separable, full) sets how channels mix"], ["time variation", "listed as time-varying in the paper's table"], ["state matrix", "complex diagonal per sub-state, learned log step"], ["discretisation", "ZOH only: the one layer that restricts the choice"], ["how it runs", "scan over the flattened sub-state lanes"]],
    cap: "Centaurus trades one big state for many small sub-states and lets the mode decide how channels talk to each other. It is also the one layer where the discretisation keyword is fixed." },
};
const ORDER = ["s4", "s4d", "s5", "lru", "event", "mamba", "stream", "rglru", "s7", "cent"];
const DISC_LABEL = { zoh: "zoh", bilinear: "bilinear", dirac: "dirac", async: "async (event gaps)", none: "none (directly discrete)", kernel: "inside the kernel" };
const COLS = ["#1772d0", "#4cbf48", "#f09228", "#9b59b6"];

const fmt = (x, d = 2) => (+x).toFixed(d);

function signal(kind) {
  const u = [];
  const gaps = [];
  for (let k = 0; k < L; k++) {
    let v = 0;
    if (kind === "pulse") v = k === 8 ? 1 : 0;
    else if (kind === "step") v = k >= 16 ? 1 : 0;
    else if (kind === "burst") v = k >= 12 && k < 44 ? Math.sin((2 * Math.PI * (k - 12)) / 12) : 0;
    else v = [6, 9, 21, 24, 26, 41, 55].includes(k) ? 1 : 0;
    u.push(v);
  }
  let last = 0;
  for (let k = 0; k < L; k++) {
    if (kind === "events" && u[k]) {
      gaps.push(Math.max(1, k - last));
      last = k;
    } else {
      gaps.push(1);
    }
  }
  return { u, gaps };
}

const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cexp = (z) => {
  const e = Math.exp(z[0]);
  return [e * Math.cos(z[1]), e * Math.sin(z[1])];
};
const cdiv = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};

function discretise(A, dt, scheme) {
  if (scheme === "bilinear") {
    const h = [(A[0] * dt) / 2, (A[1] * dt) / 2];
    return [cdiv([1 + h[0], h[1]], [1 - h[0], -h[1]]), cdiv([dt, 0], [1 - h[0], -h[1]])];
  }
  const Ab = cexp([A[0] * dt, A[1] * dt]);
  if (scheme === "dirac") return [Ab, [1, 0]];
  return [Ab, cdiv([Ab[0] - 1, Ab[1]], A)]; // zoh: (Ā − 1) / A · B with B = 1
}

function run(S) {
  const Ld = LAYERS[S.layer];
  const { u, gaps } = signal(S.sig);
  const X = [];
  const Y = [];
  const extra = [];
  const omega = [0.35, 0.8, 1.4, 2.2];
  const Ac = [];
  for (let n = 0; n < NST; n++) {
    Ac.push(Ld.A === "real" ? [-S.decay * (0.5 + n * 0.6), 0] : [-S.decay, omega[n]]);
  }
  const Cn = [0.9, 0.7, 0.5, 0.35];
  const x = Array.from({ length: NST }, () => [0, 0]);
  for (let k = 0; k < L; k++) {
    const uk = u[k];
    const xs = [];
    let yk = 0;
    let ex = null;
    for (let n = 0; n < NST; n++) {
      let Ab;
      let Bb;
      if (Ld.direct) {
        if (Ld.A === "real") {
          const a = Math.exp(-S.decay * (0.5 + n * 0.6));
          const r = 1 / (1 + Math.exp(-2 * uk));
          const ig = 1 / (1 + Math.exp(-(2 * uk - 0.5)));
          const ak = Math.pow(a, 8 * r);
          Ab = [ak, 0];
          Bb = [Math.sqrt(Math.max(0, 1 - ak * ak)) * ig, 0];
          ex = ak;
        } else {
          const lam = cexp([-S.decay, omega[n]]);
          Ab = lam;
          Bb = [Math.sqrt(Math.max(0, 1 - (lam[0] * lam[0] + lam[1] * lam[1]))), 0];
        }
      } else {
        let dt = S.dt;
        if (Ld.async_) {
          dt = S.dt * gaps[k];
          ex = dt;
        }
        if (S.layer === "mamba" || S.layer === "stream") {
          const sp = Math.log(1 + Math.exp(1 + 2.5 * uk)) / Math.log(1 + Math.exp(1));
          const dtk = S.dt * sp;
          Ab = S.layer === "stream" ? discretise(Ac[n], S.dt * gaps[k], "zoh")[0] : cexp([Ac[n][0] * dtk, 0]);
          Bb = [dtk * (0.5 + 1 / (1 + Math.exp(-2 * uk))), 0];
          ex = dtk;
        } else {
          [Ab, Bb] = discretise(Ac[n], dt, S.disc === "async" ? "zoh" : S.disc);
        }
      }
      x[n] = [
        Ab[0] * x[n][0] - Ab[1] * x[n][1] + Bb[0] * uk,
        Ab[0] * x[n][1] + Ab[1] * x[n][0] + Bb[1] * uk,
      ];
      xs.push(x[n][0]);
      yk += Cn[n] * x[n][0];
    }
    if (S.layer === "s7") {
      const g = 1 / (1 + Math.exp(-3 * (uk - 0.3)));
      ex = g;
      yk *= g;
    }
    X.push(xs);
    Y.push(yk);
    extra.push(ex);
  }
  let K = null;
  if (Ld.conv) {
    K = [];
    const pw = Array.from({ length: NST }, () => [1, 0]);
    for (let k = 0; k < L; k++) {
      let kk = 0;
      for (let n = 0; n < NST; n++) {
        const dd = discretise(Ac[n], S.dt, S.disc === "kernel" ? "zoh" : S.disc);
        if (k > 0) pw[n] = cmul(pw[n], dd[0]);
        kk += Cn[n] * cmul(pw[n], dd[1])[0];
      }
      K.push(kk);
    }
  }
  return { u, X, Y, extra, K };
}

function equations(Ld, disc, layer) {
  if (Ld.direct && Ld.A === "real") {
    return [
      "h<sub>k</sub> = a<sub>k</sub> ⊙ h<sub>k−1</sub> + √(1 − a<sub>k</sub><sup>2</sup>) ⊙ (i<sub>k</sub> ⊙ x<sub>k</sub>)",
      "a<sub>k</sub> = a<sup>c·r<sub>k</sub></sup>,  r<sub>k</sub> = σ(W<sub>r</sub> x<sub>k</sub>),  i<sub>k</sub> = σ(W<sub>i</sub> x<sub>k</sub>)",
      "the gates make the transition depend on the input",
    ];
  }
  if (Ld.direct) {
    return [
      "x<sub>k</sub> = Λ x<sub>k−1</sub> + γ ⊙ B u<sub>k</sub>,  Λ = diag(λ<sub>n</sub>)",
      "y<sub>k</sub> = Re(C x<sub>k</sub>) + D u<sub>k</sub>" + (layer === "s7" ? ",  then × gate(y<sub>k</sub>)" : ""),
      "λ is learned directly in discrete time; nothing is discretised",
    ];
  }
  if (!Ld.lti) {
    return [
      "x<sub>k</sub> = Ā<sub>k</sub> x<sub>k−1</sub> + B̄<sub>k</sub> u<sub>k</sub>,  Ā<sub>k</sub> = exp(Δ<sub>k</sub> A)",
      "y<sub>k</sub> = C<sub>k</sub> x<sub>k</sub> + D u<sub>k</sub>,  Δ<sub>k</sub>, B<sub>k</sub>, C<sub>k</sub> from u<sub>k</sub>",
      "the k on Ā, B̄ and C is the whole difference from the time-invariant layers",
    ];
  }
  return [
    "x<sub>k</sub> = Ā x<sub>k−1</sub> + B̄ u<sub>k</sub>",
    "y<sub>k</sub> = C x<sub>k</sub> + D u<sub>k</sub>" + (Ld.conv ? "  ⇔  y = K ∗ u,  K<sub>k</sub> = C Ā<sup>k</sup> B̄" : ""),
    "(Ā, B̄) = " +
      (disc === "bilinear"
        ? "bilinear(A, B, Δ): Ā = (I − ΔA/2)<sup>−1</sup>(I + ΔA/2)"
        : disc === "dirac"
          ? "dirac(A, B, Δ): Ā = exp(ΔA), B̄ = B"
          : disc === "async"
            ? "zoh with Δ = the gap to the previous event"
            : "zoh(A, B, Δ): Ā = exp(ΔA), B̄ = A<sup>−1</sup>(Ā − I)B"),
  ];
}

const PX0 = 44;
const PX1 = 548;
const px = (k) => PX0 + ((PX1 - PX0) * k) / (L - 1);
const PLOTS = { u: [14, 60], x: [90, 130], y: [236, 70], e: [322, 52] };

function tracePath(id, vals, scale) {
  const [y0, h] = PLOTS[id];
  return vals
    .map((v, k) => {
      const yy = Math.max(y0 + 1, Math.min(y0 + h - 1, y0 + h / 2 - v * scale));
      return `${k ? "L" : "M"}${fmt(px(k), 1)},${fmt(yy, 1)}`;
    })
    .join(" ");
}

function Html({ as = "span", html, ...rest }) {
  const Tag = as;
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}

function LayerPlayground() {
  const [S, setS] = useState({ layer: "s5", disc: "zoh", sig: "pulse", decay: 0.35, dt: 0.5 });
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }));

  function chooseLayer(layer) {
    const Ld = LAYERS[layer];
    set({ layer, disc: Ld.discs[0], ...(Ld.async_ && S.sig !== "events" ? { sig: "events" } : {}) });
  }

  const Ld = LAYERS[S.layer];
  const R = run(S);

  const maxAbs = (arr, floor = 0.01) => arr.reduce((m, v) => Math.max(m, Math.abs(v)), floor);
  const sx = (PLOTS.x[1] / 2 - 4) / maxAbs(R.X.flat());
  const sy = (PLOTS.y[1] / 2 - 4) / maxAbs(R.Y);

  let extraPath = null;
  let elab = "";
  if (R.K) {
    extraPath = tracePath("e", R.K, (PLOTS.e[1] / 2 - 3) / maxAbs(R.K));
    elab = "convolution kernel Kk";
  } else if (R.extra[0] !== null) {
    const me = maxAbs(R.extra);
    extraPath = tracePath("e", R.extra.map((v) => v - me / 2), (PLOTS.e[1] / 2 - 3) / (me / 2));
    elab =
      S.layer === "mamba" || S.layer === "stream"
        ? "selective step Δk"
        : S.layer === "rglru"
          ? "gated decay ak"
          : S.layer === "s7"
            ? "read-out gate gk"
            : "step Δk from event gaps";
  }
  const title =
    `${Ld.name} · ${Ld.siso ? "SISO" : "MIMO"} · ${Ld.lti ? "time-invariant" : "time-varying"} · ` +
    (Ld.direct ? "directly discrete" : `discretisation: ${DISC_LABEL[S.disc]}`) +
    (elab ? ` · red: ${elab}` : "");

  const [e1, e2, e3] = equations(Ld, S.disc, S.layer);
  const call = `${Ld.cls}(d_model, d_state${Ld.async_ && Ld.cls === "Mamba" ? "" : Ld.kw})`;
  const hlt = "rounded-[3px] bg-[#fff1bf] px-[3px] dark:bg-amber-900/50";

  const selectCls =
    "max-w-[150px] rounded border border-zinc-300 bg-white px-1 py-0.5 text-[12.5px] text-zinc-800 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200";
  const panel = "overflow-x-auto border-y-2 border-zinc-700 px-3.5 pb-3 pt-2.5 dark:border-zinc-400";
  const panelTitle = "mb-2 border-b border-zinc-700 pb-1 font-bold dark:border-zinc-400";

  return (
    <div className="layer-playground mt-6 xl:ml-[calc(50%-520px)] xl:w-[1040px]">
      <div className="grid gap-x-6 gap-y-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="min-w-0">
          <svg
            viewBox="0 0 560 412"
            role="img"
            aria-label="A linear RNN layer running on a test signal: input, four state traces, output"
            className="block h-auto w-full rounded-lg border border-zinc-200 bg-[#fafaf8] dark:border-zinc-800"
          >
            {Object.entries(PLOTS).map(([id, [y0, h]]) => (
              <g key={id} opacity={id === "e" && !elab ? 0.25 : 1}>
                <rect x={PX0} y={y0} width={PX1 - PX0} height={h} fill="#fff" stroke="#e3e3de" />
                <line x1={PX0} y1={y0 + h / 2} x2={PX1} y2={y0 + h / 2} stroke="#eee" />
                {id !== "e" && (
                  <text x={6} y={y0 + h / 2} dominantBaseline="central" className="lp-lbl">
                    {id}
                    <tspan fontSize="8" dy="3">
                      k
                    </tspan>
                  </text>
                )}
              </g>
            ))}
            {R.u.map((v, k) =>
              v !== 0 ? (
                <line
                  key={k}
                  x1={px(k)}
                  y1={PLOTS.u[0] + PLOTS.u[1] / 2}
                  x2={px(k)}
                  y2={PLOTS.u[0] + PLOTS.u[1] / 2 - v * 24}
                  stroke="#333"
                  strokeWidth="2"
                />
              ) : null
            )}
            {COLS.map((col, n) => (
              <path key={n} d={tracePath("x", R.X.map((xs) => xs[n]), sx)} fill="none" stroke={col} strokeWidth="1.8" />
            ))}
            <path d={tracePath("y", R.Y, sy)} fill="none" stroke="#222" strokeWidth="2" />
            {extraPath && <path d={extraPath} fill="none" stroke="#e5322d" strokeWidth="1.8" />}
            <text x={PX0} y={384} dominantBaseline="central" className="lp-stat">
              {title}
            </text>
            <text x={PX0} y={400} dominantBaseline="central" className="lp-lbl">
              state traces: Re x
              <tspan fontSize="8" dy="3">
                k
              </tspan>
              <tspan dy="-3">, one colour per state dimension</tspan>
            </text>
          </svg>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-zinc-600 dark:text-zinc-400">
            <label className="inline-flex items-center gap-1.5">
              layer
              <select value={S.layer} onChange={(e) => chooseLayer(e.target.value)} className={selectCls}>
                {ORDER.map((k) => (
                  <option key={k} value={k}>
                    {LAYERS[k].name}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5">
              discretisation
              <select
                value={S.disc}
                disabled={Ld.discs.length < 2}
                onChange={(e) => set({ disc: e.target.value })}
                className={selectCls}
              >
                {Ld.discs.map((d) => (
                  <option key={d} value={d}>
                    {DISC_LABEL[d]}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5">
              signal
              <select value={S.sig} onChange={(e) => set({ sig: e.target.value })} className={selectCls}>
                <option value="pulse">pulse</option>
                <option value="step">step</option>
                <option value="burst">sine burst</option>
                <option value="events">sparse events</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5">
              decay
              <input
                type="range"
                min="0.02"
                max="1.5"
                step="0.02"
                value={S.decay}
                onChange={(e) => set({ decay: +e.target.value })}
                className="w-[90px] accent-blue-700"
              />
              <span className="min-w-[2.5em] tabular-nums text-zinc-800 dark:text-zinc-200">{fmt(S.decay)}</span>
            </label>
            <label className={`inline-flex items-center gap-1.5 ${Ld.direct ? "opacity-40" : ""}`}>
              step Δ
              <input
                type="range"
                min="0.05"
                max="1.5"
                step="0.05"
                value={S.dt}
                disabled={Ld.direct}
                onChange={(e) => set({ dt: +e.target.value })}
                className="w-[90px] accent-blue-700"
              />
              <span className="min-w-[2.5em] tabular-nums text-zinc-800 dark:text-zinc-200">{fmt(S.dt)}</span>
            </label>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <b>{Ld.name}.</b> <Html html={Ld.cap} />
          </p>
        </div>

        <div className="min-w-0 space-y-4 text-[13.5px] leading-[1.7] text-zinc-800 dark:text-zinc-200">
          <div className={panel}>
            <p className={panelTitle}>{Ld.name}: what defines it</p>
            {Ld.rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[108px_minmax(0,1fr)] gap-2.5 py-[3px] text-[13px] leading-snug">
                <span className="pt-px text-right text-xs text-zinc-500 dark:text-zinc-400">{k}</span>
                <Html html={v} className="text-zinc-900 dark:text-zinc-100" />
              </div>
            ))}
          </div>
          <div className={panel}>
            <p className={panelTitle}>The recurrence it runs</p>
            <Html as="div" html={e1} className="leading-relaxed" />
            <Html as="div" html={e2} className="leading-relaxed" />
            <Html as="div" html={e3} className="text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className={panel}>
            <p className={panelTitle}>The same call, whichever layer</p>
            <pre className="whitespace-pre-wrap pt-1 font-mono text-[12.5px] leading-[1.55]">
              from lrnnx.models.<span className={hlt}>{Ld.mod}</span> import <span className={hlt}>{Ld.cls}</span>
              {"\n\n"}layer = <span className={hlt}>{call}</span>.cuda(){"\n"}y = layer(x
              {Ld.async_ && (
                <>
                  , <span className={hlt}>integration_timesteps=gaps</span>
                </>
              )}
              ){"   "}# x: (batch, seq_len, d_model)
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayerPlayground;
