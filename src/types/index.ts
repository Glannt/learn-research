export type SubjectKey = "physics" | "chemistry";
export type Difficulty = "easy" | "medium" | "hard";
export type ChapterLevel = "basic" | "intermediate" | "advanced" | "application";

export type Subject = {
  id: string;
  name: string;
  slug: SubjectKey;
  description: string;
  accent: string;
};

export type Chapter = {
  id: string;
  subjectId: SubjectKey;
  title: string;
  slug: string;
  level: ChapterLevel;
  order: number;
  summary: string;
};

export type Lesson = {
  id: string;
  chapterId: string;
  subject: SubjectKey;
  title: string;
  slug: string;
  summary: string;
  content: string;
  formulas: string[];
  simulations: string[];
  exercises: string[];
  level: ChapterLevel;
  durationMinutes: number;
};

export type FormulaVariable = {
  symbol: string;
  name: string;
  unit: string;
  description: string;
};

export type CalculatorInput = {
  key: string;
  label: string;
  unit?: string;
  defaultValue: number;
};

export type CalculatorConfig = {
  inputs: CalculatorInput[];
  outputKey: string;
  outputLabel: string;
  outputUnit?: string;
  operationId: string;
};

export type FormulaExample = {
  problem: string;
  solution: string;
};

export type Formula = {
  id: string;
  slug: string;
  subject: SubjectKey;
  name: string;
  latex: string;
  description: string;
  variables: FormulaVariable[];
  unit?: string;
  usage: string;
  examples: FormulaExample[];
  calculatorConfig?: CalculatorConfig;
  relatedSimulationId?: string;
};

export type FormulaParameter = {
  symbol: string;
  name: string;
  role: "input" | "output" | "constant" | "intermediate";
  unit: string;
  unitName: string;
  description: string;
  physicalMeaning?: string;
  chemicalMeaning?: string;
  allowedRange?: {
    min?: number;
    max?: number;
    note?: string;
  };
  visualBinding?: {
    objectId: string;
    property: string;
    label: string;
    highlightColor?: string;
  };
  commonMistakes?: string[];
};

export type FormulaConstant = {
  symbol: string;
  name: string;
  value: string;
  unit?: string;
  description: string;
};

export type UnitRule = {
  parameterSymbol: string;
  expectedUnit: string;
  note: string;
};

export type FormulaVisualMapping = {
  formulaId: string;
  parameterSymbol: string;
  visualObjectId: string;
  visualObjectName: string;
  visualProperty:
    | "position"
    | "distance"
    | "time"
    | "speed"
    | "acceleration"
    | "force"
    | "mass"
    | "temperature"
    | "pressure"
    | "volume"
    | "amount"
    | "concentration"
    | "charge"
    | "bond"
    | "electron"
    | "molecule-count"
    | "energy";
  explanation: string;
  annotationPosition?: {
    x: number;
    y: number;
  };
};

export type FormulaExampleApplication = {
  title: string;
  given: Record<string, number | string>;
  steps: string[];
  result: string;
};

export type FormulaDetail = {
  id: string;
  subject: SubjectKey;
  name: string;
  slug: string;
  latex: string;
  plainText: string;
  shortMeaning: string;
  fullExplanation: string;
  usedWhen: string[];
  notUsedWhen?: string[];
  assumptions?: string[];
  limitations?: string[];
  variables: FormulaParameter[];
  inputParameters: FormulaParameter[];
  outputParameters: FormulaParameter[];
  constants?: FormulaConstant[];
  unitRules: UnitRule[];
  visualMappings: FormulaVisualMapping[];
  exampleApplications: FormulaExampleApplication[];
  relatedLessonIds: string[];
  relatedInlineLabIds: string[];
  relatedSimulationLabIds: string[];
};

export type SimulationType =
  | "pendulum"
  | "kinematics"
  | "newton-law"
  | "ac-generator"
  | "faraday-induction"
  | "transformer"
  | "conceptual-physics"
  | "ideal-gas"
  | "atom-model"
  | "chemical-bonding"
  | "molecule-viewer"
  | "reaction-temperature"
  | "reaction-sandbox"
  | "solution-concentration";

export type SimulationParameter = {
  key: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
};

