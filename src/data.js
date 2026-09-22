import attribStage1 from "./assets/attrib/stage-1.png";
import attribStage2 from "./assets/attrib/stage-2.png";
import attribStage3 from "./assets/attrib/stage-3.png";
import biovibeCellCycle from "./assets/biovibe/cell-cycle.png";
import bypassingHeatmapGrid from "./assets/bypassing/heatmap-moe-grid.png";
import dashlabLogo from "./assets/logos/dashlab.png";
import inriaLogo from "./assets/logos/inria.svg";
import marvellLogo from "./assets/logos/marvell.svg";
import mitCsailLogo from "./assets/logos/mit-csail.svg";
import saidlLogo from "./assets/logos/saidl.png";
import turbomlLogo from "./assets/logos/turboml.png";
import uclLogo from "./assets/logos/ucl.svg";
import lrnnxBlockDiagram from "./assets/lrnnx/ssm-block-diagram.png";
import medullaArchitecture from "./assets/medulla/architecture.png";
import quantisationPareto from "./assets/quantisation/pareto-real-quantizers.png";
import sahaboseLossLandscape from "./assets/sahabose/loss-landscape.gif";

// Pixel waypoints below are read directly off each diagram's own pixels, so
// the animated pulses trace exactly what the figure depicts.
const lrnnxFlow = {
  src: lrnnxBlockDiagram,
  imgSize: [1580, 582],
  paths: [
    { path: [[111, 256], [1484, 256]], color: "245, 146, 40", durationMs: 1900, radius: 1.7 },
    {
      path: [[241, 256], [241, 58], [1314, 58], [1314, 256]],
      color: "56, 189, 248",
      durationMs: 1500,
      delayMs: 250,
      radius: 1.4,
    },
    {
      path: [[953, 256], [953, 454], [591, 454], [591, 256]],
      color: "74, 222, 128",
      durationMs: 1300,
      delayMs: 700,
      radius: 1.4,
    },
  ],
};

const attribStages = {
  stageMs: 1800,
  slides: [{ src: attribStage1 }, { src: attribStage2 }, { src: attribStage3 }],
};

export const profile = {
  name: "Anish Sathyanarayanan",
  tagline: "Machine Learning Researcher — Interpretability, Optimization, Systems",
  bio: "CS undergraduate at BITS Pilani, Goa (2024–2028), working across mechanistic interpretability, second-order optimization, and AI for scientific and HPC systems. Research stints at MIT CSAIL, Inria, and UCL.",
  email: "f20240559@goa.bits-pilani.ac.in",
  linkedin: "https://linkedin.com/in/anish-sathyanarayanan-53b69029b",
  github: "https://github.com/Anish-1101-lab",
  scholar: "https://scholar.google.com/citations?user=YNzTmXUAAAAJ&hl=en",
  website: "https://web.mit.edu/anish559/www/",
};

