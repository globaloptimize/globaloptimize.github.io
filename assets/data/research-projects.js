window.RESEARCH_PROJECTS = [
  {
    "id": "r01",
    "title": "Zero-Violation Regret for Cooperative Markov Games",
    "status": "Accepted · NeurIPS 2026",
    "kind": "Accepted paper",
    "year": 2026,
    "directions": [
      "safety",
      "distributed"
    ],
    "methods": [
      "Coupled safety certificates",
      "Optimism over certified actions",
      "Graph-structured planning"
    ],
    "systems": [
      "Multi-robot coordination",
      "Wireless resource allocation"
    ],
    "summary": "Safe multi-agent learning when locally feasible actions can become unsafe in combination and every executed joint action must satisfy a hard constraint.",
    "insight": "Exploit local interaction scopes rather than enumerate the full joint action space; separate pessimistic safety certification from optimistic value learning.",
    "link": "publications.html?q=Zero-Violation"
  },
  {
    "id": "r02",
    "title": "Fresh Enough to Decide: Age of Intelligence",
    "status": "Accepted · AIoT 2026",
    "kind": "Accepted paper",
    "year": 2026,
    "directions": [
      "adaptation",
      "distributed",
      "robust"
    ],
    "methods": [
      "Decision-aware freshness",
      "KL certificates",
      "Variation budgets"
    ],
    "systems": [
      "Dynamic IoT",
      "Edge model synchronization"
    ],
    "summary": "Decides when a device should refresh a cached model by measuring the decision consequence of staleness rather than elapsed time alone.",
    "insight": "Accumulate predictive or parameter changes until a client-specific threshold balances stale-decision regret against communication and installation cost.",
    "link": "./papers/Fresh-Enough-to-Decide_AIoT2026.pdf"
  },
  {
    "id": "r03",
    "title": "Coupled Online Viability Expansion",
    "status": "Active research program",
    "kind": "Current project",
    "year": 2026,
    "directions": [
      "safety",
      "information",
      "distributed"
    ],
    "methods": [
      "Robust predecessor operators",
      "Certified experiments",
      "Compositional viability"
    ],
    "systems": [
      "Robotics",
      "Human–robot collaboration",
      "Autonomous systems"
    ],
    "summary": "Learns useful capabilities from an initially certified seed while preserving instantaneous, transition-wide, and recursive safety under unknown dynamics.",
    "insight": "Acquire only information that is safely reachable and that can enlarge a conservative viability certificate before evidence becomes stale.",
    "link": "research.html#safe-verifiable"
  },
  {
    "id": "r04",
    "title": "Safe RL under Instantaneous Hard Constraints",
    "status": "ICML 2023 · ICML 2025",
    "kind": "Research line",
    "year": 2025,
    "directions": [
      "safety"
    ],
    "methods": [
      "Safe-subgraph learning",
      "Peek-back / look-ahead bonuses",
      "Non-convex certification"
    ],
    "systems": [
      "Autonomous control",
      "Wireless systems"
    ],
    "summary": "Develops regret guarantees for reinforcement learning when even one unsafe action or state transition is unacceptable.",
    "insight": "Explore optimistically only inside a statistically certified inner approximation of the safe region and quantify the cost of safety uncertainty.",
    "link": "publications.html?topic=Safety%20%26%20reliability"
  },
  {
    "id": "r05",
    "title": "Online Optimization with Switching, Ramp, and Cross-Level Costs",
    "status": "IEEE/ACM ToN · INFOCOM · WiOpt",
    "kind": "Research line",
    "year": 2026,
    "directions": [
      "adaptation",
      "distributed"
    ],
    "methods": [
      "Competitive analysis",
      "Regularization with lookahead",
      "Bi-level optimization"
    ],
    "systems": [
      "Data centers",
      "Traffic routing",
      "Network function virtualization"
    ],
    "summary": "Coordinates operational decisions whose current benefits must be weighed against migration, reconfiguration, ramp, and cross-layer feasibility costs.",
    "insight": "Use prediction selectively, regularize abrupt movement, and couple slow provisioning with fast scheduling to obtain competitive and regret guarantees.",
    "link": "publications.html?q=switching"
  },
  {
    "id": "r06",
    "title": "Power-of-2 and Probe-then-Commit Learning",
    "status": "IEEE/ACM ToN 2025 · WiOpt 2026",
    "kind": "Research line",
    "year": 2026,
    "directions": [
      "adaptation",
      "information"
    ],
    "methods": [
      "Structured exploration",
      "Limited multi-arm feedback",
      "Switch-aware regret"
    ],
    "systems": [
      "Online services",
      "Resource selection"
    ],
    "summary": "Studies how a small, carefully structured amount of extra choice or feedback can sharply improve learning under adaptation costs.",
    "insight": "Probe informative alternatives before committing, or restrict switching to a structured power-of-two schedule, to trade information gain against operational churn.",
    "link": "publications.html?q=Power-of-2"
  },
  {
    "id": "r07",
    "title": "POMDPs with Partial Online State Information",
    "status": "IEEE TIT 2026",
    "kind": "Journal paper",
    "year": 2026,
    "directions": [
      "information"
    ],
    "methods": [
      "Partial online revelation",
      "Belief-state analysis",
      "Regret lower and upper bounds"
    ],
    "systems": [
      "Sensing-limited autonomy",
      "Network control"
    ],
    "summary": "Characterizes when occasional or partial state information fundamentally changes the learnability of a partially observable control problem.",
    "insight": "Separate representational equivalence from statistical information and quantify precisely how online revelation reduces uncertainty propagation.",
    "link": "./papers/First-POMDP-POSI_TIT2026.pdf"
  },
  {
    "id": "r08",
    "title": "The Price of Sharing Experience: Regret Bounds and Information Limits in RL",
    "status": "Submitted · ICLR 2027",
    "kind": "Current manuscript",
    "year": 2027,
    "directions": [
      "information",
      "distributed",
      "robust"
    ],
    "methods": [
      "Certified pooling",
      "Cross-action/state response sharing",
      "Best-of-both-worlds regret"
    ],
    "systems": [
      "Multi-task RL",
      "Distributed experience reuse"
    ],
    "summary": "Asks when experience, conditional responses, actions, or state-dependent evidence can be shared across tasks and disturbance categories without negative transfer.",
    "insight": "Maintain individual and pooled estimates, certify compatibility separately from estimation, and obtain a best-of-both-worlds guarantee relative to independent learning and safe sharing.",
    "link": "research.html#partial-information"
  },
  {
    "id": "r09",
    "title": "Multi-Objective Learning and Preference Feedback",
    "status": "AAAI · UAI · WiOpt · JMLR submission",
    "kind": "Research line",
    "year": 2026,
    "directions": [
      "information",
      "robust"
    ],
    "methods": [
      "Conversational queries",
      "Imperfect preference aggregation",
      "Pareto learning"
    ],
    "systems": [
      "Personalized AI",
      "RLHF and LLM alignment"
    ],
    "summary": "Learns decisions when objectives are personalized, multi-dimensional, and observed only through noisy, heterogeneous, or strategically limited feedback.",
    "insight": "Choose what to ask, whom to trust, and when to stop querying while proving regret and information limits for preference-dependent decisions.",
    "link": "publications.html?topic=Preferences%20%26%20multi-objective"
  },
  {
    "id": "r10",
    "title": "Forecast-Robust Reinforcement Learning",
    "status": "Active research direction",
    "kind": "Current project",
    "year": 2026,
    "directions": [
      "adaptation",
      "robust"
    ],
    "methods": [
      "Prediction confidence",
      "Robust Bellman updates",
      "Best-of-both-worlds guarantees"
    ],
    "systems": [
      "Reconfigurable wireless systems",
      "Mobility-aware control"
    ],
    "summary": "Uses forecasts when they are valuable while remaining protected against misspecification, delayed feedback, nonstationarity, and adversarial prediction error.",
    "insight": "Blend prediction-dependent and prediction-free policies through confidence tests so good forecasts improve performance without making bad forecasts catastrophic.",
    "link": "research.html#costly-adaptation"
  },
  {
    "id": "r11",
    "title": "Cross-Cloud/Edge/Device Multi-Task Foundation Models under Concept Drift",
    "status": "Active research direction",
    "kind": "Current project",
    "year": 2026,
    "directions": [
      "distributed",
      "robust",
      "information"
    ],
    "methods": [
      "Age of Intelligence",
      "Multi-task model partitioning",
      "Communication-computation control"
    ],
    "systems": [
      "Cloud–edge–device learning",
      "Foundation models"
    ],
    "summary": "Decides when, where, and which model components to train, test, update, or communicate as tasks and data distributions drift across cloud, edge, and local-device tiers.",
    "insight": "Treat freshness, model specialization, communication, and compute as one sequential decision problem rather than separate systems knobs.",
    "link": "research.html#distributed-intelligence"
  },
  {
    "id": "r12",
    "title": "Quantum Network Probing and Control",
    "status": "Active research direction",
    "kind": "Current project",
    "year": 2026,
    "directions": [
      "information",
      "distributed"
    ],
    "methods": [
      "Measurement–disturbance tradeoffs",
      "Partial observability",
      "Active probing"
    ],
    "systems": [
      "Quantum networking",
      "Entanglement routing"
    ],
    "summary": "Studies control when probing reveals network state but can consume or disturb the quantum resource being measured.",
    "insight": "Co-design information acquisition and control policies, with regret and information limits that account for the physical cost of observation.",
    "link": "research.html#partial-information"
  },
  {
    "id": "r13",
    "title": "Dynamic Attack Surfaces and AI Security",
    "status": "IEEE TIFS submission · active program",
    "kind": "Research line",
    "year": 2026,
    "directions": [
      "robust",
      "adaptation",
      "distributed"
    ],
    "methods": [
      "Queueing and risk dynamics",
      "Adaptive defense allocation",
      "Adversarial learning"
    ],
    "systems": [
      "Cyber defense",
      "LLM security",
      "AI services"
    ],
    "summary": "Models how attacks, vulnerabilities, defender capacity, and AI-assisted capabilities co-evolve over time.",
    "insight": "Prioritize defense by dynamic risk rather than static severity and jointly allocate service, training, and switching resources across vulnerabilities.",
    "link": "./papers/Security-Queueing-AI_TIFS2026.pdf"
  },
  {
    "id": "r14",
    "title": "Reconfiguration-Aware Fluid-Antenna ISAC",
    "status": "Active research direction",
    "kind": "Current project",
    "year": 2026,
    "directions": [
      "adaptation",
      "distributed",
      "robust"
    ],
    "methods": [
      "Physics-informed models",
      "Switching-cost RL",
      "Robust scheduling"
    ],
    "systems": [
      "Fluid antennas",
      "Integrated sensing and communication"
    ],
    "summary": "Co-designs sensing, communication, antenna position, and port switching when reconfiguration consumes delay and energy.",
    "insight": "Plan only executable switch schedules, learn under mobility and localization uncertainty, and quantify the value of reconfiguration against its physical cost.",
    "link": "research.html#costly-adaptation"
  },
  {
    "id": "r15",
    "title": "Task-Aware Memory and Communication for Edge Video Understanding",
    "status": "In preparation",
    "kind": "Current manuscript",
    "year": 2027,
    "directions": [
      "distributed",
      "information",
      "adaptation"
    ],
    "methods": [
      "Task-aware memory",
      "Communication scheduling",
      "Edge inference"
    ],
    "systems": [
      "Video understanding",
      "XR and spatial intelligence"
    ],
    "summary": "Allocates memory, communication, and model-update resources according to their effect on downstream decisions rather than raw data volume alone.",
    "insight": "Prioritize information by task value and freshness so devices retain and communicate what changes the decision, not simply what is newest.",
    "link": "research.html#distributed-intelligence"
  }  ,
  {
    "id": "r16",
    "title": "Multi-Agent POMDPs with Selective Observation",
    "status": "In preparation",
    "kind": "Current manuscript",
    "year": 2027,
    "directions": [
      "information",
      "distributed"
    ],
    "methods": [
      "Selective state revelation",
      "Cooperative partially observable RL",
      "Team regret analysis"
    ],
    "systems": [
      "Networked robots",
      "Distributed sensing"
    ],
    "summary": "Studies cooperative decisions when agents observe different local states and must choose what information to reveal, communicate, or retain while learning a team policy.",
    "insight": "Co-design action selection with cross-agent state sharing and quantify when selective online observation changes learnability relative to full broadcast or no sharing.",
    "link": "research.html#partial-information"
  }
];
