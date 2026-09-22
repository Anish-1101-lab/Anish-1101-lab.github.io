import dropMeansMoE from "../assets/bypassing/drop-means-moe.png";
import heatmapDialoGPT from "../assets/bypassing/heatmap-dialogpt.png";
import heatmapMoE from "../assets/bypassing/heatmap-moe.png";
import heatmapPhi4 from "../assets/bypassing/heatmap-phi4.png";
import heatmapPhi4MiniReasoning from "../assets/bypassing/heatmap-phi4-mini-reasoning.png";
import heatmapQwen06B from "../assets/bypassing/heatmap-qwen-0.6b.png";
import meanDeltasBar from "../assets/bypassing/mean-deltas-bar.png";
import riskDeltaHist from "../assets/bypassing/risk-delta-hist.png";
import lrnnxBenchmarksMain from "../assets/lrnnx/benchmarks-main.png";
import lrnnxClassDiagram from "../assets/lrnnx/class-diagram.png";
import lrnnxLruInference from "../assets/lrnnx/lru-inference.png";
import lrnnxLruTraining from "../assets/lrnnx/lru-training.png";
import lrnnxMambaInference from "../assets/lrnnx/mamba-inference.png";
import lrnnxMambaTraining from "../assets/lrnnx/mamba-training.png";
import lrnnxS5Inference from "../assets/lrnnx/s5-inference.png";
import lrnnxS5Training from "../assets/lrnnx/s5-training.png";
import attribPipelineFig from "../assets/attrib/ltta_pipeline.png";
import attribRightWrongTsne from "../assets/attrib/right-wrong-tsne.png";
import attribSweepCls from "../assets/attrib/sweep-cls.png";
import attribSweepIou from "../assets/attrib/sweep-iou.png";
import medullaArchitecture from "../assets/medulla/architecture.png";
import medullaDarshanModules from "../assets/medulla/darshan-modules.png";
import medullaFinalResults from "../assets/medulla/final-results.png";
import medullaIoTimeCdf from "../assets/medulla/io-time-cdf.png";
import medullaIoVolumePerDay from "../assets/medulla/io-volume-per-day.png";
import medullaRedundantReads from "../assets/medulla/redundant-reads.png";
import quantisationBenchmarkBattery from "../assets/quantisation/benchmark-battery.png";
import quantisationBootstrapCis from "../assets/quantisation/bootstrap-cis.png";
import quantisationNewModelsScale from "../assets/quantisation/new-models-scale.png";
import quantisationPareto from "../assets/quantisation/pareto-real-quantizers.png";
import quantisationSignDial from "../assets/quantisation/sign-randomization-dial.png";

