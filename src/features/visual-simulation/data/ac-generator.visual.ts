import type { VisualSimulation } from "@/features/visual-simulation/models/visual-simulation.types";

export const acGeneratorVisual: VisualSimulation = {
  id: "visual-ac-generator",
  slug: "ac-generator",
  title: "AC Generator / May phat dien xoay chieu",
  subject: "physics",
  category: "electricity",
  visualStyle: "bytebytego-inspired",
  diagram2D: {
    layout: "split-panel",
    objects: [
      { id: "magnet-n", type: "magnet", label: "N magnet", description: "North pole creates the B field toward S.", position: { x: 96, y: 128 }, size: { width: 92, height: 156 }, colorRole: "input", boundParameterIds: ["B"] },
      { id: "magnet-s", type: "magnet", label: "S magnet", description: "South pole receives magnetic field lines.", position: { x: 394, y: 128 }, size: { width: 92, height: 156 }, colorRole: "input", boundParameterIds: ["B"] },
      { id: "rotating-coil", type: "coil", label: "Rotating coil", description: "The loop turns so magnetic flux changes.", position: { x: 238, y: 154 }, size: { width: 120, height: 102 }, colorRole: "process", boundParameterIds: ["A", "N", "omega"] },
      { id: "slip-rings", type: "slip-ring", label: "Slip rings", description: "Keep coil ends connected while the coil rotates.", position: { x: 300, y: 286 }, size: { width: 88, height: 42 }, colorRole: "process" },
      { id: "brushes", type: "brush", label: "Brushes", description: "Touch the slip rings and carry current to the external circuit.", position: { x: 294, y: 344 }, size: { width: 110, height: 32 }, colorRole: "process" },
      { id: "lamp", type: "lamp", label: "Lamp / load R", description: "Brightness shows current through the load.", position: { x: 578, y: 248 }, size: { width: 86, height: 86 }, colorRole: "output", boundParameterIds: ["R", "I"] },
      { id: "wave-chart", type: "wave-chart", label: "AC waveform", description: "Sine wave synchronized with coil angle.", position: { x: 536, y: 74 }, size: { width: 200, height: 118 }, colorRole: "measurement", boundParameterIds: ["epsilon", "I"] }
    ],
    arrows: [
      { id: "field-flow", from: { x: 188, y: 205 }, to: { x: 394, y: 205 }, label: "B", colorRole: "input" },
      { id: "rotation-flow", from: { x: 254, y: 118 }, to: { x: 342, y: 150 }, label: "omega", colorRole: "warning", dashed: true },
      { id: "current-to-lamp", from: { x: 355, y: 360 }, to: { x: 578, y: 292 }, label: "I(t)", colorRole: "output" },
      { id: "chart-link", from: { x: 358, y: 154 }, to: { x: 536, y: 124 }, label: "epsilon(t)", colorRole: "measurement" }
    ],
    labels: [
      { id: "cause-effect", text: "Mechanical rotation -> changing flux -> induced voltage -> alternating current -> lamp output", position: { x: 72, y: 34 }, colorRole: "process" }
    ],
    layers: [
      { id: "structure", title: "Structure", description: "Magnets, coil, slip rings, brushes and external load.", objectIds: ["magnet-n", "magnet-s", "rotating-coil", "slip-rings", "brushes", "lamp"] },
      { id: "field", title: "Magnetic field", description: "Field lines run from N to S through the coil region.", objectIds: ["magnet-n", "magnet-s"] },
      { id: "output", title: "Output", description: "Sine chart and lamp brightness show AC output.", objectIds: ["wave-chart", "lamp"] }
    ]
  },
  model3D: {
    sceneType: "ac-generator",
    objects: [
      { id: "magnet-n", name: "N magnet", type: "magnet", description: "Rectangular north pole magnet.", position: [-2.25, 0, 0], scale: [0.65, 1.7, 1.05], materialRole: "magnet-north", boundParameterIds: ["B"] },
      { id: "magnet-s", name: "S magnet", type: "magnet", description: "Rectangular south pole magnet.", position: [2.25, 0, 0], scale: [0.65, 1.7, 1.05], materialRole: "magnet-south", boundParameterIds: ["B"] },
      { id: "rotating-coil", name: "Rotating copper coil", type: "coil", description: "Coil rotates in the magnetic field.", position: [0, 0, 0], materialRole: "copper", boundParameterIds: ["A", "N", "omega"] },
      { id: "slip-ring-1", name: "Slip ring 1", type: "torus", description: "Conductive ring connected to one side of the coil.", position: [0, -1.05, -0.34], materialRole: "copper" },
      { id: "slip-ring-2", name: "Slip ring 2", type: "torus", description: "Conductive ring connected to the other side of the coil.", position: [0, -1.05, 0.34], materialRole: "copper" },
      { id: "brush-1", name: "Brush 1", type: "box", description: "Carbon brush touching slip ring.", position: [-0.42, -1.46, -0.34], materialRole: "plastic" },
      { id: "brush-2", name: "Brush 2", type: "box", description: "Carbon brush touching slip ring.", position: [0.42, -1.46, 0.34], materialRole: "plastic" },
      { id: "external-wire", name: "External wire", type: "wire", description: "Circuit path from brushes to the lamp/load.", position: [0, -1.7, 1.1], materialRole: "metal", boundParameterIds: ["I"] },
      { id: "lamp", name: "Lamp / load R", type: "sphere", description: "Load brightness follows current magnitude.", position: [0, -2.2, 1.75], materialRole: "glass", boundParameterIds: ["R", "I"] },
      { id: "field-lines", name: "Magnetic field lines", type: "field-line", description: "Field direction from N to S.", position: [0, 0, 0], materialRole: "field", boundParameterIds: ["B"] },
      { id: "current-arrows", name: "Alternating current arrows", type: "arrow", description: "Current reverses after each half turn.", position: [0, 0, 0], materialRole: "electron", boundParameterIds: ["I"] },
      { id: "rotation-arrow", name: "Rotation arrow", type: "arrow", description: "Shows mechanical rotation omega.", position: [0, 1.15, 0], materialRole: "field", boundParameterIds: ["omega"] },
      { id: "wave-chart-panel", name: "AC waveform panel", type: "wave", description: "Sine output synced with coil angle.", position: [2.8, 1.4, -1.2], materialRole: "field", boundParameterIds: ["epsilon", "I"] },
      { id: "coil-position-indicator", name: "Coil position indicator", type: "label-anchor", description: "Maps current coil angle to waveform phase.", position: [-1.2, 1.3, 1.2], materialRole: "plastic", boundParameterIds: ["omega"] }
    ],
    camera: {
      defaultPosition: [4.2, 3.0, 5.2],
      target: [0, -0.45, 0],
      allowOrbit: true,
      allowZoom: true,
      allowPan: true
    },
    lights: [
      { type: "ambient", intensity: 0.8 },
      { type: "directional", intensity: 1.4, position: [4, 5, 5] },
      { type: "point", intensity: 0.8, position: [-3, 3, -2] }
    ],
    animationTracks: [
      { id: "coil-rotation", targetObjectId: "rotating-coil", property: "rotation", description: "Coil rotates around its axis." },
      { id: "lamp-brightness", targetObjectId: "lamp", property: "emissiveIntensity", description: "Lamp glow follows |I(t)|." },
      { id: "current-direction", targetObjectId: "current-arrows", property: "rotation", description: "Current arrows reverse every half turn." }
    ]
  },
  steps: [
    { id: "structure", order: 1, title: "Generator structure", explanation: "N/S magnets create the field. The rotating coil connects to slip rings, brushes, wires and the lamp/load.", activeObjectIds: ["magnet-n", "magnet-s", "rotating-coil", "slip-ring-1", "slip-ring-2", "brush-1", "brush-2", "lamp"], activeParameterIds: [], activeFormulaIds: [], animationAction: "show-structure" },
    { id: "field", order: 2, title: "B field from N to S", explanation: "Field lines cross the coil region. A stronger B field increases the induced voltage amplitude.", activeObjectIds: ["magnet-n", "magnet-s", "field-lines"], activeParameterIds: ["B"], activeFormulaIds: ["flux"], animationAction: "show-magnetic-field" },
    { id: "rotation", order: 3, title: "Coil rotates with omega", explanation: "As the coil turns, angle theta changes over time, so magnetic flux Phi = B A cos(theta) changes.", activeObjectIds: ["rotating-coil", "rotation-arrow", "coil-position-indicator"], activeParameterIds: ["omega", "A", "N"], activeFormulaIds: ["flux"], cameraFocusObjectId: "rotating-coil", animationAction: "start-rotation" },
    { id: "voltage", order: 4, title: "Induced voltage appears", explanation: "Faraday law says epsilon = -N dPhi/dt. Faster flux change creates larger induced voltage.", activeObjectIds: ["rotating-coil", "slip-ring-1", "slip-ring-2", "wave-chart-panel"], activeParameterIds: ["epsilon", "N", "B", "A", "omega"], activeFormulaIds: ["faraday", "sinusoidal"], animationAction: "show-induced-voltage" },
    { id: "current", order: 5, title: "AC current reverses", explanation: "Brushes carry current to the external circuit. After a half turn the current direction reverses and the waveform is sinusoidal.", activeObjectIds: ["brush-1", "brush-2", "current-arrows", "external-wire", "lamp"], activeParameterIds: ["I", "R"], activeFormulaIds: ["current"], animationAction: "move-current" },
    { id: "failure", order: 6, title: "Failure states", explanation: "If the coil stops, a brush disconnects, or the field is weak, the output is reduced or lost.", activeObjectIds: ["rotating-coil", "brush-1", "brush-2", "lamp"], activeParameterIds: ["B", "omega", "R"], activeFormulaIds: ["sinusoidal", "current"], animationAction: "show-failure-state" }
  ],
  annotations: [
    { id: "ann-b", objectId: "field-lines", title: "B - magnetic field", body: "Bound to the density of field lines between N and S.", colorRole: "input" },
    { id: "ann-omega", objectId: "rotating-coil", title: "omega - rotation speed", body: "Bound to coil spin and the orange rotation arrow.", colorRole: "warning" },
    { id: "ann-n", objectId: "rotating-coil", title: "N - coil turns", body: "More turns multiply the induced voltage in Faraday's law.", colorRole: "process" },
    { id: "ann-r", objectId: "lamp", title: "R - load resistance", body: "The load controls current by I = epsilon / R.", colorRole: "output" }
  ],
  parameters: [
    { id: "omega", symbol: "omega", name: "Rotation speed", unit: "rad/s", description: "Angular speed of the rotating coil.", objectId: "rotating-coil", objectProperty: "rotation speed", effect: "Higher omega increases AC frequency and induced voltage amplitude in this educational model.", defaultValue: 2.2, min: 0, max: 8, step: 0.1 },
    { id: "B", symbol: "B", name: "Magnetic field strength", unit: "T", description: "Field strength between the N/S magnets.", objectId: "field-lines", objectProperty: "field density", effect: "Higher B raises the waveform amplitude and lamp brightness.", defaultValue: 1.0, min: 0, max: 2.5, step: 0.05 },
    { id: "N", symbol: "N", name: "Coil turns", unit: "turns", description: "Number of turns in the coil.", objectId: "rotating-coil", objectProperty: "coil turns", effect: "More turns increase induced voltage amplitude.", defaultValue: 12, min: 1, max: 40, step: 1 },
    { id: "A", symbol: "A", name: "Coil area", unit: "m^2", description: "Effective loop area of the coil.", objectId: "rotating-coil", objectProperty: "coil area", effect: "Larger area increases magnetic flux and induced voltage.", defaultValue: 0.08, min: 0.02, max: 0.16, step: 0.01 },
    { id: "R", symbol: "R", name: "Load resistance", unit: "ohm", description: "Resistance of the lamp/load.", objectId: "lamp", objectProperty: "load resistance", effect: "Higher R reduces current I for the same induced voltage.", defaultValue: 8, min: 2, max: 30, step: 0.5 }
  ],
  formulas: [
    { id: "flux", latex: "\\Phi = BA\\cos(\\theta)", description: "Flux through the coil depends on B, A and angle theta.", parameterIds: ["B", "A"], outputObjectId: "rotating-coil" },
    { id: "faraday", latex: "\\varepsilon = -N\\frac{d\\Phi}{dt}", description: "Changing flux creates induced voltage.", parameterIds: ["N"], outputObjectId: "slip-ring-1" },
    { id: "sinusoidal", latex: "\\varepsilon(t) \\approx NBA\\omega\\sin(\\omega t)", description: "Educational sine approximation for AC output.", parameterIds: ["N", "B", "A", "omega"], outputObjectId: "wave-chart-panel" },
    { id: "current", latex: "I(t)=\\frac{\\varepsilon(t)}{R}", description: "Load current depends on induced voltage and resistance.", parameterIds: ["R"], outputObjectId: "lamp" }
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
      "The model uses a simplified sine equation for one uniformly rotating coil.",
      "It does not simulate mechanical loss, core saturation or detailed material behavior."
    ],
    realWorldLimitations: [
      "Real generators have more poles, magnetic cores, insulation and control systems.",
      "This simulation is not construction guidance for real electrical equipment."
    ],
    safetyNotice: "Safe educational simulation only. It does not provide instructions for building or wiring a real generator."
  }
};
