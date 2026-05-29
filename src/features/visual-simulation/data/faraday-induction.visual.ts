import type { VisualSimulation } from "@/features/visual-simulation/models/visual-simulation.types";

export const faradayInductionVisual: VisualSimulation = {
  id: "visual-faraday-induction",
  slug: "faraday-induction",
  title: "Faraday Induction / Cam ung dien tu",
  subject: "physics",
  category: "magnetism",
  visualStyle: "bytebytego-inspired",
  diagram2D: {
    layout: "left-to-right",
    objects: [
      { id: "moving-magnet", type: "magnet", label: "Moving magnet", description: "Motion changes flux through the coil.", position: { x: 96, y: 210 }, colorRole: "input", boundParameterIds: ["v", "B"] },
      { id: "coil", type: "coil", label: "Coil", description: "Turns collect the changing flux.", position: { x: 330, y: 210 }, colorRole: "process", boundParameterIds: ["N", "A"] },
      { id: "galvanometer", type: "measurement-device", label: "Galvanometer", description: "Needle deflects when current flows.", position: { x: 626, y: 196 }, colorRole: "measurement", boundParameterIds: ["I"] },
      { id: "wire-loop", type: "wire", label: "Closed circuit", description: "Current needs a complete path.", position: { x: 492, y: 280 }, colorRole: "output", boundParameterIds: ["R"] }
    ],
    arrows: [
      { id: "magnet-motion", from: { x: 160, y: 210 }, to: { x: 260, y: 210 }, label: "v", colorRole: "warning" },
      { id: "flux-change", from: { x: 230, y: 150 }, to: { x: 350, y: 170 }, label: "dPhi/dt", colorRole: "process" },
      { id: "current-flow", from: { x: 410, y: 278 }, to: { x: 590, y: 278 }, label: "I", colorRole: "output" }
    ],
    labels: [
      { id: "cause-effect", text: "Magnet motion changes flux, Faraday law creates induced voltage, the closed circuit carries current.", position: { x: 54, y: 42 }, colorRole: "process" }
    ],
    layers: [
      { id: "structure", title: "Structure", description: "Moving magnet, coil, circuit wires and galvanometer.", objectIds: ["moving-magnet", "coil", "galvanometer", "wire-loop"] },
      { id: "flux", title: "Flux change", description: "Flux changes only when magnet position or field strength changes.", objectIds: ["moving-magnet", "coil"] },
      { id: "output", title: "Output", description: "Induced current deflects the meter needle.", objectIds: ["galvanometer", "wire-loop"] }
    ]
  },
  model3D: {
    sceneType: "faraday-induction",
    objects: [
      { id: "moving-magnet", name: "Moving bar magnet", type: "magnet", description: "Magnet moves toward and away from the coil.", position: [-1.9, 0, 0], scale: [0.9, 0.35, 0.35], materialRole: "magnet-north", boundParameterIds: ["v", "B"] },
      { id: "coil", name: "Copper coil", type: "coil", description: "Coil turns receive changing magnetic flux.", position: [0.4, 0, 0], materialRole: "copper", boundParameterIds: ["N", "A"] },
      { id: "field-lines", name: "Magnetic field lines", type: "field-line", description: "Field lines pass through the coil.", position: [-0.7, 0, 0], materialRole: "field", boundParameterIds: ["B"] },
      { id: "current-arrows", name: "Induced current arrows", type: "arrow", description: "Direction flips when magnet motion reverses.", position: [0, -1.2, 0.9], materialRole: "electron", boundParameterIds: ["I"] },
      { id: "galvanometer", name: "Galvanometer", type: "custom-mesh", description: "Needle deflection shows induced current.", position: [2.35, -1.1, 0.7], materialRole: "plastic", boundParameterIds: ["I"] },
      { id: "external-wire", name: "External wire", type: "wire", description: "Closed path for current.", position: [1.35, -1.1, 0.6], materialRole: "metal", boundParameterIds: ["R"] }
    ],
    camera: {
      defaultPosition: [4.2, 2.6, 4.8],
      target: [0.3, -0.25, 0],
      allowOrbit: true,
      allowZoom: true,
      allowPan: true
    },
    lights: [
      { type: "ambient", intensity: 0.8 },
      { type: "directional", intensity: 1.35, position: [4, 5, 5] }
    ],
    animationTracks: [
      { id: "magnet-motion", targetObjectId: "moving-magnet", property: "position", description: "Magnet moves in and out of the coil." },
      { id: "meter-needle", targetObjectId: "galvanometer", property: "rotation", description: "Meter needle follows induced current." }
    ]
  },
  steps: [
    { id: "structure", order: 1, title: "Build the structure", explanation: "The setup has a bar magnet, a coil, a closed wire path and a galvanometer.", activeObjectIds: ["moving-magnet", "coil", "external-wire", "galvanometer"], activeParameterIds: [], activeFormulaIds: [], animationAction: "show-structure" },
    { id: "flux", order: 2, title: "Change magnetic flux", explanation: "Moving the magnet changes the magnetic flux through the coil. A stationary magnet creates no sustained induced current.", activeObjectIds: ["moving-magnet", "field-lines", "coil"], activeParameterIds: ["v", "B", "A"], activeFormulaIds: ["flux"], animationAction: "show-magnetic-field" },
    { id: "voltage", order: 3, title: "Faraday law creates voltage", explanation: "The induced voltage is proportional to the rate of flux change and the number of coil turns.", activeObjectIds: ["coil", "field-lines"], activeParameterIds: ["N", "dPhi"], activeFormulaIds: ["faraday"], animationAction: "show-induced-voltage" },
    { id: "current", order: 4, title: "Current flows in the closed circuit", explanation: "If the circuit is closed, induced voltage drives current and the meter needle deflects.", activeObjectIds: ["external-wire", "current-arrows", "galvanometer"], activeParameterIds: ["I", "R"], activeFormulaIds: ["current"], animationAction: "move-current" },
    { id: "reverse", order: 5, title: "Reverse motion reverses current", explanation: "When the magnet moves away instead of toward the coil, dPhi/dt changes sign, so current reverses.", activeObjectIds: ["moving-magnet", "current-arrows", "galvanometer"], activeParameterIds: ["v", "I"], activeFormulaIds: ["faraday"], animationAction: "show-wave-output" },
    { id: "failure", order: 6, title: "Failure states", explanation: "No magnet motion, an open circuit or weak field reduces or removes output.", activeObjectIds: ["moving-magnet", "external-wire", "galvanometer"], activeParameterIds: ["v", "B", "R"], activeFormulaIds: ["current"], animationAction: "show-failure-state" }
  ],
  annotations: [
    { id: "ann-v", objectId: "moving-magnet", title: "v - magnet speed", body: "Faster motion means flux changes faster.", colorRole: "warning" },
    { id: "ann-b", objectId: "field-lines", title: "B - field strength", body: "Stronger field increases flux through the coil.", colorRole: "input" },
    { id: "ann-n", objectId: "coil", title: "N - coil turns", body: "More turns multiply induced voltage.", colorRole: "process" },
    { id: "ann-r", objectId: "external-wire", title: "R - circuit resistance", body: "Higher resistance reduces current.", colorRole: "output" }
  ],
  parameters: [
    { id: "v", symbol: "v", name: "Magnet speed", unit: "m/s", description: "How fast the magnet moves relative to the coil.", objectId: "moving-magnet", objectProperty: "oscillation speed", effect: "Higher speed increases dPhi/dt and induced voltage.", defaultValue: 1.4, min: 0, max: 4, step: 0.1 },
    { id: "B", symbol: "B", name: "Magnetic field strength", unit: "T", description: "Strength of the bar magnet field.", objectId: "field-lines", objectProperty: "field density", effect: "Higher B increases flux and output amplitude.", defaultValue: 1, min: 0, max: 2.5, step: 0.05 },
    { id: "N", symbol: "N", name: "Coil turns", unit: "turns", description: "Number of wire turns in the coil.", objectId: "coil", objectProperty: "turn count", effect: "More turns increase induced voltage.", defaultValue: 18, min: 1, max: 60, step: 1 },
    { id: "A", symbol: "A", name: "Coil area", unit: "m^2", description: "Effective area enclosed by the coil.", objectId: "coil", objectProperty: "coil radius", effect: "Larger area increases magnetic flux.", defaultValue: 0.06, min: 0.02, max: 0.14, step: 0.01 },
    { id: "R", symbol: "R", name: "Circuit resistance", unit: "ohm", description: "Resistance of the external circuit and meter.", objectId: "external-wire", objectProperty: "current scale", effect: "Higher R reduces current for the same induced voltage.", defaultValue: 6, min: 1, max: 25, step: 0.5 }
  ],
  formulas: [
    { id: "flux", latex: "\\Phi = BA\\cos(\\theta)", description: "Flux through the coil depends on field, area and orientation.", parameterIds: ["B", "A"], outputObjectId: "coil" },
    { id: "faraday", latex: "\\varepsilon = -N\\frac{d\\Phi}{dt}", description: "Changing flux induces voltage.", parameterIds: ["N", "v", "B", "A"], outputObjectId: "coil" },
    { id: "current", latex: "I=\\frac{\\varepsilon}{R}", description: "Current appears only when a circuit path exists.", parameterIds: ["R"], outputObjectId: "galvanometer" }
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
      "The magnet motion is modeled as smooth back-and-forth motion along the coil axis.",
      "The output uses an educational approximation: epsilon scales with N, B, A and magnet speed."
    ],
    realWorldLimitations: [
      "Real induction depends on detailed field geometry, coil shape, core material and circuit impedance.",
      "This simulation is not construction guidance for electrical equipment."
    ],
    safetyNotice: "Safe conceptual simulation only. It does not provide instructions for building or wiring real electrical devices."
  }
};