// Full write-ups for the projects that get a dedicated page, in the same
// shape for every project: a meta header (title/authors/venue/links/summary)
// plus a body of typed blocks rendered by ProjectPage.
export const projects = {
  lrnnx: {
    title: "lrnnx: A Library for Linear RNNs",
    authors:
      "Karan Bania*, Soham Kalburgi*, Manit Tanwar*, Dhruthi*, Aditya Nagarsekar*, Harshvardhan Mestha*, Naman Chibber*, Raj Deshmukh*, Anish Sathyanarayanan*, Aarush Rathore*, Pratham Chheda*",
    accepted: true,
    venue:
      "[Student Research Workshop](https://2026.eacl.org/calls/srw/) @ [EACL 2026](https://2026.eacl.org/) · * equal contribution",
    summary:
      "A unified PyTorch library for linear recurrent and state-space models, with one interface, shared discretisations and custom CUDA kernels.",
    links: [
      { label: "paper", href: "https://aclanthology.org/2026.eacl-srw.60.pdf" },
      { label: "arXiv", href: "https://arxiv.org/abs/2602.08810" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/17907yJUrdPwrZFEXxcUU_sisGab2Glzz/view",
      },
      { label: "code", href: "https://github.com/SforAiDl/lrnnx" },
    ],
    body: [
      {
        type: "p",
        text: "lrnnx is a PyTorch library that consolidates the main linear recurrent neural network (LRNN) architectures, from S4 and S5 to Mamba, RG-LRU and Centaurus, behind one consistent interface. Switching the state-space parameterisation or the discretisation scheme means instantiating a different class, with no change to the surrounding code.",
      },
      {
        type: "quote",
        text: "We address these challenges by introducing lrnnx, a unified library designed to make working with LRNNs comparable to working with standard neural network layers.",
      },
      { type: "h2", text: "Linear RNN in two equations" },
      {
        type: "p",
        text: "A conventional RNN passes its state through non-linearities $\\alpha$ and $\\beta$. That is where its expressive power comes from, and also its vanishing and exploding gradients and its strictly sequential training:",
      },
      {
        type: "eq",
        tex: "x_k = \\alpha\\big(W_{xx}\\, x_{k-1} + W_{xu}\\, u_k\\big), \\qquad y_k = \\beta\\big(W_{yx}\\, x_k\\big).",
      },
      {
        type: "p",
        text: "A linear RNN keeps the state and drops the non-linearity, controlling stability through how $A$, $B$ and $C$ are parameterised and discretised instead. That buys parallel training and $\\mathcal{O}(1)$ inference, against $\\mathcal{O}(n)$ for a Transformer, which is also hard to train beyond length $2^{10}$:",
      },
      {
        type: "eq",
        tex: "x_k = A(k)\\, x_{k-1} + B(k)\\, u_k, \\qquad y_k = C(k)\\, x_k + D(k)\\, u_k.",
      },
      {
        type: "p",
        text: "Hold $A$, $B$, $C$ fixed across steps and the layer is linear time-invariant; let them vary with $k$ and it is time-varying. Most layers come in both forms.",
      },
      {
        type: "table",
        headers: ["Linear time-invariant", "Linear time-varying"],
        rows: [["S4 (SISO), S5 (MIMO), LRU, Event-SSM", "S6 / Mamba, S7, RG-LRU, STREAM, Centaurus"]],
      },
      {
        type: "p",
        text: "These layers hold records on the Long Range Arena and carry an inductive bias for signal data, so they suit audio, sensor streams, vision, event streams, speech and RNA.",
      },
      { type: "h2", text: "Why it exists" },
      {
        type: "list",
        items: [
          "Implementations are scattered across PyTorch and JAX, lean on framework-specific optimisations, and sometimes need custom CUDA kernels or unpublished tricks to hit their reported runtimes.",
          "The LRU, RG-LRU and S7 had no public implementation at all.",
          "So comparing two similar models can mean switching frameworks, rebuilding data pipelines, or reimplementing a model from scratch.",
        ],
      },
      { type: "h2", text: "Using it" },
      {
        type: "p",
        text: "Every layer takes the same constructor, a model dimension and a state dimension, and is called like any other module. LTI and LTV layers are interchangeable:",
      },
      {
        type: "code",
        text: `from lrnnx.models.lti import LRU
from lrnnx.models.ltv import Mamba

model_lti = LRU(d_model, d_state).cuda()
x = torch.randn(batch_size, seq_len, d_model, dtype=torch.float32, device="cuda")
output = model_lti(x)

model_ltv = Mamba(d_model, d_state).cuda()
output = model_ltv(x)`,
      },
      {
        type: "p",
        text: "A language model wraps an LRNN backbone with embeddings, residual blocks and an LM head. Its `mixer_types` argument mixes different recurrences and attention in one stack, as Griffin does:",
      },
      {
        type: "code",
        text: `from lrnnx.models.language_model import LRNNLMHeadModel

model = LRNNLMHeadModel(
    d_model, d_state, num_layers, vocab_size, mixer_types=["s5", "s6", "attn"]
)
input_ids = torch.randint(0, vocab_size, (batch_size, seq_len))
logits = model(input_ids)`,
      },
      {
        type: "p",
        text: "Each model exposes three levels of API: a parallel scan, a recurrent `step` for autoregressive generation, and the full layer from its paper. Tutorials cover a U-Net for audio denoising and a hierarchical classifier.",
      },
      { type: "h2", text: "How it is built" },
      {
        type: "figure",
        src: lrnnxClassDiagram,
        alt: "Class diagram of lrnnx: an abstract LRNN base class, LTI_LRNN and LTV_LRNN below it, and the concrete layers under each branch",
        caption:
          "Three tiers. An abstract LRNN base class holds the discretisation and the forward interface. LTI_LRNN and LTV_LRNN sit below it and add the two kinds of recurrence, and each concrete layer defines only its own parameterisation of $(A, B, C)$.",
      },
      {
        type: "list",
        items: [
          "**Discretisation is decoupled from the layer.** ZOH, bilinear, dirac and asynchronous event-driven schemes, picked by name in the constructor, with custom schemes addable. Centaurus is the one layer that restricts the choice, to ZOH.",
          "**Custom CUDA kernels for the LTV layers**, derived from Mamba's selective scan: a fused scan and output projection that avoids the hidden-state materialisation that bottlenecks some JAX implementations.",
          "**CUDA Graphs inference.** PyTorch has no `jax.lax.scan`, so lrnnx follows Mamba and uses CUDA Graphs to drop the per-step CPU synchronisation, which the README puts at more than ten times faster than a Python loop.",
          "**A test suite** that checks parallel, recurrent and step-wise execution agree numerically for every layer across sequence lengths, batch sizes, model dimensions, initialisations and discretisations, and that the CUDA kernels match reference PyTorch gradients.",
          "MIT licensed, on PyPI, with checkpointing, mixed precision and fused operations throughout.",
        ],
      },
      { type: "h2", text: "Supported architectures" },
      {
        type: "table",
        headers: ["Layer", "Paper", "SISO", "LTI", "Public implementation", "Framework"],
        rows: [
          ["S4", "Gu et al., 2022", "✓", "✓", "✓", "PyTorch"],
          ["S5", "Smith et al., 2023", "✗", "✓", "✓", "JAX"],
          ["LRU", "Orvieto et al., 2023", "✗", "✓", "✗", "N/A"],
          ["Event-SSM", "Schöne et al., 2024", "✗", "✓", "✓", "JAX"],
          ["S6 (Mamba)", "Gu and Dao, 2024", "✓", "✗", "✓", "PyTorch"],
          ["STREAM", "Schöne et al., 2024", "✓", "✗", "✓", "PyTorch"],
          ["RG-LRU", "De et al., 2024", "✗", "✗", "✗", "N/A"],
          ["S7", "Soydan et al., 2024", "✗", "✗", "✗", "N/A"],
          ["Centaurus", "Pei, 2025", "✗", "✗", "✓", "PyTorch"],
        ],
      },
      {
        type: "callout",
        text: "Contemporary SSM layers, all implemented in lrnnx, and the state of their public code before it. SISO is single-input single-output; LTI is linear time invariant.",
      },
      { type: "h3", text: "Try the layers" },
      {
        type: "p",
        text: "Pick a layer and the same tiny instance runs live in your browser: four state dimensions, a 64-step test signal, one shared interface. What changes between layers is written out on the right; the code changes only the import path, the class name and the discretisation keyword.",
      },
      { type: "layers" },
      { type: "h2", text: "Speed" },
      {
        type: "p",
        text: "Forward plus backward, on an A100 40GB with Python 3.12 and CUDA 12.9, at sequence lengths 256 and 2048: lrnnx matches or trails the JAX/reference implementation depending on the layer and length (below).",
      },
      {
        type: "figure",
        src: lrnnxBenchmarksMain,
        alt: "Bar chart of mean training time for LRU, S5 and Mamba at sequence lengths 256 and 2048, lrnnx versus the JAX or reference implementation",
        caption:
          "Mean training time, forward plus backward, on an A100 40GB with Python 3.12 and CUDA 12.9. Orange is lrnnx, blue the JAX or reference implementation, green the lrnnx LTV implementation of S5.",
      },
      {
        type: "table",
        headers: ["Sequence length", "Implementation", "LRU", "S5", "Mamba"],
        rows: [
          ["256", "lrnnx", "2.08", "2.46", "1.89"],
          ["256", "lrnnx LTV (S5 only)", "—", "1.66", "—"],
          ["256", "JAX / reference", "0.61", "0.47", "1.89"],
          ["2048", "lrnnx", "2.28", "2.63", "10.73"],
          ["2048", "lrnnx LTV (S5 only)", "—", "3.06", "—"],
          ["2048", "JAX / reference", "1.47", "1.26", "10.73"],
        ],
      },
      {
        type: "callout",
        text: "Milliseconds; state dimension 16, five experiments of 90 timed passes each. LRU is compared against a public JAX repository, S5 against the original JAX release, Mamba against the official one.",
      },
      {
        type: "p",
        text: "**Training.** Mamba matches the official kernels at both lengths, and the gap to JAX on LRU and S5 narrows as sequences grow. Across the full sweeps the lrnnx curves stay almost flat in batch size, model dimension and sequence length while the JAX curves rise with all three.",
      },
      {
        type: "figrow",
        images: [
          { src: lrnnxLruTraining, alt: "LRU training benchmarks: mean time versus batch size, model dimension, and sequence length, JAX versus PyTorch (lrnnx), log axes" },
          { src: lrnnxS5Training, alt: "S5 training benchmarks: mean time versus batch size, model dimension, and sequence length, JAX versus PyTorch (lrnnx), log axes" },
          { src: lrnnxMambaTraining, alt: "Mamba training benchmarks: mean time versus batch size, model dimension, and sequence length, JAX versus PyTorch (lrnnx), log axes" },
        ],
        caption:
          "Training time against batch size, model dimension and sequence length, log axes, mean ± min/max. lrnnx curves stay nearly flat across all three sweeps; the JAX/reference curves rise with each.",
      },
      {
        type: "p",
        text: "**Inference.** Slightly slower than the public implementations, which the paper attributes to known PyTorch CPU overheads rather than to the models, and expects to even out at high batch sizes and long sequences.",
      },
      {
        type: "figrow",
        images: [
          { src: lrnnxLruInference, alt: "LRU inference benchmarks: mean time versus batch size, model dimension, and sequence length, JAX versus PyTorch (lrnnx), log axes" },
          { src: lrnnxS5Inference, alt: "S5 inference benchmarks: mean time versus batch size, model dimension, and sequence length, JAX versus PyTorch (lrnnx), log axes" },
          { src: lrnnxMambaInference, alt: "Mamba inference benchmarks: mean time versus batch size, model dimension, and sequence length, JAX versus PyTorch (lrnnx), log axes" },
        ],
        caption:
          "Inference time against the same three sweeps. lrnnx trails the public implementations here, which the paper attributes to known PyTorch CPU overheads rather than to the models themselves.",
      },
      { type: "h2", text: "Limitations" },
      {
        type: "list",
        items: [
          "PyTorch only, so not directly usable from JAX or TensorFlow.",
          "Peak performance on several LTV layers needs the custom CUDA kernels, so it is tied to NVIDIA hardware.",
          "Inference is slightly slower than the public implementations.",
          "No native Hugging Face, DeepSpeed or FSDP wrappers, so distributed workflows need adapters.",
          "No bidirectional variants yet, though the interface is designed for them. Non-linear recurrent models such as xLSTM are out of scope.",
        ],
      },
    ],
    publication:
      "Karan Bania*, Soham Kalburgi*, Manit Tanwar*, Dhruthi*, Aditya Nagarsekar*, Harshvardhan Mestha*, Naman Chibber*, Raj Deshmukh*, Anish Sathyanarayanan*, Aarush Rathore*, Pratham Chheda*. *lrnnx: A library for Linear RNNs.* Student Research Workshop at EACL 2026. [ACL Anthology](https://aclanthology.org/2026.eacl-srw.60.pdf) · [arXiv:2602.08810](https://arxiv.org/abs/2602.08810) · [poster](https://drive.google.com/file/d/17907yJUrdPwrZFEXxcUU_sisGab2Glzz/view).",
    bibtex: `@inproceedings{bania-etal-2026-lrnnx,
    title = "lrnnx: A library for Linear {RNN}s",
    author = "Bania, Karan  and
      Kalburgi, Soham  and
      Tanwar, Manit  and
      Dhruthi  and
      Nagarsekar, Aditya  and
      Mestha, Harshvardhan  and
      Chibber, Naman  and
      Deshmukh, Raj  and
      Sathyanarayanan, Anish  and
      Rathore, Aarush  and
      Chheda, Pratham",
    booktitle = "Proceedings of the 19th Conference of the European Chapter of the Association for Computational Linguistics (Volume 4: Student Research Workshop)",
    month = mar,
    year = "2026",
    address = "Rabat, Morocco",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2026.eacl-srw.60/",
    doi = "10.18653/v1/2026.eacl-srw.60",
    pages = "811--817",
    ISBN = "979-8-89176-383-8"
}`,
    code: "The library is on GitHub under an MIT licence: [SforAiDl/lrnnx](https://github.com/SforAiDl/lrnnx).",
    contributors:
      "Karan Bania*, Soham Kalburgi*, Manit Tanwar*, Dhruthi*, Aditya Nagarsekar*, Harshvardhan Mestha*, Naman Chibber*, Raj Deshmukh*, Anish Sathyanarayanan*, Aarush Rathore* and Pratham Chheda*, members of the [Society for Artificial Intelligence and Deep Learning (SAiDL)](https://www.saidl.in/), BITS Pilani, Goa.",
  },

  "bypassing-the-rationale": {
    title: "Bypassing the Rationale: Causal Auditing of Implicit Reasoning in Language Models",
    authors: "Anish Sathyanarayanan*, Aditya Nagarsekar*, Aarush Rathore*",
    accepted: true,
    venue:
      "[LIT Workshop](https://latent-implicit-thinking.github.io/) @ [ICLR 2026](https://iclr.cc/) · Abstract at the [AIMII Workshop](https://aimii.info/) @ [IASEAI 2026](https://www.iaseai.org/) · * equal contribution",
    summary:
      "A causal, layer-wise audit of how much a language model's answer actually depends on its chain of thought, and how often it does not.",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2602.03994" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/1IOYuZhrG7g2ysbOmlx4-BP_6Ukhkg9Cn/view?usp=sharing",
      },
      { label: "code", href: "https://github.com/Anish-1101-lab/cot-manipulation-monitor" },
    ],
    body: [
      {
        type: "p",
        text: "This paper patches a language model's hidden states at its chain-of-thought (CoT) tokens, layer by layer, and measures how much the answer actually depended on them, net of a matched placebo patch. Across Phi, Qwen and DialoGPT models that CoT-specific influence is confined to narrow bands of layers, does not grow with scale, and is often zero even when the written rationale is perfectly plausible.",
      },
      {
        type: "quote",
        text: "Behavioral gains under CoT do not imply that the model's internal computation causally depends on the emitted reasoning text, i.e. models may produce fluent rationales while routing decision-critical computation through latent pathways.",
      },
      { type: "h2", text: "The audit in three equations" },
      {
        type: "p",
        text: "**CoT drop.** Overwrite the With-CoT run $x_c$ at its CoT token positions $\\mathcal{C}$, at one layer $\\ell$, with the hidden states of the No-CoT run $x_{\\neg c}$, and record how much log-probability the reference answer $y$ loses:",
      },
      {
        type: "eq",
        tex: "\\Delta_{\\mathrm{cot},\\ell} = \\max\\left(0,\\ \\log P(y \\mid x_c) - \\log P\\bigl(y \\mid \\mathrm{patch}_{\\mathcal{C}}(x_c, x_{\\neg c})\\bigr)\\right).",
      },
      {
        type: "p",
        text: "**Control drop.** The identical patch on a same-size random set $\\mathcal{N}$ of non-CoT positions, averaged over 8 draws, measures how much any patch at that layer hurts:",
      },
      {
        type: "eq",
        tex: "\\Delta_{\\mathrm{ctrl},\\ell} = \\max\\left(0,\\ \\log P(y \\mid x_c) - \\log P\\bigl(y \\mid \\mathrm{patch}_{\\mathcal{N}}(x_c, x_{\\neg c})\\bigr)\\right).",
      },
      {
        type: "p",
        text: "**CoT Mediation Index.** CMI keeps only the excess of the CoT drop over the control drop, floored ($\\tau_{\\mathrm{drop}} = 10^{-4}$, $\\tau_{\\mathrm{den}} = 10^{-3}$) and normalised into $[0,1]$, and Bypass is $1 - \\mathrm{CMI}_\\ell$:",
      },
      {
        type: "eq",
        tex: "\\mathrm{CMI}_\\ell = \\begin{cases} 0, & \\Delta_{\\mathrm{cot},\\ell} + \\Delta_{\\mathrm{ctrl},\\ell} < \\tau_{\\mathrm{drop}}, \\\\ \\dfrac{\\max\\bigl(0,\\ \\Delta_{\\mathrm{cot},\\ell} - \\Delta_{\\mathrm{ctrl},\\ell}\\bigr)}{\\max\\bigl(\\Delta_{\\mathrm{cot},\\ell} + \\Delta_{\\mathrm{ctrl},\\ell},\\ \\tau_{\\mathrm{den}}\\bigr)}, & \\text{otherwise.} \\end{cases}",
      },
      {
        type: "p",
        text: "Try it yourself below on a mock model: pick a layer, patch the rationale positions, then patch a random control set, and the two drops and CMI fall out. The numbers of the mock model are illustrative; the profiles underneath are the real ones from the paper.",
      },
      { type: "patching" },
      {
        type: "p",
        text: "Two robustness checks share the same framework: a placebo patch that replaces the CoT states with random noise instead of No-CoT activations, and a boundary-sensitivity check that grows or shrinks the CoT span by one token on each side.",
      },
      { type: "h2", text: "Reading the heatmaps" },
      {
        type: "p",
        text: "Across the first 20 StrategyQA prompts, layer-by-layer CMI traces out what the paper calls routing regimes: sharply localised peaks in a few layers for some models, moderate CMI spread over many layers for others.",
      },
      {
        type: "p",
        text: "**Mediation is depth-localised, and where the window sits depends on the architecture.**",
      },
      {
        type: "figrow",
        images: [
          { src: heatmapDialoGPT, alt: "Layerwise CMI heatmap for DialoGPT-large over 20 StrategyQA prompts, with nonzero cells only in layers 0 to 2" },
          { src: heatmapQwen06B, alt: "Layerwise CMI heatmap for Qwen3-0.6B over 20 StrategyQA prompts, with nonzero cells only in layers 29 to 31" },
        ],
        caption:
          "DialoGPT-large (left, 36 layers) follows CoT in layers 0 to 2; Qwen3-0.6B (right, 32 layers) does so in layers 29 to 31. Rows are StrategyQA prompts (labelled by qid), columns are layers, color is CMI.",
      },
      { type: "p", text: "**Training for reasoning beats scale.**" },
      {
        type: "figrow",
        images: [
          { src: heatmapPhi4, alt: "Layerwise CMI heatmap for phi-4 over 20 StrategyQA prompts, showing only a handful of nonzero cells" },
          { src: heatmapPhi4MiniReasoning, alt: "Layerwise CMI heatmap for Phi-4-mini-reasoning over 20 StrategyQA prompts, showing a structured band of nonzero cells in the later layers" },
        ],
        caption:
          "phi-4 (left, 40 layers; mean CMI 0.0065, 0.75% of layers active) is nearly four times the size of Phi-4-mini-reasoning (right, 32 layers; mean CMI 0.0820, 12.66% active), which is trained specifically for reasoning.",
      },
      { type: "p", text: "**Mixture-of-Experts models spread mediation across depth.**" },
      {
        type: "figrow",
        images: [
          { src: dropMeansMoE, alt: "Mean CoT drop and mean control drop per layer for Phi-mini-MoE-instruct on StrategyQA" },
          { src: heatmapMoE, alt: "Layerwise CMI heatmap for Phi-mini-MoE-instruct over 20 StrategyQA prompts, with nonzero cells scattered across the full depth" },
        ],
        caption:
          "Phi-mini-MoE-instruct: mean CoT drop against control drop per layer (left), and the CMI heatmap (right). Mean CMI 0.1230 with every layer active; the paper attributes the spread to computation routed through different experts at different depths.",
      },
      { type: "h2", text: "All eleven models" },
      {
        type: "table",
        headers: ["Model", "Mean CMI", "Layers", "CMI-active layers", "% Active Layers"],
        rows: [
          ["Phi-mini-MoE-instruct", "**0.1230**", "32", "[0, 31]", "**27.03%**"],
          [
            "Phi-4-mini-reasoning",
            "**0.0820**",
            "32",
            "1, 2, 4, 8, 10, 12, [14, 16], [21, 31]",
            "**12.66%**",
          ],
          ["Qwen3-1.7B", "0.0555", "28", "[0, 8], 26, 27", "8.21%"],
          ["Phi-3.5-mini-instruct", "0.0452", "36", "[2, 6], [8, 14], [25, 29], [33, 35]", "5.14%"],
          ["phi-2", "0.0107", "32", "[29, 31]", "2.66%"],
          ["Qwen3-0.6B", "0.0107", "32", "[29, 31]", "2.66%"],
          ["DialoGPT-large", "0.0137", "36", "[0, 2]", "1.94%"],
          ["phi-1_5", "0.0092", "24", "21, 22", "1.25%"],
          ["phi-4", "0.0065", "40", "[3, 5], 38", "0.75%"],
          ["Qwen3-8B", "0.0014", "36", "33", "0.14%"],
          ["Qwen3-4B", "**0.0000**", "36", "none", "**0.00%**"],
        ],
      },
      {
        type: "callout",
        text: "StrategyQA, 20 prompts. A layer is active if its prompt-averaged CMI is above zero. Faithfulness is not monotonic in scale: across Qwen3 the mean CMI runs 0.0107, 0.0555, 0.0000, 0.0014 from 0.6B to 8B.",
      },
      { type: "h2", text: "Beyond StrategyQA" },
      {
        type: "p",
        text: "The same audit on GSM8K (DialoGPT-large) finds a mix of pure-bypass, high-CMI and partial-mediation instances even though every answer is correct: CMI runs from 0.000 on five instances up to 0.868, with the multi-step problems at the high end. TruthfulQA is a near-total bypass regime: 17 of 20 instance-answer pairs have CMI of exactly 0.0000 and the largest value anywhere is 0.0092, so the written CoT does not override the misconception.",
      },
      { type: "h2", text: "A behavioral monitor is not enough" },
      {
        type: "p",
        text: "A separate check asks whether simply telling a model its CoT will be audited changes what that CoT looks like. Prompting it as audit-aware, rather than with a normal instruction, and scoring the resulting rationales for manipulation-signal features (excess hedging, off-topic drift, misalignment language, compressibility) shows the behavioral surface shifting even though the causal audit above measures something the text can't reveal.",
      },
      {
        type: "figrow",
        images: [
          { src: meanDeltasBar, alt: "Mean change in behavioral risk metrics under audit-aware prompting versus normal prompting, on a log scale" },
          { src: riskDeltaHist, alt: "Distribution of per-prompt risk-score deltas between audit-aware and normal prompting, showing a right-tailed skew" },
        ],
        caption:
          "Audit-aware prompting increases manipulation-signal features on average (left) and yields a right-tailed distribution of risk-score deltas across prompts (right). The paper treats these scores as uncalibrated heuristics, not a substitute for causal patching.",
      },
      { type: "h2", text: "Take-aways" },
      {
        type: "list",
        items: [
          "**Behaviour can mislead.** CoT faithfulness varies across models and tasks and cannot be inferred from accuracy alone; a causal, layerwise audit tells when CoT is mechanistically meaningful and when it is post-hoc.",
          "**Mediation is localised and architectural.** When CoT matters, its influence sits in a narrow band of layers whose position depends on the model, not just its size.",
          "**Bigger is not more faithful.** Reasoning-tuned models show stronger, more structured mediation than larger untuned ones, and Mixture-of-Experts models show distributed mediation consistent with routing-based computation.",
          "**Thinking in text versus thinking in latent space.** In bypass regimes the model writes a fluent rationale, gets the answer right, and does not route through it — reasoning in latent representations, with CoT an imperfect summary rather than the computational pathway.",
          "**Text-only monitors cannot see this.** A behavioural monitor scores how a rationale reads, not whether the answer depended on it; its scores are uncalibrated heuristics.",
          "**Limits.** Patching can add distribution shift that the controls may not fully remove; the runs are small (20 StrategyQA prompts, 10 TruthfulQA questions, 20 GSM8K instances); and low CMI means reasoning that is not text-aligned, not an absence of reasoning.",
        ],
      },
    ],
    publication:
      "Anish Sathyanarayanan*, Aditya Nagarsekar*, Aarush Rathore*. *Bypassing the Rationale: Causal Auditing of Implicit Reasoning in Language Models.* [arXiv:2602.03994](https://arxiv.org/abs/2602.03994), 2026. Accepted at the Latent and Implicit Thinking Workshop at ICLR 2026; abstract accepted at the AIMII Workshop at IASEAI 2026 ([poster](https://drive.google.com/file/d/1IOYuZhrG7g2ysbOmlx4-BP_6Ukhkg9Cn/view?usp=sharing)).",
    bibtex: `@misc{sathyanarayanan2026bypassingrationalecausalauditing,
      title={Bypassing the Rationale: Causal Auditing of Implicit Reasoning in Language Models},
      author={Anish Sathyanarayanan and Aditya Nagarsekar and Aarush Rathore},
      year={2026},
      eprint={2602.03994},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/2602.03994},
}`,
    code: "The audit code is on GitHub: [Anish-1101-lab/cot-manipulation-monitor](https://github.com/Anish-1101-lab/cot-manipulation-monitor).",
    contributors:
      "Anish Sathyanarayanan*, Aditya Nagarsekar* and Aarush Rathore*, BITS Pilani, Goa.",
  },

  "one-score-not-enough": {
    title: "One Score Is Not Enough: Task Entanglement in Multi-Task Data Attribution",
    authors: [
      { name: "Anish Sathyanarayanan", sup: 1 },
      {
        name: "Louis Bonneau de Beaufort",
        href: "https://scholar.google.com/citations?hl=en&user=pJSwVEoAAAAJ",
        sup: 2,
      },
      {
        name: "Jose Oramas",
        href: "https://scholar.google.com/citations?user=FurBYlUAAAAJ&hl=en",
        sup: 3,
      },
      { name: "Luis Galárraga", href: "https://luisgalarraga.de", sup: 4 },
    ],
    affiliations:
      "¹ Birla Institute of Technology and Science, Pilani · ² IRISA, Université Bretagne Sud · ³ Interuniversity Microelectronics Centre (imec) · ⁴ Inria",
    venue: "Under review @ ATTRIB Workshop, NeurIPS 2026",
    summary:
      "In multi-task object detectors, a single attribution score can hide which task a training example actually supports — two methods recover the per-task signal, and which one wins depends on the detector's routing topology.",
    teaser: {
      src: attribPipelineFig,
      alt: "LTTA schematic: shared-backbone gradients are encoded into a sparse dictionary, atoms receive a task-preference score, and a soft mask produces separate classification and box attribution scores",
    },
    links: [
      { label: "workshop", href: "https://attrib-workshop.cc/" },
      {
        label: "paper",
        href: "https://drive.google.com/file/d/15mL_n0Jzbhj4FVXETTWkd9MatsfhX1YK/view?usp=sharing",
      },
    ],
    body: [
      {
        type: "p",
        text: "Data attribution audits which training examples support a model's prediction. In a multi-task object detector, a shared backbone feeds a classification head and a localization head that optimize qualitatively different targets — so a single training image can be informative for category semantics while being redundant or actively counterproductive for localization geometry. Standard gradient-based attribution (influence functions, TracIn, TRAK, GradCos) scores each candidate against a query using the *joint* gradient, collapsing whatever task-specific evidence an example carries into one scalar.",
      },
      {
        type: "quote",
        text: "Classification and spatial gradients can be orthogonal, conflicting, or magnitude-imbalanced, entangling distinct class and box evidence into one score.",
      },
      { type: "h2", text: "Two ways to recover per-task attribution" },
      {
        type: "list",
        items: [
          "**Head-Conditioned Data Attribution (HCDA)** conditions attribution directly on each task's terminal-head parameters — a hand-specified but exact split. For YOLOv8 these are the `cv2`/`cv3` modules; for RT-DETR, the `bbox_head`/`score_head` branches; for Faster R-CNN, the ROI box-regression and classification predictors.",
          "**Learned Trajectory Attribution (LTTA)** instead performs label-free sparse dictionary learning over the shared-backbone gradients, upstream of the heads, and gives each learned atom a task preference from real per-head gradients — recovering task structure a hand-specified split cannot reach.",
        ],
      },
      {
        type: "p",
        text: "GradCos scores a training instance $z_i$ against a query $q$ by the cosine similarity of their joint gradients $g_x = \\nabla_{\\theta_{\\mathrm{all}}}\\mathcal{L}(x)$:",
      },
      { type: "eq", tex: "S_{\\mathrm{mono}}(z_i,q) = \\frac{\\langle g_q, g_i\\rangle}{\\|g_q\\|\\|g_i\\|}." },
      {
        type: "p",
        text: "**Proposition 1 (Task dominance).** Under orthogonal task gradients with norm ratio $r = \\|g^{\\mathrm{cls}}\\|/\\|g^{\\mathrm{box}}\\|$, the classification term's contribution to $S_{\\mathrm{mono}}$ grows as $r^2/(r^2+1)$ — large imbalance drives the joint score toward the dominant task regardless of the other task's alignment.",
      },
      {
        type: "p",
        text: "**Proposition 2 (Decomposition).** Bilinearity of the inner product gives $S_{\\mathrm{mono}} = \\alpha S^{\\mathrm{decomp}}_{\\mathrm{cls}} + \\beta S^{\\mathrm{decomp}}_{\\mathrm{box}} + \\epsilon_{\\chi}$: the joint score is a weighted sum of two per-task scores plus a residual entanglement term $\\epsilon_\\chi$.",
      },
      { type: "h2", text: "LTTA in three stages" },
      {
        type: "p",
        text: "LTTA fits an overcomplete sparse autoencoder on gradients tapped at the final shared layer immediately before the task-head split. Each atom $a_j$ is then scored by a task-preference statistic computed from real per-head gradients, $p_j = \\mathrm{mean}_i[\\cos(a_j, g_i^{\\mathrm{cls}}) - \\cos(a_j, g_i^{\\mathrm{box}})]$, and a soft mask reweights the atom's contribution to each task-conditioned score:",
      },
      {
        type: "eq",
        tex: "m^{\\mathrm{cls}}_j = \\tfrac{1+p_j}{2}, \\qquad m^{\\mathrm{box}}_j = \\tfrac{1-p_j}{2}.",
      },
      {
        type: "p",
        text: "An atom with $p_j$ near $+1$ contributes almost fully to the classification cosine and negligibly to the localization one, and symmetrically for $p_j$ near $-1$. The task-conditioned score is then the cosine similarity of the mask-reweighted sparse codes $z = \\mathrm{enc}(g)$: $S^{\\mathrm{LTTA}}_{\\mathrm{cls}} = \\cos(m^{\\mathrm{cls}} \\odot z_q,\\, m^{\\mathrm{cls}} \\odot z_i)$, and symmetrically for $S^{\\mathrm{LTTA}}_{\\mathrm{box}}$.",
      },
      {
        type: "figure",
        src: attribPipelineFig,
        alt: "LTTA schematic: shared-backbone gradients are encoded into a sparse dictionary, atoms receive a task-preference score, and a soft mask produces separate classification and box attribution scores",
        caption:
          "Shared-backbone gradients are encoded into a sparse dictionary, atoms receive a post-hoc task-preference score $p_j$, and a soft mask reweights the sparse code for each task before a masked cosine similarity is computed.",
      },
      { type: "h2", text: "Does the joint score actually collapse?" },
      {
        type: "p",
        text: "Before testing whether disentanglement helps, the paper checks the premise: cosine similarity between the raw classification and localization gradients at each shared YOLOv8m backbone layer, over 50 COCO validation queries.",
      },
      {
        type: "table",
        headers: ["Layer", "Stage", "Mean CosSim (μ ± σ)"],
        rows: [
          ["0 (Conv)", "Backbone", "−0.003 ± 0.377"],
          ["9 (SPPF)", "Backbone", "−0.035 ± 0.205"],
          ["12 (C2f)", "Neck", "−0.049 ± 0.224"],
          ["21 (C2f)", "Neck", "−0.001 ± 0.080"],
        ],
      },
      {
        type: "callout",
        text: "Alignment is near zero at every measured layer, and the collapse is amplified by magnitude imbalance: at the final shared layer the classification-gradient norm (14.82 ± 1.34) is roughly 9.1× the localization-gradient norm (1.63 ± 0.21), matching Proposition 1's dominance regime.",
      },
      { type: "h2", text: "Targeted degradation on COCO" },
      {
        type: "p",
        text: "Removing the training instances an attribution method ranks most influential and retraining from scratch should hurt the targeted task most if the score actually isolates it. $\\Delta_{\\mathrm{cls}}$ is the drop in mean classification confidence, $\\Delta_{\\mathrm{IoU}}$ the drop in mean localization IoU, both over 200 held-out COCO validation anchors.",
      },
      {
        type: "table",
        headers: ["Method", "Avg ΔCls", "Avg ΔIoU", "LOO ΔIoU", "LOO ΔConf"],
        rows: [
          ["GradCos (joint)", "+0.0600", "+0.0725", "−0.0046", "−0.0012"],
          ["GradCos+HCDA-Cls / -Box", "+0.2250", "+0.1950", "0.0011", "**0.0261**"],
          ["TRAK+HCDA-Cls / -Box", "+0.1925", "+0.1600", "0.0020", "0.0172"],
          ["LIF+HCDA-Cls / -Box", "+0.1650", "+0.1400", "—", "—"],
          ["**LTTA-Cls / LTTA-Box**", "**+0.2775**", "**+0.2375**", "**0.0096**", "0.0111"],
        ],
      },
      {
        type: "callout",
        text: "Fractional pruning averaged over {1,2,5,10}% on YOLOv8/COCO, plus single-image leave-one-out deltas over 1,517 completed retraining runs. LTTA achieves the largest average targeted degradation on both task axes.",
      },
      { type: "h2", text: "PASCAL VOC: on-target vs. off-target damage" },
      {
        type: "p",
        text: "With the bottom-ranked 10% (821 images) removed per strategy and the detector retrained from scratch, joint-score methods damage both tasks at similar, moderate levels — every task-conditioned method produces a clearer on-target/off-target split.",
      },
      {
        type: "table",
        headers: ["Method", "ΔIoU (localization)", "ΔConf (class)"],
        rows: [
          ["GradCos (joint score)", "0.13", "0.11"],
          ["TracIn (joint score)", "0.12", "0.13"],
          ["GradCos+HCDA-Box", "**0.35**", "0.06"],
          ["TRAK+HCDA-Box", "**0.28**", "0.07"],
          ["LIF+HCDA-Box", "**0.25**", "0.08"],
          ["LTTA-Spatial", "**0.42**", "0.05"],
          ["GradCos+HCDA-Cls", "0.06", "**0.41**"],
          ["TRAK+HCDA-Cls", "0.08", "**0.36**"],
          ["LIF+HCDA-Cls", "0.09", "**0.30**"],
          ["LTTA-Cls", "0.04", "**0.51**"],
        ],
      },
      {
        type: "callout",
        text: "LTTA-Spatial gives the largest observed localization drop (0.42 IoU) with the smallest classification side-effect (0.05); LTTA-Class gives the largest classification drop (0.51) with the smallest spatial side-effect (0.04). A permutation test over 10,000 task-label shuffles rejects exchangeable task assignments (p < 0.001).",
      },
      {
        type: "figrow",
        images: [
          { src: attribSweepCls, alt: "PASCAL VOC fractional pruning sweep: drop in semantic classification confidence versus fraction of training dataset removed, across ten attribution methods" },
          { src: attribSweepIou, alt: "PASCAL VOC fractional pruning sweep: drop in spatial verification IoU versus fraction of training dataset removed, across ten attribution methods" },
        ],
        caption:
          "PASCAL VOC fractional pruning sweeps. LTTA-Cls (left) and LTTA-Box (right) separate furthest from the joint-score baselines (TracIn, GradCos) as more of the ranked training set is removed.",
      },
      { type: "h2", text: "Architecture dependence" },
      {
        type: "p",
        text: "RT-DETR and Faster R-CNN tell a different story than YOLOv8m: head-conditioning stays useful, but LTTA's learned split offers no advantage over conditioning on the raw head gradients directly, and named parameter partitions stop tracking functional task partitions. On RT-DETR, the single largest spatial degradation in the pruning sweep comes from TracIn-Cls — a *classification*-conditioned trajectory. On Faster R-CNN, the closest-to-zero classification result comes from GradCos+HCDA-Box — a *box*-conditioned trajectory. In both cases, the subspace named for one task carries more usable signal for the *other* task than the subspace named for it.",
      },
      { type: "h2", text: "Anecdotal evaluation: does the score predict correctness?" },
      {
        type: "p",
        text: "On two groups of COCO `person`-class validation queries from YOLOv8m — one where the model's classification was correct, one where it was not — the average attribution score over each query's own top-100 candidates separates the groups in the expected direction under both joint GradCos and LTTA-Cls, with LTTA-Cls's standardized effect roughly 1.3× larger. The underlying wrong population is small (42 unique images), so this is reported as anecdotal rather than conclusive.",
      },
      {
        type: "figure",
        src: attribRightWrongTsne,
        alt: "t-SNE embedding of a Right and a Wrong person-class query with its own top-100 candidates, under GradCos and LTTA-Semantic",
        caption:
          "t-SNE illustration of one Right and one Wrong query embedded with its own top-100 candidates, under GradCos (left) and LTTA-Cls (right). d is the mean embedded distance from the query (black square) to its candidates, within that panel's own t-SNE optimization only — not comparable across panels.",
      },
      { type: "h2", text: "What this establishes, and what it does not" },
      {
        type: "list",
        items: [
          "**Joint scores can obscure task-specific attribution**, both analytically (Propositions 1–2) and empirically (near-zero shared-layer alignment).",
          "**Effectiveness depends on routing topology, not just on being task-conditioned.** Dense-head CNNs (YOLO) let LTTA separate task evidence in the shared representation; attention-mediated (RT-DETR) and sequential (Faster R-CNN) routing let each head's parameters absorb support for the other head's task, favoring explicit HCDA instead.",
          "**Named parameter groups are not always functional task subspaces.** RT-DETR and Faster R-CNN both show cross-task inversions.",
          "**HCDA and LTTA are complementary, not interchangeable** — the paper does not claim either is universally superior, or that latent task structure is fully recovered in every architecture, or that the correctness diagnostic generalizes beyond the one class and architecture it was measured on.",
        ],
      },
      { type: "h2", text: "Limitations" },
      {
        type: "list",
        items: [
          "LTTA's single-site dictionary (tapped at one fixed backbone layer) does not capture query-mediated or proposal-gated routing downstream of that layer, where it falls behind head conditioning.",
          "The correctness diagnostic uses one COCO class and one detector; generalization across classes and architectures is untested.",
          "Patching/pruning-based evaluation can add distribution shift that controls may not fully remove.",
        ],
      },
    ],
    publication:
      "Anish Sathyanarayanan, Louis Bonneau de Beaufort, Jose Oramas, Luis Galárraga. *One Score Is Not Enough: Task Entanglement in Multi-Task Data Attribution.* Under review at the [3rd Workshop on Attributing Model Behavior at Scale](https://attrib-workshop.cc/), NeurIPS 2026.",
    bibtex: `@misc{sathyanarayanan2026onescore,
      title={One Score Is Not Enough: Task Entanglement in Multi-Task Data Attribution},
      author={Sathyanarayanan, Anish and Bonneau de Beaufort, Louis and Oramas, Jose and Gal\\'{a}rraga, Luis},
      year={2026},
      note={Under review at the 3rd Workshop on Attributing Model Behavior at Scale (ATTRIB), NeurIPS 2026},
}`,
    contributors: [
      { name: "Anish Sathyanarayanan", sup: 1 },
      {
        name: "Louis Bonneau de Beaufort",
        href: "https://scholar.google.com/citations?hl=en&user=pJSwVEoAAAAJ",
        sup: 2,
      },
      {
        name: "Jose Oramas",
        href: "https://scholar.google.com/citations?user=FurBYlUAAAAJ&hl=en",
        sup: 3,
      },
      { name: "Luis Galárraga", href: "https://luisgalarraga.de", sup: 4 },
    ],
    contributorsNote:
      "¹ Birla Institute of Technology and Science, Pilani · ² IRISA, Université Bretagne Sud · ³ Interuniversity Microelectronics Centre (imec) · ⁴ Inria",
  },

  medulla: {
    title: "Medulla: Cluster- and Application-level I/O Performance Diagnosis with LLMs",
    authors: "Anish Sathyanarayanan, Vivek Rishi Panchagnula, Arnab K Paul",
    accepted: true,
    award: "Best Poster Award",
    venue:
      "Poster @ [PASC 2026](https://pasc-conference.org/editions/pasc26/) ACM Student Research Competition · ISC 2026 (submitted)",
    summary:
      "An LLM-based agent that turns raw Darshan I/O logs into checkable diagnosis — interactively for cluster administrators, or automated from a human-written report outline — and beats two state-of-the-art diagnosis tools on the TraceBench benchmark.",
    links: [
      { label: "conference", href: "https://pasc-conference.org/editions/pasc26/" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/1DcJ2m4W7R9ZSwwcVEcL7hU5wtjSE-_0K/view?usp=sharing",
      },
    ],
    body: [
      {
        type: "p",
        text: "Efficient parallel I/O on HPC systems is much harder for domain scientists to reason about than efficient compute, yet the gap between storage and compute speed keeps widening. Existing diagnosis tools analyze one Darshan log at a time, lack interpretability, and can't describe patterns across runs of the same executable or the same user. Medulla is an LLM-based tool with two forms: an interactive CLI for I/O experts, and an automated Report mode that turns a human-written outline into a full diagnosis report with plots and citations back to the underlying queries.",
      },
      { type: "h2", text: "Background: what a Darshan log actually contains" },
      {
        type: "p",
        text: "Darshan is a lightweight I/O profiler loaded automatically at many HPC clusters. Its monitoring is modular — POSIX, MPI-IO, STDIO and HDF5 layers each get their own records, plus a newer heatmap module recording a compressed global time-series of data transfer per rank.",
      },
      {
        type: "figure",
        src: medullaDarshanModules,
        alt: "Diagram of Darshan instrumenting the application, HDF5, MPI-IO, POSIX I/O and OS/filesystem layers, then reducing and writing header, job, name, POSIX, MPI-IO, HDF5 and Lustre records to a log file",
        caption: "Darshan and its optional instrumentation modules.",
      },
      { type: "h2", text: "Design" },
      {
        type: "p",
        text: "Darshan logs are parsed in parallel with PyDarshan and normalized into a Postgres schema — one table per interface, with a foreign key to a header table per job. Materialized views precompute the expensive aggregates (total bytes read/written, time in read/write/metadata, per-rank totals) that would otherwise mean scanning every POSIX record for a simple sum. A central database agent gets the schema, runs SQL queries with a timeout and helpful error messages, and generates plots by writing sandboxed Python against the database connection.",
      },
      {
        type: "figure",
        src: medullaArchitecture,
        alt: "Design overview of Medulla",
        caption:
          "Interactive mode (bottom path) lets an expert converse directly with the database agent. Automated mode (top path) parses a markdown observation outline into a tree, fills it in with observations and flags from the same agent, and hands the completed tree to a report-generation agent.",
      },
      {
        type: "p",
        text: "For automated mode, feeding one large plan into a single prompt gave poor results, so the report outline is instead a *tree*: a title, an example of the desired analysis (a blockquote), optional extra directions, and a YAML block for flags and graph specs. Each node computes something small. Communicating by example — what is sometimes called few-shot prompting — beat giving the model an explicit list of steps to follow.",
      },
      {
        type: "p",
        text: "To stop the model hallucinating filenames or statistics, every claim is returned as a JSON **observation**: a query-output-conclusion triplet. Medulla re-runs the query itself and cross-checks the result against what the model claimed; on a mismatch, it feeds back the correct output and asks the model to revise its conclusion. These triplets are cited directly in the final report so an I/O expert can check any claim without trusting the model's reasoning.",
      },
      { type: "h2", text: "Interactive analysis on ALCF Polaris" },
      {
        type: "p",
        text: "On production Darshan logs from ALCF's Polaris cluster (520 nodes, two intensive Lustre filesystems at 650 GiB/s peak), a single casual instruction — *\"graph i/o volume per day using the materialized view, split by interface and direction\"* — produces a full month's I/O timeline.",
      },
      {
        type: "figure",
        src: medullaIoVolumePerDay,
        alt: "Bar chart of total I/O volume per day for November 2025, broken down by POSIX/MPIIO/STDIO read and write, showing a huge spike of read traffic on Nov 27–28",
        caption:
          "I/O volume per day, November 2025, on ALCF Polaris. The spike on the 27th–28th is almost entirely read traffic, and one user accounted for 59.6% of all I/O transferred that month (301.46 TB) — Medulla surfaces this as a validated observation, not just a chart.",
      },
      {
        type: "p",
        text: "Following that user's largest job further, plotting file size against read volume per file makes it obvious that every one of 4,096 ranks opened and read the same file independently with no coordination — so only about 0.02% of the read traffic was genuine and the rest was redundant re-reads.",
      },
      {
        type: "figure",
        src: medullaRedundantReads,
        alt: "Bar chart of I/O volume per job for the top user, split into genuine and certainly-redundant read traffic, showing redundant reads dominate the largest jobs",
        caption:
          "Redundant-read volume across this user's jobs — a recurring pattern a threshold-based tool like Drishti can't see, since it only reports a binary flag per log.",
      },
      {
        type: "p",
        text: "A cluster-level pass shows the opposite kind of mistake: `/home` on ALCF is technically a Lustre filesystem but isn't meant for heavy I/O, yet it carries more traffic (301.59 TiB) than the two flagship high-performance filesystems combined — because the top user never switched off it.",
      },
      { type: "h2", text: "Bounding time actually spent in I/O" },
      {
        type: "p",
        text: "Darshan's aggregated records make *average* time-per-rank in I/O easy to compute, but that's only a lower bound — a fully serialized job where one rank does all the I/O work will look cheap on average while actually bottlenecked. Medulla instead derives an upper bound from total I/O time summed across ranks divided by wall-clock runtime:",
      },
      { type: "eq", tex: "\\frac{T_{io}}{nt} < I < \\frac{T_{io}}{t}" },
      {
        type: "p",
        text: "where $T_{io}$ is I/O time summed across all ranks, $t$ is runtime, $n$ is the number of ranks, and $I$ is the fraction of runtime spent in I/O.",
      },
      {
        type: "figure",
        src: medullaIoTimeCdf,
        alt: "CDF of the upper bound of percentage of runtime spent in I/O across jobs, showing about 60% of jobs cannot improve runtime by more than 1% through I/O optimization, 75% by more than 5%, and 80% by more than 10%",
        caption:
          "For ~60% of Polaris jobs, even complete serialization means I/O optimization can improve runtime by at most 1%; ~80% of jobs are capped at a 10% improvement — a fast way to triage which jobs are worth an I/O expert's time.",
      },
      { type: "h2", text: "Benchmarking against Drishti and IOAgent" },
      {
        type: "p",
        text: "On TraceBench (35 expert-labeled Darshan traces spanning synthetic IO500 benchmarks, hand-written single-issue traces, and real production application logs), Medulla-Report is compared against Drishti (threshold-based) and IOAgent (also LLM-based, RAG-heavy), all judged against the same 11 expert-defined issue labels.",
      },
      {
        type: "figure",
        src: medullaFinalResults,
        alt: "Grouped bar charts of Accuracy, Precision, Recall and F1-score for Drishti, IOAgent and Medulla across IO500, Single Bench, Real App and Total categories, with Medulla leading on Accuracy, Precision and F1",
        caption:
          "Medulla leads on accuracy, precision and F1 in every category. IOAgent wins on recall in two of three categories and the total — at the cost of far more false positives (130 vs. Medulla's 54 on the full 337-instance benchmark).",
      },
      {
        type: "callout",
        text: "Medulla: 149 true positives vs. 54 false positives (precision ≈0.73). IOAgent: 154 true positives vs. 130 false positives (precision ≈0.53). Higher recall bought with much lower precision is exactly the failure mode Medulla's validated-observation design is meant to avoid.",
      },
      { type: "h2", text: "Limitations" },
      {
        type: "list",
        items: [
          "LLM-generated visualizations are flexible but less dependable than hardcoded plotting; a hybrid of automated and hardcoded graphing functions is a natural next step.",
          "Storing every raw log at scale remains an open problem shared with other Darshan-analysis tools.",
          "The report outline is written by an I/O expert, not a domain scientist, so extending it to application-specific behavior (e.g. recognizing LAMMPS logs) is future work rather than something Medulla infers on its own.",
        ],
      },
    ],
    publication:
      "Anish Sathyanarayanan, Vivek Rishi Panchagnula, Arnab K Paul. *Medulla: Cluster- and Application-level I/O Performance Diagnosis with LLMs.* PASC 2026 ACM Student Research Competition (Poster) — Best Poster Award; full paper submitted to ISC 2026.",
    bibtex: `@inproceedings{sathyanarayanan2026medulla,
    title={Medulla: Cluster- and Application-level I/O Performance Diagnosis with LLMs},
    author={Sathyanarayanan, Anish and Panchagnula, Vivek Rishi and Paul, Arnab K},
    booktitle={PASC 2026 ACM Student Research Competition},
    year={2026},
    note={Best Poster Award; full paper submitted to ISC 2026}
}`,
    contributors:
      "Anish Sathyanarayanan, Vivek Rishi Panchagnula and Arnab K Paul, DaSH Lab, BITS Pilani Goa, in collaboration with Oak Ridge National Laboratory.",
  },

  "perplexity-cost-quantisation": {
    title: "Perplexity Cost Understates What Activation Quantisation Breaks",
    authors: "Anish Sathyanarayanan",
    venue: "Under review @ ICLR'27",
    summary:
      "A quantiser is judged by its average perplexity cost, but a capability that fires on a small fraction of tokens can collapse while that average barely moves. Behavioural probes catch what perplexity can't.",
    teaser: {
      src: quantisationPareto,
      alt: "Pareto curve of induction retained versus perplexity for six quantisation arms on pythia-1.4b: uniform and rotated activation quantisation, plus GPTQ, AWQ and SmoothQuant, with QuaRot's Hadamard rotation dominating every other arm",
    },
    links: [
      {
        label: "paper",
        href: "https://drive.google.com/file/d/1mnzDg9Im5STuhsdPM3JTW1I8JC8UqF7l/view?usp=sharing",
      },
    ],
    body: [
      {
        type: "p",
        text: "A quantiser is judged by its average cost — an expectation over tokens. A capability that only fires on a small fraction of tokens can break while that expectation barely moves. This paper attaches three behavioural probes and a matched control to activation quantisation, then tests whether what the probes find generalises to quantisers and a model scale it wasn't tuned on.",
      },
      {
        type: "quote",
        text: "Perplexity ranks methods reliably... It does not, however, indicate which capability survives, because the probes do not fail together.",
      },
      { type: "h2", text: "Setup" },
      {
        type: "p",
        text: "12 models across four families — Pythia 70M to 12B, GPT-2 small, Gemma-2 2B/9B, and Qwen3 1.7B/8B — tested on 128-token OpenWebText sequences at three relative depths. A forward hook replaces the residual stream at one block with a perturbed copy: symmetric uniform quantisation with a scale shared per tensor, per channel, or per token. The matched control swaps in zero-mean Gaussian noise with the same per-channel second moment, isolating the *structure* of the quantisation error from its *size*.",
      },
      {
        type: "p",
        text: "Three random-token probes avoid letting the model fall back on a language prior: local copying (**induction**), copying across a span, and **retrieval** of a value bound to a key. If quantisation error were just noise, it would cost the same as matched Gaussian noise of the same size. To second order it should:",
      },
      {
        type: "eq",
        tex: "\\Delta\\mathcal{L} \\approx \\sum_j F_j\\,\\varepsilon_j^2, \\qquad F_j = \\mathbb{E}\\!\\left[\\left(\\frac{\\partial \\mathcal{L}}{\\partial h_j}\\right)^{\\!2}\\right]",
      },
      {
        type: "p",
        text: "where $\\varepsilon = Q(h) - h$ is the quantisation error. Whether quantisation and matched noise actually diverge in practice is the question the rest of the paper answers.",
      },
      { type: "h2", text: "Quantisation is not noise-like" },
      {
        type: "p",
        text: "At three bits, quantisation keeps almost none of either probe; matched Gaussian noise of the same size keeps most of both. Randomising only the *signs* of the quantisation error, holding each magnitude fixed, reproduces the noise-like numbers rather than the quantised ones — the damage is carried by the sign pattern, not the error size.",
      },
      {
        type: "table",
        headers: ["Perturbation", "Induction", "At distance", "Retrieval"],
        rows: [
          ["Quantised, 4 bits", "0.681", "0.662", "0.272"],
          ["Quantised, 3 bits", "0.001", "0.001", "0.000"],
          ["Gaussian noise, matched, 3 bits", "0.681", "0.698", "0.219"],
          ["Signs randomised, 3 bits", "0.695", "0.677", "0.188"],
          ["Rotated basis, 3 bits", "**0.980**", "**0.981**", "**0.694**"],
        ],
      },
      {
        type: "callout",
        text: "Fraction of intact accuracy retained, median over model families at three relative depths. Intact accuracy is 0.954–0.987 for the two copying probes; retrieval is the most fragile probe throughout.",
      },
      {
        type: "figure",
        src: quantisationSignDial,
        alt: "Line chart of induction and retrieval capability retained as the fraction of quantisation-error signs randomised increases from 0 to 100%, both curves converging to the matched-Gaussian-control level at 100%",
        caption:
          "Turning the sign-randomisation dial from 0% to 100% smoothly recovers the matched-noise control level for both probes — direct evidence that a coordinate-aligned sign pattern, not error magnitude, is what quantisation breaks.",
      },
      { type: "h2", text: "Perplexity doesn't say which capability survives" },
      {
        type: "p",
        text: "Over 780 within-model comparisons between deployable arms, the arm perplexity prefers keeps less induction in only 2.1% of cases and less retrieval in only 4.0% — perplexity ranks methods almost the same way the probes do. But ranking is not calibration: where perplexity has risen by a factor of 1.2–1.5, induction still keeps 0.959 of its intact accuracy while retrieval has already fallen to 0.554.",
      },
      {
        type: "table",
        headers: ["Perplexity, relative to intact", "Settings", "Induction", "Retrieval"],
        rows: [
          ["1 to 1.2", "95", "0.999", "0.991"],
          ["1.2 to 1.5", "22", "0.959", "0.554"],
          ["1.5 to 2", "26", "0.929", "0.502"],
          ["2 to 3", "17", "0.689", "0.246"],
          ["3 to 5", "15", "0.377", "0.080"],
          ["5 to 10", "19", "0.172", "0.019"],
          ["above 10", "136", "0.000", "0.000"],
        ],
      },
      {
        type: "callout",
        text: "Pooled over all three deployable arms, all models, and every depth and bitwidth. Resampling models rather than settings gives non-overlapping 95% CIs for induction [0.946, 0.981] and retrieval [0.430, 0.720] — the gap is not a sampling artefact.",
      },
      { type: "h2", text: "The repair: quantise in a rotated frame" },
      {
        type: "p",
        text: "If the damage is a coordinate-aligned sign pattern, rotating before quantising should spread it across coordinates and wash it out. At matched average bitwidth it does — far better than protecting the most loss-sensitive directions (Fisher-weighted protection), which optimizes exactly the wrong thing for these probes.",
      },
      {
        type: "table",
        headers: ["Precision", "Average bits", "Perplexity", "Induction", "Retrieval"],
        rows: [
          ["Uniform", "3.00", "1,310.6", "0.001", "0.000"],
          ["Uniform", "4.00", "55.1", "0.681", "0.272"],
          ["Uniform", "8.00", "22.0", "1.000", "0.986"],
          ["Protected, Fisher", "3.00", "324.3", "0.007", "0.000"],
          ["Protected, Fisher", "6.00", "31.1", "0.916", "0.559"],
          ["Rotated", "3.00", "**33.1**", "**0.980**", "**0.694**"],
          ["Rotated", "4.00", "23.5", "0.997", "0.949"],
        ],
      },
      {
        type: "callout",
        text: "Full-precision perplexity is 21.6. At three average bits, rotation reaches induction 0.980 where uniform quantisation manages 0.001 — a 979-point recovery at the same bit budget.",
      },
      { type: "h2", text: "Standard benchmarks don't see it" },
      {
        type: "p",
        text: "Running the same deployed quantisers against a standard benchmark battery (LAMBADA, HellaSwag, ARC-Challenge, PIQA, WinoGrande) shows only mild, roughly uniform degradation — none of these benchmarks isolate the induction/retrieval split the probes find, which is exactly why perplexity and benchmark accuracy both understate the damage.",
      },
      {
        type: "figure",
        src: quantisationBenchmarkBattery,
        alt: "Grouped bar chart of accuracy on LAMBADA, HellaSwag, ARC-Challenge, PIQA and WinoGrande for baseline, GPTQ W4A16, AWQ W4A16, SmoothQuant W4A16, GPTQ W4A4 and SmoothQuant W8A8, on pythia-1.4b",
        caption:
          "Only GPTQ at W4A4 shows a visible drop (LAMBADA collapses to 0.03), and even that looks like ordinary degradation — nothing here signals a targeted capability split the way the probes do.",
      },
      { type: "h2", text: "External validation and a deployable fix" },
      {
        type: "p",
        text: "The measurements above use one diagnostic quantiser as both subject and instrument. Testing GPTQ, AWQ and SmoothQuant directly on pythia-1.4b and Qwen3-8B-Base shows the same split reappears once a method quantises activations and not only weights — even though none of these methods were designed to produce it.",
      },
      {
        type: "table",
        headers: ["Model", "Arm", "Bits", "Perplexity", "Induction", "Retrieval"],
        rows: [
          ["pythia-1.4b", "GPTQ, weights only", "W4A16", "20.1", "0.948", "0.273"],
          ["pythia-1.4b", "AWQ, weights + activations", "W4A4", "174.2", "0.158", "0.008"],
          ["Qwen3-8B-Base", "GPTQ, weights only", "W4A16", "20.3", "0.972", "0.477"],
          ["Qwen3-8B-Base", "AWQ, weights + activations", "W4A4", "47.4", "0.840", "0.090"],
        ],
      },
      {
        type: "callout",
        text: "Full precision: pythia-1.4b scores 19.7 perplexity / 0.955 induction / 0.281 retrieval; Qwen3-8B-Base scores 19.9 / 0.973 / 0.480. GPTQ at W4A16 (weight-only) leaves both probes intact; AWQ at W4A4 quantises activations and the split reappears — pythia-1.4b keeps 16.5% of its induction but only 2.8% of its retrieval.",
      },
      {
        type: "p",
        text: "The diagnostic repair uses a dense random-orthogonal rotation, which is not deployable — applying and inverting it around every quantised tensor adds a transform a bit budget doesn't count. Swapping in QuaRot's construction (a random sign diagonal pushed through a Walsh-Hadamard transform) matches the dense rotation everywhere and exceeds it in harder regimes, while costing a measured latency overhead per block rather than an estimated one.",
      },
      { type: "h2", text: "It holds at scale, and under instruction tuning" },
      {
        type: "p",
        text: "Repeating the single-block sweep on Qwen2.5-32B (more than double the size of the next-largest model tested) and on Qwen3-8B's instruction-tuned counterpart shows the same pattern, with the collapse point shifted rather than erased: Qwen2.5-32B keeps near-intact induction (0.983) at three bits, where the four-model set had already collapsed, and only breaks down at two bits.",
      },
      {
        type: "figure",
        src: quantisationNewModelsScale,
        alt: "Two line charts of induction retained versus perplexity for Qwen2.5-32B and Qwen3-8B-instruct, comparing uniform and rotated quantisation across five bitwidths, log-x axis",
        caption:
          "Uniform (blue) versus rotated (orange) quantisation on two models not used to tune the original probes. The mechanism is not specific to the scale first measured — only the bitwidth at which it takes effect shifts.",
      },
      { type: "h2", text: "Statistical robustness" },
      {
        type: "p",
        text: "Every headline comparison in the paper is re-run as a cluster bootstrap over models (4,000 resamples) rather than trusting a single point estimate.",
      },
      {
        type: "figure",
        src: quantisationBootstrapCis,
        alt: "Six-panel forest plot of 95% bootstrap confidence intervals over models for probe accuracy at 3 bits, error concentration, structure premium, allocation ratio, induction versus bits, and the rotated-basis restore, all on log or linear axes",
        caption:
          "95% CIs, cluster bootstrap over models, 4,000 resamples, for every headline table in the paper — probes at 3 bits, error concentration, the structure premium over matched noise, sensitivity-based allocation, induction versus bitwidth, and how much the rotated basis restores.",
      },
      { type: "h2", text: "Limitations" },
      {
        type: "list",
        items: [
          "Most measurements perturb a single block to isolate mechanism; the end-to-end counterpart shows the same repair ordering but over a narrower usable range.",
          "The weight/activation comparisons in the external-validation section are not matched-budget — the claim rests on each deployed quantiser crossing the activation-quantisation boundary, not on bit-for-bit parity.",
          "The measured Hadamard-rotation latency times a dense $d \\times d$ matmul, not QuaRot's fused $O(n \\log n)$ kernel, which a production deployment would use and which would cost less.",
        ],
      },
    ],
    publication:
      "Anish Sathyanarayanan. *Perplexity Cost Understates What Activation Quantisation Breaks.* Under review at ICLR 2027.",
    bibtex: `@misc{sathyanarayanan2027perplexitycost,
      title={Perplexity Cost Understates What Activation Quantisation Breaks},
      author={Sathyanarayanan, Anish},
      year={2027},
      note={Under review at ICLR 2027},
}`,
    contributors: "Anish Sathyanarayanan.",
  },
};