export const publications = [
  {
    title: "Bypassing the Rationale: Causal Auditing of Implicit Reasoning in Language Models",
    authors: "Anish Sathyanarayanan*, Aditya Nagarsekar*, Aarush Rathore*",
    accepted: true,
    venue:
      "[LIT Workshop](https://latent-implicit-thinking.github.io/) @ [ICLR 2026](https://iclr.cc/) · Abstract at the [AIMII Workshop](https://aimii.info/) @ [IASEAI 2026](https://www.iaseai.org/)",
    tag: "ICLR 2026",
    summary:
      "A causal, layer-wise audit of how much a language model's answer actually depends on its chain of thought, and how often it does not.",
    slug: "bypassing-the-rationale",
    reveal: {
      src: bypassingHeatmapGrid,
      steps: 32,
      stepMs: 130,
      labelPrefix: "LAYER",
    },
    links: [
      { label: "project page", href: "#/project/bypassing-the-rationale" },
      { label: "arXiv", href: "https://www.arxiv.org/abs/2602.03994" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/1IOYuZhrG7g2ysbOmlx4-BP_6Ukhkg9Cn/view?usp=sharing",
      },
      { label: "code", href: "https://github.com/Anish-1101-lab/cot-manipulation-monitor" },
    ],
  },
  {
    title: "lrnnx: A Library for Linear RNNs",
    authors:
      "Karan Bania*, Soham Kalburgi*, Manit Tanwar*, Dhruthi*, Aditya Nagarsekar*, Harshvardhan Mestha*, Naman Chibber*, Raj Deshmukh*, Anish Sathyanarayanan*, Aarush Rathore*, Pratham Chheda*",
    accepted: true,
    venue:
      "[Student Research Workshop](https://2026.eacl.org/calls/srw/) @ [EACL 2026](https://2026.eacl.org/)",
    tag: "EACL 2026",
    summary:
      "A single PyTorch API for contemporary linear RNN and state-space architectures, so they can be swapped, benchmarked, and extended without rewriting the surrounding model.",
    slug: "lrnnx",
    flow: lrnnxFlow,
    links: [
      { label: "project page", href: "#/project/lrnnx" },
      { label: "paper", href: "https://aclanthology.org/2026.eacl-srw.60.pdf" },
      { label: "arXiv", href: "https://arxiv.org/pdf/2602.08810" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/17907yJUrdPwrZFEXxcUU_sisGab2Glzz/view",
      },
      { label: "code", href: "https://github.com/SforAiDl/lrnnx" },
    ],
  },
  {
    title: "One Score Is Not Enough: Task Entanglement in Multi-Task Data Attribution",
    authors: [
      { name: "Anish Sathyanarayanan" },
      { name: "Louis Bonneau de Beaufort", href: "https://scholar.google.com/citations?hl=en&user=pJSwVEoAAAAJ" },
      { name: "Jose Oramas", href: "https://scholar.google.com/citations?user=FurBYlUAAAAJ&hl=en" },
      { name: "Luis Galárraga", href: "https://luisgalarraga.de" },
    ],
    venue: "Under review @ ATTRIB Workshop, NeurIPS 2026",
    tag: "NeurIPS 2026 Workshop · under review",
    summary:
      "Decomposing entangled multi-task gradients into distinct task trajectories with overcomplete SAEs, validated across 1,517 leave-one-out retraining runs.",
    slug: "one-score-not-enough",
    stages: attribStages,
    links: [
      { label: "project page", href: "#/project/one-score-not-enough" },
      { label: "workshop", href: "https://attrib-workshop.cc/" },
      {
        label: "paper",
        href: "https://drive.google.com/file/d/15mL_n0Jzbhj4FVXETTWkd9MatsfhX1YK/view?usp=sharing",
      },
    ],
  },
  {
    title: "SahaBose-KFAC: Making KFAC Stable via Spectral Annealing and Curvature Condensation",
    authors: [
      { name: "Anish Sathyanarayanan", sup: 1, star: true },
      { name: "Rishikesh Mallagundla", sup: 1, star: true },
      { name: "Visheshe Narang", sup: 1 },
      { name: "Aman Chadha", href: "https://aman.ai", sup: 2 },
      { name: "Vinija Jain", href: "https://scholar.google.com/citations?user=oYaD1NcAAAAJ&hl=en", sup: 2 },
      { name: "Amitava Das", href: "https://scholar.google.com/citations?user=HYpfhaEAAAAJ&hl=en", sup: 1 },
    ],
    affiliations: "¹ Pragya AI Lab, BITS Pilani Goa · ² Google DeepMind · * equal contribution",
    venue: "Under review @ NeurIPS 2026",
    tag: "NeurIPS 2026 · under review",
    summary:
      "A spectral-controlled natural-gradient optimizer for KFAC with adaptive eigensubspace condensation, improving Transformer-scale training stability.",
    image: { src: sahaboseLossLandscape },
    links: [{ label: "project page", href: "https://pragyaai.github.io/sahabosekfac/" }],
  },
  {
    title: "Medulla: Cluster- and Application-level I/O Performance Diagnosis with LLMs",
    authors: "Anish Sathyanarayanan, Vivek Rishi Panchagnula, Arnab K Paul",
    accepted: true,
    award: "Best Poster Award",
    venue:
      "Poster @ [PASC 2026](https://pasc-conference.org/editions/pasc26/) ACM Student Research Competition",
    tag: "PASC 2026",
    summary:
      "An LLM-based agent for Darshan-log analysis, using Query–Output–Conclusion validation to outperform SOTA on real-world HPC I/O logs.",
    slug: "medulla",
    image: { src: medullaArchitecture },
    links: [
      { label: "project page", href: "#/project/medulla" },
      { label: "conference", href: "https://pasc-conference.org/editions/pasc26/" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/1DcJ2m4W7R9ZSwwcVEcL7hU5wtjSE-_0K/view?usp=sharing",
      },
    ],
  },
  {
    title: "Perplexity Cost Understates What Activation Quantisation Breaks",
    authors: "Anish Sathyanarayanan",
    venue: "Under review @ ICLR'27",
    tag: "ICLR'27 · under review",
    summary:
      "A quantiser's perplexity cost hides which capabilities survive it: induction and retrieval fail at different bitwidths, the damage follows the sign pattern of the error rather than its size, and quantising in a rotated frame removes it.",
    slug: "perplexity-cost-quantisation",
    image: { src: quantisationPareto },
    links: [
      { label: "project page", href: "#/project/perplexity-cost-quantisation" },
      {
        label: "paper",
        href: "https://drive.google.com/file/d/1mnzDg9Im5STuhsdPM3JTW1I8JC8UqF7l/view?usp=sharing",
      },
    ],
  },
  {
    title:
      "BioVibe: Programming a Biological Cell, DNA-Programmable Microcomputers and Cell-as-Computer Abstractions",
    authors:
      "Anish Sathyanarayanan, with [Prof. Philip Treleaven](https://en.wikipedia.org/wiki/Philip_Treleaven) (UCL) and [Holistic AI](https://www.holisticai.com/)",
    venue: "Working paper",
    tag: "Working paper",
    summary:
      "Connecting LLMs to UniProt, PDB, KEGG, PubMed, and BioNeMo via MCP for genetic-circuit design on DNA-programmable microcomputers.",
    image: { src: biovibeCellCycle },
    links: [
      {
        label: "SSRN",
        href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6842719",
      },
    ],
  },
];