export type Simulation = {
  id: string;
  slug: string;
  subject: SubjectKey;
  title: string;
  type: SimulationType;
  dimension: "2D" | "3D";
  level: ChapterLevel;
  description: string;
  safetyNote?: string;
  parameters: SimulationParameter[];
};

export type Exercise = {
  id: string;
  lessonId: string;
  subject: SubjectKey;
  type: "multiple-choice" | "short-answer" | "calculation" | "unit-choice" | "explain";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
};

export type ChemicalElement = {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  group: number;
  period: number;
  category: string;
  electronConfiguration: string;
  valenceElectrons: number;
};

export type MoleculeAtom = {
  element: string;
  position: [number, number, number];
};

export type MoleculeBond = {
  from: number;
  to: number;
  order: 1 | 2 | 3;
};

export type Molecule = {
  id: string;
  formula: string;
  name: string;
  bonding: string;
  bondAngle?: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
};

export type ChemicalSpecies = {
  id: string;
  formula: string;
  name: string;
  phase?: "solid" | "liquid" | "gas" | "aqueous";
  safetyNote?: string;
};

export type ChemicalBond = {
  from: string;
  to: string;
  order: 1 | 2 | 3;
};

export type ReactionSimulation = {
  id: string;
  name: string;
  reactants: ChemicalSpecies[];
  products: ChemicalSpecies[];
  equation: string;
  balancedEquation: string;
  requiredConditions?: {
    temperatureRange?: [number, number];
    pressureRange?: [number, number];
    catalyst?: string;
    light?: boolean;
  };
  bondChanges: {
    brokenBonds: ChemicalBond[];
    formedBonds: ChemicalBond[];
  };
  energyProfile: {
    type: "exothermic" | "endothermic";
    activationEnergy: number;
    deltaH: number;
  };
  safetyLevel: "safe-conceptual" | "school-safe" | "concept-only";
  explanation: string;
};

export type SimulationExerciseValidation = {
  expectedParameters?: Record<string, number | string>;
  tolerance?: Record<string, number>;
  expectedFormulaTokens?: string[];
  expectedUnits?: Record<string, string>;
  expectedOutcome?: {
    distance?: number;
    finalVelocity?: number;
    period?: number;
    moleculeFormula?: string;
    productFormula?: string[];
    balancedEquation?: string;
  };
};

export type InteractiveSimulationExercise = {
  id: string;
  simulationId: string;
  title: string;
  prompt: string;
  level: 1 | 2 | 3 | 4 | 5;
  requiredActions: string[];
  validation: SimulationExerciseValidation;
  explanation: string;
};

export type InlineLabObject = {
  id: string;
  type:
    | "car"
    | "road"
    | "clock"
    | "speedometer"
    | "ruler"
    | "pendulum"
    | "spring"
    | "block"
    | "force-arrow"
    | "gas-container"
    | "gas-particle"
    | "battery"
    | "wire"
    | "bulb"
    | "atom"
    | "electron"
    | "bond"
    | "molecule"
    | "beaker"
    | "solution"
    | "thermometer"
    | "pressure-gauge"
    | "ph-meter";
  label: string;
  description: string;
  boundParameters: string[];
  position: {
    x: number;
    y: number;
    z?: number;
  };
  visualProperties?: Record<string, unknown>;
};

export type InlineLabScene = {
  sceneId: string;
  title: string;
  objects: InlineLabObject[];
  formulaOverlayIds: string[];
  defaultCamera?: {
    zoom: number;
    x: number;
    y: number;
  };
};

export type LabParameterBinding = {
  parameterSymbol: string;
  parameterName: string;
  formulaId: string;
  sourceObjectId?: string;
  targetObjectId?: string;
  visualProperty: string;
  explanation: string;
  flowOrder: number;
};

export type InlineLabStep = {
  order: number;
  title: string;
  explanation: string;
  highlightObjectIds: string[];
  highlightParameterSymbols: string[];
  formulaFocus?: string;
  animationAction?:
    | "start-motion"
    | "measure-distance"
    | "measure-time"
    | "calculate-result"
    | "show-vector"
    | "show-energy-change"
    | "show-particle-motion"
    | "show-electron-transfer"
    | "show-electron-sharing"
    | "show-bond-formation"
    | "show-reaction-products";
};

