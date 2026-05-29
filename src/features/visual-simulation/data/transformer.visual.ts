import type { VisualSimulation } from "@/features/visual-simulation/models/visual-simulation.types";

export const transformerVisual: VisualSimulation = {
  id: "visual-transformer",
  slug: "transformer",
  title: "Transformer / May bien ap",
  subject: "physics",
  category: "electricity",
  visualStyle: "bytebytego-inspired",
  diagram2D: {
    layout: "left-to-right",
    objects: [
      { id: "primary-coil", type: "coil", label: "Primary coil", description: "AC input creates changing magnetic flux.", position: { x: 150, y: 210 }, colorRole: "input", boundParameterIds: ["Vp", "Np", "f"] },
      { id: "iron-core", type: "custom", label: "Iron core", description: "Guides changing magnetic flux to the secondary coil.", position: { x: 348, y: 205 }, colorRole: "process", boundParameterIds: ["coupling"] },
      { id: "secondary-coil", type: "coil", label: "Secondary coil", description: "Changing flux induces output voltage.", position: { x: 548, y: 210 }, colorRole: "output", boundParameterIds: ["Vs", "Ns"] },
      { id: "load", type: "lamp", label: "Load R", description: "Output current powers the load.", position: { x: 760, y: 238 }, colorRole: "output", boundParameterIds: ["R", "I"] },
      { id: "flux-lines", type: "field-line", label: "Magnetic flux", description: "Alternating flux links both coils.", position: { x: 350, y: 132 }, colorRole: "process", boundParameterIds: ["B", "f"] }
    ],
    arrows: [
      { id: "input-ac", from: { x: 46, y: 210 }, to: { x: 128, y: 210 }, label: "Vp AC", colorRole: "input" },
      { id: "flux", from: { x: 230, y: 142 }, to: { x: 492, y: 142 }, label: "changing Phi", colorRole: "process" },
      { id: "output", from: { x: 630, y: 242 }, to: { x: 740, y: 242 }, label: "Vs, I", colorRole: "output" }
    ],
    labels: [
      { id: "cause-effect", text: "AC input -> changing core flux -> induced secondary voltage -> load output", position: { x: 54, y: 42 }, colorRole: "process" }
    ],
    layers: [
      { id: "structure", title: "Structure", description: "Primary coil, magnetic core, secondary coil and load.", objectIds: ["primary-coil", "iron-core", "secondary-coil", "load"] },
      { id: "flux", title: "Flux coupling", description: "Core links the changing flux between coils.", objectIds: ["iron-core", "flux-lines"] },
      { id: "ratio", title: "Turn ratio", description: "Output voltage scales with Ns / Np.", objectIds: ["primary-coil", "secondary-coil"] }
    ]
  },
  model3D: {
    sceneType: "transformer",
    objects: [
      { id: "primary-coil", name: "Primary coil", type: "coil", description: "Input coil driven by AC voltage.", position: [-1.25, 0, 0], materialRole: "copper", boundParameterIds: ["Vp", "Np", "f"] },
      { id: "secondary-coil", name: "Secondary coil", type: "coil", description: "Output coil where voltage is induced.", position: [1.25, 0, 0], materialRole: "copper", boundParameterIds: ["Vs", "Ns"] },
      { id: "iron-core", name: "Laminated core", type: "custom-mesh", description: "Closed core guides alternating flux.", position: [0, 0, 0], materialRole: "metal", boundParameterIds: ["coupling"] },
      { id: "flux-lines", name: "Alternating magnetic flux", type: "field-line", description: "Changing flux in the core.", position: [0, 0.4, 0], materialRole: "field", boundParameterIds: ["B", "f"] },
      { id: "load", name: "Load R", type: "sphere", description: "Output load receives secondary current.", position: [2.55, -1.15, 0.75], materialRole: "glass", boundParameterIds: ["R", "I"] },
      { id: "current-arrows", name: "AC current arrows", type: "arrow", description: "Current alternates in primary and secondary circuits.", position: [0, -1.1, 0.8], materialRole: "electron", boundParameterIds: ["I"] }
    ],
    camera: {
      defaultPosition: [4.4, 2.8, 5],
      target: [0, -0.25, 0],
      allowOrbit: true,
      allowZoom: true,
      allowPan: true
    },
    lights: [
      { type: "ambient", intensity: 0.8 },
      { type: "directional", intensity: 1.4, position: [4, 5, 5] }
    ],
    animationTracks: [
      { id: "flux-pulse", targetObjectId: "flux-lines", property: "scale", description: "Core flux pulses with AC phase." },
      { id: "load-brightness", targetObjectId: "load", property: "emissiveIntensity", description: "Load brightness follows output current." }
    ]
  },
  steps: [
    { id: "structure", order: 1, title: "Transformer structure", explanation: "A transformer has a primary coil, a magnetic core, a secondary coil and a load.", activeObjectIds: ["primary-coil", "iron-core", "secondary-coil", "load"], activeParameterIds: [], activeFormulaIds: [], animationAction: "show-structure" },
    { id: "input", order: 2, title: "AC drives the primary", explanation: "Alternating input voltage drives alternating current in the primary coil.", activeObjectIds: ["primary-coil", "current-arrows"], activeParameterIds: ["Vp", "Np", "f"], activeFormulaIds: ["turn-ratio"], animationAction: "move-current" },
    { id: "flux", order: 3, title: "Changing flux in the core", explanation: "The magnetic core carries changing flux from the primary to the secondary coil.", activeObjectIds: ["iron-core", "flux-lines"], activeParameterIds: ["B", "f", "coupling"], activeFormulaIds: ["faraday"], animationAction: "show-magnetic-field" },
    { id: "output", order: 4, title: "Secondary voltage appears", explanation: "The secondary voltage scales with the turn ratio: more secondary turns give a larger output voltage.", activeObjectIds: ["secondary-coil", "load"], activeParameterIds: ["Vs", "Ns", "R", "I"], activeFormulaIds: ["turn-ratio", "current"], animationAction: "show-induced-voltage" },
    { id: "compare", order: 5, title: "Step-up or step-down", explanation: "If Ns is greater than Np, voltage steps up. If Ns is smaller than Np, voltage steps down.", activeObjectIds: ["primary-coil", "secondary-coil"], activeParameterIds: ["Np", "Ns", "Vp", "Vs"], activeFormulaIds: ["turn-ratio"], animationAction: "compare-2d-3d" },
    { id: "failure", order: 6, title: "Failure states", explanation: "Open secondary, weak coupling or no AC input reduces or removes output.", activeObjectIds: ["primary-coil", "iron-core", "secondary-coil", "load"], activeParameterIds: ["Vp", "coupling", "R"], activeFormulaIds: ["current"], animationAction: "show-failure-state" }
  ],
  annotations: [
    { id: "ann-vp", objectId: "primary-coil", title: "Vp - AC input", body: "The primary must receive changing voltage to create changing flux.", colorRole: "input" },
    { id: "ann-core", objectId: "iron-core", title: "Core coupling", body: "Better coupling transfers more flux to the secondary coil.", colorRole: "process" },
    { id: "ann-ratio", objectId: "secondary-coil", title: "Ns / Np", body: "Turn ratio controls ideal voltage ratio.", colorRole: "measurement" },
    { id: "ann-load", objectId: "load", title: "R - load", body: "Load resistance controls secondary current.", colorRole: "output" }
  ],
  parameters: [
    { id: "Vp", symbol: "Vp", name: "Primary voltage", unit: "V", description: "AC input voltage on the primary coil.", objectId: "primary-coil", objectProperty: "input amplitude", effect: "Higher Vp raises secondary voltage proportionally.", defaultValue: 12, min: 0, max: 48, step: 1 },
    { id: "Np", symbol: "Np", name: "Primary turns", unit: "turns", description: "Turns in the primary coil.", objectId: "primary-coil", objectProperty: "turn count", effect: "Higher Np lowers Vs for fixed Ns.", defaultValue: 20, min: 4, max: 80, step: 1 },
    { id: "Ns", symbol: "Ns", name: "Secondary turns", unit: "turns", description: "Turns in the secondary coil.", objectId: "secondary-coil", objectProperty: "turn count", effect: "Higher Ns raises Vs for fixed Np.", defaultValue: 40, min: 4, max: 120, step: 1 },
    { id: "f", symbol: "f", name: "AC frequency", unit: "Hz", description: "How quickly input polarity changes.", objectId: "flux-lines", objectProperty: "pulse speed", effect: "Higher frequency makes field/current animation cycle faster.", defaultValue: 2, min: 0, max: 6, step: 0.1 },
    { id: "coupling", symbol: "k", name: "Core coupling", unit: "ratio", description: "Educational efficiency of flux transfer.", objectId: "iron-core", objectProperty: "flux coupling", effect: "Weak coupling reduces secondary output.", defaultValue: 0.92, min: 0.1, max: 1, step: 0.01 },
    { id: "R", symbol: "R", name: "Load resistance", unit: "ohm", description: "Resistance connected to the secondary.", objectId: "load", objectProperty: "load current", effect: "Higher R lowers output current.", defaultValue: 12, min: 2, max: 50, step: 1 }
  ],
  formulas: [
    { id: "turn-ratio", latex: "\\frac{V_s}{V_p}\\approx\\frac{N_s}{N_p}", description: "Ideal transformer voltage ratio.", parameterIds: ["Vp", "Np", "Ns"], outputObjectId: "secondary-coil" },
    { id: "faraday", latex: "\\varepsilon=-N\\frac{d\\Phi}{dt}", description: "Each coil follows Faraday induction.", parameterIds: ["Np", "Ns", "f"], outputObjectId: "flux-lines" },
    { id: "current", latex: "I_s=\\frac{V_s}{R}", description: "Secondary current depends on load resistance.", parameterIds: ["R"], outputObjectId: "load" }
  ],
  interactionModes: {
    orbit: true,
    zoom: true,
    pan: true,
    explode: true,
    cutaway: true,
    stepMode: true,
    playAnimation: true
  },
  educationalNotes: {
    simplifiedAssumptions: [
      "This is an educational transformer model using an ideal voltage ratio with a coupling factor.",
      "It does not model core saturation, heat, hysteresis, leakage inductance or real insulation design."
    ],
    realWorldLimitations: [
      "Real transformers require detailed electrical safety engineering and certified insulation.",
      "This simulation is not a guide for building or wiring transformer hardware."
    ],
    safetyNotice: "Safe conceptual simulation only. It does not provide high-voltage construction or wiring instructions."
  }
};