export const news = [
  {
    date: "Sep 2026",
    text: "Selected for the [Agyeya Research Fellowship](https://agyeya.com/#fall-2026) (Fall 2026), sponsored by Google and Adaptation.",
  },
  {
    date: "Jul 2026",
    text: "Awarded [Best Poster](https://pasc-conference.org/editions/pasc26/program/acm-posters/) at the [PASC 2026](https://pasc-conference.org/editions/pasc26/) ACM Student Research Competition (Bern, Switzerland) for [Medulla](#/project/medulla) — 1 of 14 students selected worldwide.",
  },
  {
    date: "Jul 2026",
    text: "Wrapped up a research internship at [Inria](https://www.inria.fr/en), Rennes, working with [Dr. Luis Galárraga](https://luisgalarraga.de) on multi-task data attribution.",
  },
  {
    date: "May 2026",
    text: "Received the [SIA Award 2026](https://alumniaffairs.bits-goa.ac.in/scholarshipDetails/summerInternshipAssistance) (Summer Internship Assistance) — the only 2nd-year student from BITS Pilani selected for the award.",
  },
  {
    date: "May 2026",
    text: "Started a research internship at [Inria](https://www.inria.fr/en), Rennes, France.",
  },
  {
    date: "May 2026",
    text: "“[One Score Is Not Enough: Task Entanglement in Multi-Task Data Attribution](#/project/one-score-not-enough)” submitted — under review at the [ATTRIB Workshop](https://attrib-workshop.cc/), NeurIPS 2026.",
  },
  {
    date: "May 2026",
    text: "Wrapped up a research internship with the [Algorithmic Alignment Group at MIT CSAIL](https://algorithmicalignment.csail.mit.edu/), under [Prof. Dylan Hadfield-Menell](https://scholar.google.com/citations?user=4mVPFQ8AAAAJ&hl=en).",
  },
  {
    date: "Mar 2026",
    text: "Recipient of the [SIGHPC Grant and the DDF Grant](https://pasc-conference.org/editions/pasc26/about/student-travel-grants/).",
  },
  {
    date: "Feb 2026",
    text: "“[Bypassing the Rationale: Causal Auditing of Implicit Reasoning in Language Models](#/project/bypassing-the-rationale)” accepted to the [Latent Implicit Thinking Workshop](https://latent-implicit-thinking.github.io/) @ [ICLR 2026](https://iclr.cc/).",
  },
  {
    date: "Feb 2026",
    text: "“[lrnnx: A Library for Linear RNNs](#/project/lrnnx)” accepted to the [EACL 2026 Student Research Workshop](https://2026.eacl.org/calls/srw/).",
  },
  {
    date: "Feb 2026",
    text: "Began a research collaboration with [UCL](https://www.ucl.ac.uk/) and [Holistic AI](https://www.holisticai.com/) on [BioVibe](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6842719), a programmable-biology / AI systems project.",
  },
  {
    date: "Jan 2026",
    text: "Poster accepted at the [AIMII Workshop](https://aimii.info/), [IASEAI'26](https://www.iaseai.org/).",
  },
  {
    date: "Jan 2026",
    text: "Started a research internship with the [Algorithmic Alignment Group at MIT CSAIL](https://algorithmicalignment.csail.mit.edu/).",
  },
  {
    date: "Sep 2025",
    text: "Joined [Prof. Amitava Das](https://scholar.google.com/citations?user=HYpfhaEAAAAJ&hl=en)'s group on second-order optimization, in collaboration with researchers from Google DeepMind.",
  },
  {
    date: "Jul 2025",
    text: "Selected for the Google Upskilling Student Launchpad Program.",
  },
  {
    date: "Sep 2024",
    text: "Joined [DaSH Lab](https://www.dashlab.in/), working under Prof. Arnab Paul.",
  },
];