export type LessonMiniExercise = {
  id: string;
  lessonId: string;
  relatedFormulaIds: string[];
  relatedInlineLabId?: string;
  title: string;
  prompt: string;
  exerciseType:
    | "observe-and-answer"
    | "fill-formula-parameter"
    | "choose-correct-unit"
    | "calculate-from-scene"
    | "identify-visual-parameter"
    | "predict-change"
    | "match-parameter-to-object"
    | "arrange-flow-steps";
  difficulty: Difficulty;
  sceneData?: {
    givenParameters: Record<string, number | string>;
    hiddenParameters: string[];
    visualObjectIds: string[];
  };
  expectedAnswer: {
    value?: number | string;
    unit?: string;
    parameterSymbol?: string;
    selectedObjectId?: string;
    orderedStepIds?: string[];
  };
  tolerance?: number;
  explanation: string;
};

export type LessonInlineLab = {
  id: string;
  lessonId: string;
  formulaIds: string[];
  title: string;
  description: string;
  labType:
    | "motion-flow"
    | "acceleration-flow"
    | "force-flow"
    | "pendulum-flow"
    | "spring-flow"
    | "heat-transfer-flow"
    | "ideal-gas-flow"
    | "electric-circuit-flow"
    | "atom-structure-flow"
    | "bonding-flow"
    | "molecule-formation-flow"
    | "reaction-flow"
    | "solution-concentration-flow"
    | "ph-scale-flow";
  mode: "guided-only" | "limited-control";
  visualScene: InlineLabScene;
  steps: InlineLabStep[];
  parameterBindings: LabParameterBinding[];
  miniExercise: LessonMiniExercise;
  relatedSimulationLabId?: string;
};

export type ScienceHistoryTopic = {
  id: string;
  subject: SubjectKey;
  title: string;
  scientistNames: string[];
  period: string;
  summary: string;
  discoveryQuestion: string;
  hypothesis: string;
  experimentSetup: string;
  observation: string;
  conclusion: string;
  formulaDerived?: string;
  relatedFormulaIds: string[];
  relatedSimulationIds: string[];
  visualType:
    | "inclined-plane"
    | "force-motion"
    | "spring-hooke"
    | "joule-heat"
    | "faraday-induction"
    | "mass-conservation"
    | "atomic-theory"
    | "periodic-table"
    | "gold-foil"
    | "bohr-model"
    | "lewis-bonding";
  mediaAssets?: {
    image?: string;
    model3d?: string;
    animation?: string;
  };
};

export type HistoricalSourceReference = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  author?: string;
  accessedAt?: string;
  sourceType:
    | "museum"
    | "encyclopedia"
    | "academic"
    | "university"
    | "official-organization"
    | "book"
    | "archive"
    | "paper"
    | "secondary-reference";
  reliability: "high" | "medium" | "low";
  notes: string;
};

export type GeneratedAssetPrompt = {
  imagePrompt: string;
  model3dPrompt: string;
  animationPrompt: string;
  negativePrompt?: string;
  historicalAccuracyNotes: string[];
};

export type HistoricalAnimationStep = {
  order: number;
  action:
    | "show-context"
    | "assemble-apparatus"
    | "run-failed-attempt"
    | "highlight-error"
    | "modify-setup"
    | "run-successful-attempt"
    | "show-measurement"
    | "show-observation"
    | "derive-conclusion"
    | "show-modern-version";
  description: string;
  affectedObjectIds: string[];
  visibleEffect: string;
};

export type HistoricalSceneObject = {
  id: string;
  name: string;
  type:
    | "scientist"
    | "notebook"
    | "coil"
    | "magnet"
    | "wire"
    | "battery"
    | "lamp"
    | "motor"
    | "generator"
    | "beaker"
    | "flask"
    | "balance"
    | "gas-jar"
    | "burner"
    | "thermometer"
    | "pressure-gauge"
    | "metal-sample"
    | "chemical-sample"
    | "atom"
    | "electron"
    | "molecule"
    | "lens"
    | "prism"
    | "spring"
    | "pendulum"
    | "ramp"
    | "unknown";
  description: string;
  historicalRole: string;
  visibleParameters?: string[];
  position?: {
    x: number;
    y: number;
    z?: number;
  };
  visualState?: Record<string, unknown>;
};

