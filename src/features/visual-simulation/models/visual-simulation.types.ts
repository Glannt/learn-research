export type VisualSubject = "physics" | "chemistry";

export type ColorRole = "input" | "process" | "output" | "warning" | "measurement";

export type VisualSimulation = {
  id: string;
  slug: string;
  title: string;
  subject: VisualSubject;
  category:
    | "electricity"
    | "magnetism"
    | "mechanics"
    | "thermodynamics"
    | "optics"
    | "atomic"
    | "molecular"
    | "reaction"
    | "historical-experiment";
  visualStyle: "bytebytego-inspired" | "technical-diagram" | "realistic-3d" | "hybrid";
  diagram2D: Diagram2DConfig;
  model3D: Model3DConfig;
  steps: VisualSimulationStep[];
  annotations: VisualAnnotation[];
  parameters: VisualParameterBinding[];
  formulas: VisualFormulaBinding[];
  interactionModes: {
    orbit: boolean;
    zoom: boolean;
    pan: boolean;
    explode: boolean;
    cutaway: boolean;
    stepMode: boolean;
    playAnimation: boolean;
  };
  educationalNotes: {
    simplifiedAssumptions: string[];
    realWorldLimitations: string[];
    safetyNotice?: string;
  };
};

export type Diagram2DConfig = {
  layout: "left-to-right" | "top-down" | "radial" | "split-panel" | "timeline";
  objects: DiagramObject2D[];
  arrows: DiagramArrow[];
  labels: DiagramLabel[];
  layers: DiagramLayer[];
};

export type DiagramObject2D = {
  id: string;
  type:
    | "magnet"
    | "coil"
    | "rotor"
    | "stator"
    | "slip-ring"
    | "brush"
    | "wire"
    | "lamp"
    | "battery"
    | "switch"
    | "wave-chart"
    | "atom"
    | "molecule"
    | "beaker"
    | "particle"
    | "force-vector"
    | "field-line"
    | "measurement-device"
    | "custom";
  label: string;
  description: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  colorRole?: ColorRole;
  boundParameterIds?: string[];
};

export type DiagramArrow = {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
  colorRole?: ColorRole;
  dashed?: boolean;
};

export type DiagramLabel = {
  id: string;
  text: string;
  position: { x: number; y: number };
  targetObjectId?: string;
  colorRole?: ColorRole;
};

export type DiagramLayer = {
  id: string;
  title: string;
  description: string;
  objectIds: string[];
};

export type Model3DConfig = {
  sceneType:
    | "ac-generator"
    | "faraday-induction"
    | "dc-motor"
    | "transformer"
    | "induction-motor"
    | "pendulum"
    | "car-motion"
    | "ideal-gas"
    | "molecule"
    | "reaction-vessel"
    | "atomic-model"
    | "historical-lab";
  objects: Model3DObject[];
  camera: {
    defaultPosition: [number, number, number];
    target: [number, number, number];
    allowOrbit: boolean;
    allowZoom: boolean;
    allowPan: boolean;
  };
  lights: {
    type: "ambient" | "directional" | "point";
    intensity: number;
    position?: [number, number, number];
  }[];
  animationTracks: AnimationTrack[];
};

export type Model3DObject = {
  id: string;
  name: string;
  type:
    | "box"
    | "sphere"
    | "cylinder"
    | "torus"
    | "coil"
    | "magnet"
    | "wire"
    | "arrow"
    | "field-line"
    | "wave"
    | "particle"
    | "label-anchor"
    | "custom-mesh";
  description: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  materialRole?: "metal" | "copper" | "magnet-north" | "magnet-south" | "plastic" | "glass" | "liquid" | "gas" | "field" | "electron";
  boundParameterIds?: string[];
  states?: {
    idle?: Record<string, unknown>;
    active?: Record<string, unknown>;
    failed?: Record<string, unknown>;
    success?: Record<string, unknown>;
    exploded?: Record<string, unknown>;
    cutaway?: Record<string, unknown>;
  };
};

export type AnimationTrack = {
  id: string;
  targetObjectId: string;
  property: "rotation" | "position" | "scale" | "visibility" | "emissiveIntensity";
  description: string;
};

export type VisualSimulationStep = {
  id: string;
  order: number;
  title: string;
  explanation: string;
  activeObjectIds: string[];
  activeParameterIds: string[];
  activeFormulaIds: string[];
  cameraFocusObjectId?: string;
  animationAction:
    | "show-structure"
    | "start-rotation"
    | "move-current"
    | "show-magnetic-field"
    | "show-induced-voltage"
    | "show-wave-output"
    | "show-failure-state"
    | "show-success-state"
    | "explode-view"
    | "cutaway-view"
    | "compare-2d-3d"
    | "derive-formula";
};

export type VisualAnnotation = {
  id: string;
  objectId: string;
  title: string;
  body: string;
  colorRole?: ColorRole;
};

export type VisualParameterBinding = {
  id: string;
  symbol: string;
  name: string;
  unit: string;
  description: string;
  objectId: string;
  objectProperty: string;
  effect: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
};

export type VisualFormulaBinding = {
  id: string;
  latex: string;
  description: string;
  parameterIds: string[];
  outputObjectId: string;
};