export const awards = [
  {
    title: "Agyeya Research Fellowship (Fall 2026)",
    description: "Selected for the fellowship, sponsored by Google and Adaptation.",
    href: "https://agyeya.com/#fall-2026",
  },
  {
    title: "SIA Award 2026 — Summer Internship Assistance",
    description: "The only 2nd-year student from BITS Pilani selected for the award.",
    href: "https://alumniaffairs.bits-goa.ac.in/scholarshipDetails/summerInternshipAssistance",
  },
  {
    title: "Best Poster Award — PASC 2026 ACM Student Research Competition",
    description: "1 of 14 students selected worldwide, Bern, Switzerland.",
    href: "https://pasc-conference.org/editions/pasc26/program/acm-posters/",
  },
  {
    title: "Poster Accepted — AIMII Workshop, IASEAI'26",
    description: "Poster presentation at the AIMII Workshop.",
    href: "https://aimii.info/",
  },
  {
    title: "Grant-supported member, IASEAI",
    description: "Grant-supported member of the International Association for Safe and Ethical AI.",
    href: "https://www.iaseai.org/",
  },
  {
    title: "Google Upskilling Student Launchpad Program",
    description: "Selected participant.",
  },
  {
    title: "SIGHPC Grant & DDF Grant",
    description: "Recipient of both research/travel grants.",
    href: "https://pasc-conference.org/editions/pasc26/about/student-travel-grants/",
  },
  {
    title: "BITSKrieg — Core Member",
    description: "Ranked 1st for CTF performance across India.",
    href: "https://ctftime.org/team/22310",
  },
];