export type HistoricalSceneAnnotation = {
  id: string;
  objectId: string;
  label: string;
  explanation: string;
  sourceReferenceId?: string;
};

export type HistoricalVisualScene = {
  id: string;
  title: string;
  description: string;
  sceneType:
    | "laboratory-room"
    | "workbench"
    | "machine-prototype"
    | "chemical-bench"
    | "glassware-setup"
    | "electric-circuit"
    | "magnet-coil"
    | "inclined-plane"
    | "vacuum-tube"
    | "atomic-model"
    | "periodic-table-room"
    | "industrial-plant"
    | "field-observation";
  objects: HistoricalSceneObject[];
  camera?: {
    mode: "fixed" | "orbit" | "step-guided";
    defaultZoom?: number;
    focusObjectId?: string;
  };
  annotations: HistoricalSceneAnnotation[];
  animationTimeline: HistoricalAnimationStep[];
};

export type HistoricalVisualReconstruction = {
  id: string;
  style: "2d" | "3d" | "mixed";
  scenes: HistoricalVisualScene[];
};

export type HistoricalExperimentAttempt = {
  id: string;
  title: string;
  attemptType: "failed" | "partial-success" | "successful";
  description: string;
  setupChanges: string[];
  whyItFailedOrWorked: string;
  observedData?: {
    label: string;
    value: string | number;
    unit?: string;
  }[];
  visualSceneId: string;
  simulationBehavior: {
    showFailureState: boolean;
    showSuccessState: boolean;
    animationDescription: string;
    visibleCauseEffect: string;
  };
};

export type HistoricalExperimentStage = {
  id: string;
  order: number;
  title: string;
  stageType:
    | "background"
    | "question"
    | "hypothesis"
    | "setup"
    | "attempt"
    | "failure"
    | "adjustment"
    | "measurement"
    | "observation"
    | "success"
    | "conclusion"
    | "formula-derived"
    | "modern-application";
  description: string;
  researcherAction: string;
  instrumentUsed: string[];
  observedResult: string;
  reasoning: string;
  visualSceneId: string;
  imagePrompt?: string;
  model3dPrompt?: string;
  animationPrompt?: string;
  generatedAssetPrompt?: GeneratedAssetPrompt;
  sourceReferenceIds: string[];
  studentInteraction?: {
    type:
      | "observe"
      | "click-object"
      | "compare-before-after"
      | "arrange-steps"
      | "predict-result"
      | "choose-adjustment"
      | "identify-error"
      | "run-simulation";
    prompt: string;
    expectedAnswer?: string;
    options?: string[];
  };
};

export type ResearcherRealLab = {
  id: string;
  slug: string;
  subject: SubjectKey;
  title: string;
  subtitle?: string;
  researcherNames: string[];
  period: string;
  location?: string;
  discoveryType:
    | "law"
    | "formula"
    | "theory"
    | "invention"
    | "chemical-element"
    | "chemical-compound"
    | "atomic-model"
    | "instrument"
    | "industrial-process";
  coreQuestion: string;
  historicalContext: string;
  previousBeliefOrProblem: string;
  researchGoal: string;
  hypothesis?: string;
  experimentFlow: HistoricalExperimentStage[];
  failedAttempts: HistoricalExperimentAttempt[];
  successfulAttempt: HistoricalExperimentAttempt;
  discoveredConcepts: string[];
  relatedFormulaIds: string[];
  relatedLessonIds: string[];
  relatedSimulationLabIds: string[];
  relatedInlineLabIds: string[];
  visualReconstruction: HistoricalVisualReconstruction;
  sourceReferences: HistoricalSourceReference[];
  accuracyLevel: "source-backed" | "educational-reconstruction" | "partially-uncertain" | "conceptual-only";
  safetyLevel: "safe-to-simulate" | "concept-only" | "do-not-recreate-physically";
  limitations: string[];
  modernInterpretation: string;
  needsSourceVerification?: boolean;
  uncertaintyNotes?: string[];
};

export type SearchItem = {
  title: string;
  subtitle: string;
  href: string;
  keywords: string[];
};