export const experience = [
  {
    role: "Research Intern",
    org: "Inria",
    orgHref: "https://www.inria.fr/en",
    logo: inriaLogo,
    duration: "Onsite, Rennes, France · May 2026 – Jul 2026",
    note: "Under Dr. Luis Galárraga",
    noteHref: "https://luisgalarraga.de",
    bullets: [
      "Built a mechanistic interpretability framework decomposing entangled multi-task gradients into distinct task trajectories using overcomplete Sparse Autoencoders (SAEs).",
      "Uncovered cross-task gradient cancellation across CNN, transformer, and multi-stage detector architectures (YOLOv8, RT-DETR, Faster R-CNN), validated via 1,517 leave-one-out retraining runs on PASCAL VOC/COCO.",
      "Under review at the ATTRIB Workshop, NeurIPS 2026.",
    ],
    links: [
      { label: "project page", href: "#/project/one-score-not-enough" },
      {
        label: "paper",
        href: "https://drive.google.com/file/d/15mL_n0Jzbhj4FVXETTWkd9MatsfhX1YK/view?usp=sharing",
      },
    ],
  },
  {
    role: "Research Intern",
    org: "Algorithmic Alignment Group, MIT CSAIL",
    orgHref: "https://algorithmicalignment.csail.mit.edu/",
    logo: mitCsailLogo,
    duration: "Remote · Jan 2026 – May 2026",
    note: "Under Prof. Dylan Hadfield-Menell",
    noteHref: "https://scholar.google.com/citations?user=4mVPFQ8AAAAJ&hl=en",
    bullets: [
      "Applied least-privilege principles to LLMs by constraining SAE activation spaces to enforce narrow-task deployment.",
      "Stress-tested robustness to elicitation beyond explicit attack-training.",
    ],
    links: [{ label: "code (SAEScoping)", href: "https://github.com/roonbug/SAEScoping" }],
  },
  {
    role: "Research Collaborator",
    org: "UCL — Programmable Biology & AI Systems",
    orgHref: "https://www.ucl.ac.uk/",
    logo: uclLogo,
    duration: "Hybrid, London · Feb 2026 – Present",
    note: "With [Prof. Philip Treleaven](https://en.wikipedia.org/wiki/Philip_Treleaven) and [Holistic AI](https://www.holisticai.com/)",
    bullets: [
      "Working on DNA-programmable biological microcomputers and cell-as-computer abstractions.",
      "Built BioVibe, connecting LLMs to UniProt, PDB, KEGG, PubMed, and BioNeMo via MCP for genetic-circuit design.",
    ],
    links: [
      { label: "SSRN", href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6842719" },
    ],
  },
  {
    role: "Member",
    org: "SAiDL",
    orgHref: "https://saidl.in",
    logo: saidlLogo,
    duration: "lrnnx: unified PyTorch library for linear RNN architectures",
    bullets: [
      "Unified PyTorch library for linear RNN architectures (S4, S5, LRU, Mamba, S7, RG-LRU, Centaurus, etc.) with custom CUDA kernels.",
      "Accepted at the EACL 2026 Student Research Workshop.",
    ],
    links: [{ label: "arXiv", href: "https://arxiv.org/pdf/2602.08810" }],
  },
  {
    role: "Undergraduate Researcher",
    org: "DaSH Lab, BITS Goa",
    orgHref: "https://www.dashlab.in/",
    logo: dashlabLogo,
    duration: "Onsite · Sep 2024 – Present",
    note: "In collaboration with Oak Ridge National Laboratory",
    noteHref: "https://www.ornl.gov/",
    bullets: [
      "Built Medulla, an LLM-based agent for Darshan-log analysis enabling cluster- and application-level HPC I/O diagnosis.",
      "Introduced Query–Output–Conclusion validation, outperforming existing SOTA approaches in precision and F1-score on real-world logs.",
      "Accepted at PASC 2026 (Poster), awarded Best Poster, as 1 of 14 students worldwide selected for the PASC ACM Student Research Competition, Bern, Switzerland.",
    ],
    links: [
      { label: "project page", href: "#/project/medulla" },
      {
        label: "poster",
        href: "https://drive.google.com/file/d/1DcJ2m4W7R9ZSwwcVEcL7hU5wtjSE-_0K/view?usp=sharing",
      },
    ],
  },
  {
    role: "Research Intern",
    org: "Marvell Inc",
    orgHref: "https://www.marvell.com/",
    logo: marvellLogo,
    duration: "Remote, Santa Clara, California · Jan 2026 – Sep 2026",
    note: "Predictive Storage Caching and Tiered Data Migration",
    bullets: [
      "Developed an LSTM phase-classifier and MLP policy for storage tiering decisions, calibrated on MLPerf traces.",
    ],
  },
  {
    role: "Research Intern",
    org: "TurboML",
    orgHref: "https://turboml.com/",
    logo: turbomlLogo,
    duration: "Remote, San Francisco · Aug 2026 – Sep 2026",
    note: "Advised by Arjit Jain · Hidden-State Acceptance Probes for Speculative Decoding",
    bullets: [
      "Developed hidden-state-based acceptance probes to improve speculative decoding efficiency in LLM inference.",
    ],
  },
];

export const professionalDevelopment = [
  {
    role: "Reviewer",
    org: "ATTRIB Workshop @ NeurIPS 2026",
    orgHref: "https://attrib-workshop.cc/",
    duration: "2026",
    bullets: [
      "Reviewed submissions to the 3rd Workshop on Attributing Model Behavior at Scale: data attribution and provenance.",
    ],
  },
  {
    role: "Reviewer",
    org: "Interpretability for Discovery Workshop @ NeurIPS 2026",
    orgHref: "https://interpretability4discovery.github.io/",
    duration: "2026",
    bullets: ["Reviewed submissions on interpretability methods for scientific discovery."],
  },
  {
    role: "External Reviewer",
    org: "Transactions on Sustainable Computing",
    duration: "Sep 2025 - Present",
    bullets: [
      "Reviewed submissions for methodology quality, reproducibility, and societal impact.",
      "Provided constructive technical feedback for sustainable computing research.",
    ],
  },
  {
    role: "External Reviewer",
    org: "International Conference on Supercomputing (ICS)",
    duration: "Mar 2025 - Present",
    bullets: [
      "Evaluated papers on systems and supercomputing innovations.",
      "Contributed detailed reviews to support selection of impactful work.",
    ],
  },
];
