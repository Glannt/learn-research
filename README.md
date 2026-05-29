# SciLearn Lab

Interactive Physics + Chemistry learning app built with Next.js App Router, TypeScript, Tailwind CSS, Zustand, KaTeX, Recharts and Three.js.

## Run Local

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. During verification in this workspace I used `http://127.0.0.1:3001`.

Optional Prisma setup:

```bash
copy .env.example .env
npm run prisma:generate
```

## Main Routes

- `/` home
- `/subjects`, `/subjects/[slug]`, `/subjects/[slug]/lessons/[lessonSlug]`
- `/formulas`, `/formulas/[subject]/[slug]`
- `/lab`, `/lab/[slug]`
  - `/lab/ac-generator` ByteByteGo-style 2D/3D AC generator visual simulation
- `/quiz`
- `/dashboard`
- `/history`, `/history/physics`, `/history/chemistry`, `/history/[topicSlug]`
- `/research-labs`, `/research-labs/physics`, `/research-labs/chemistry`, `/research-labs/[slug]`
- `/history/experiments`, `/history/experiments/[slug]`

## Current Architecture

```txt
src/
  app/                 App Router pages
  components/
    chemistry/         bonding, molecule/atom 3D, reaction sandbox
    formula/           KaTeX formula cards, search, calculator
    history/           timeline, scientist cards, experiment scenes
    research-labs/     source-backed historical experiment reconstructions
    layout/            sidebar, header, global search, theme
    physics/           pendulum, kinematics, Newton, ideal gas
    simulation/        lab layout, overlays, gauges, validators, visuals
    quiz/              quiz card, progress dashboard
  features/
    visual-simulation/ reusable 2D/3D visual explanation engine and AC generator demo
  data/
    chemistry/         chemistry catalog and reaction simulations
    physics/           physics catalog
    interactive-exercises.ts
    researcher-real-labs.ts
    science-history.ts
  lib/
    chemistry/         chemistry calculations
    math/              formula engine
    physics/           physics calculations
    simulation-validation.ts
  types/               shared domain types
```

## Implemented Upgrade Phases

### Phase A: Lab realism base

- Shared `LabWorkspace` layout with header, left instruction panel, center simulation, right controls and bottom feedback area.
- Visual primitives: `MotionTrail`, `VectorArrow`, `RotatingWheel`, `DistanceRuler`, `TimeDisplay`.
- Gauges: speed, pressure, temperature.
- Formula overlay stack: `FormulaOverlay`, `DraggableFormulaToken`, `UnitChecker`, `InlineCalculationBox`.
- `SimulationAssumptionNotice` for real equation, educational approximation and limitations.
- Upgraded kinematics lab with moving car, rotating wheels, trail, vectors, ruler, time counter, slow motion, friction and realtime charts.
- Upgraded pendulum lab with trajectory, angle arc, velocity/gravity/tension/centripetal vectors, damping, slow motion and energy chart.

### Phase B: Chemistry sandbox

- Drag/drop lab canvas for atoms and species.
- Chemical bonding lab supports NaCl, H2O, CO2, NH3, CH4, HCl, O2 and N2.
- Reaction sandbox supports safe conceptual simulations:
  - `2H2 + O2 -> 2H2O`
  - `2Na + Cl2 -> 2NaCl`
  - `HCl + NaOH -> NaCl + H2O`
  - `AgNO3 + NaCl -> AgCl(s) + NaNO3`
  - `CaCO3 -> CaO + CO2`
  - `CH4 + 2O2 -> CO2 + 2H2O`
- Bond change view, collision animation, energy profile and safety messaging.

### Phase C: Interactive exercises

- Added `InteractiveSimulationExercise` and `SimulationExerciseValidation` models.
- Validator checks parameters, formula tokens, units and simulated outcomes with tolerance.
- Embedded interactive exercises in kinematics, pendulum, bonding and reaction sandbox labs.

### Phase D: Science history

- Added 10 history topics:
  - Physics: Galileo, Newton, Hooke, Joule, Faraday.
  - Chemistry: Lavoisier, Dalton, Mendeleev, Thomson/Rutherford/Bohr, Lewis.
- Timeline pages, topic detail pages, scientist cards, discovery story, formula origin, before/after theory comparison and animated SVG experiment reconstructions.

### Researcher Real Lab

- Added source-backed historical experiment reconstruction data for:
  - Physics: Tesla AC, Faraday induction, Galileo inclined plane, Newton prism, Joule heat.
  - Chemistry: Lavoisier mass conservation, Mendeleev periodic table, Rutherford gold foil, Marie Curie radioactivity, Haber-Bosch ammonia, oxygen discovery.
- Each research lab includes context, research question, failed/incomplete attempt, successful attempt, staged discovery flow, source references, safety notice, asset prompts and an interactive challenge.
- Tesla AC is the full sample lab for AC transmission, rotating magnetic field, induction motor and transformer concepts.

### Visual Simulation Foundation

- Added reusable `features/visual-simulation` models and layout components:
  - `VisualSimulationLayout`
  - `TwoDThreeDToggle`
  - `OrbitControlToolbar`
  - `SimulationStepController`
  - `ParameterBindingPanel`
- Added `/lab/ac-generator` as the first full visual simulation:
  - 2D ByteByteGo-style overview with N/S magnets, rotating coil, slip rings, brushes, lamp, current arrows and AC waveform.
  - React Three Fiber 3D model with OrbitControls, zoom, pan, reset camera, labels, field lines, current arrows, exploded view and cutaway toggle.
  - Realtime sine waveform, coil angle marker, voltage/current readout and lamp brightness tied to current.
  - Parameter bindings for `B`, `A`, `N`, `ω`, `R`.
  - Formula overlay for `Φ = BAcosθ`, `ε = -N dΦ/dt`, `ε(t) ≈ NBAωsin(ωt)`, `I(t)=ε/R`.
  - Failure modes: coil stopped, brush disconnected, weak magnetic field.

## Verification

```bash
npm run build
npm run test:visual
```

`npm run test:visual` expects a dev server at `http://127.0.0.1:3001` unless `E2E_BASE_URL` is set.

## Safety Notes

Chemistry reactions are conceptual educational models only. The app does not provide real-world hazardous procedures, mixture ratios, preparation steps or handling instructions.

## Known TODO

## Latest Visual Simulation Update

- `/lab/ac-generator` now uses the shared visual-simulation foundation with 2D/3D toggle, step controller, annotations, parameter binding panel and formula overlay toggle.
- The AC Generator 3D scene is interactive through React Three Fiber: orbit, zoom, pan, reset camera, auto orbit, labels, field lines, current arrows, exploded view, cutaway view and play/pause/reset animation.
- The AC Generator scene includes N/S magnets, rotating coil, coil axis, two slip rings, two brushes, external wires, lamp/load, current direction arrows, field lines, rotation arrow, waveform panel and coil position indicator.
- Bound parameters: `B` -> field lines, `A` and `N` -> coil, `omega` -> coil rotation/rotation arrow, `R` -> lamp/load, `epsilon` -> waveform, `I` -> current arrows/lamp brightness.
- Failure modes implemented: coil stopped, brush disconnected and weak magnetic field.
- `/lab/faraday-induction` now applies the same pattern for electromagnetic induction:
  - 2D overview with moving magnet, coil, closed circuit, galvanometer, flow arrows and formula layer.
  - 3D interactive model with orbit, zoom, pan, reset, auto orbit, labels, field lines, current arrows, exploded/cutaway toggles and play/pause/reset.
  - Bound parameters: `v` -> magnet motion, `B` -> field lines, `N`/`A` -> coil, `R` -> circuit resistance, `I` -> current arrows and meter deflection.
  - Failure modes: magnet stopped, open circuit and weak field.
- `/lab/transformer` now applies the same pattern for transformer behavior:
  - 2D overview with primary coil, magnetic core, secondary coil, load, flux arrows, current arrows and turn-ratio explanation.
  - 3D interactive model with orbit, zoom, pan, reset, auto orbit, labels, field pulse, current arrows, exploded/cutaway toggles and play/pause/reset.
  - Bound parameters: `Vp` -> primary coil input, `Np`/`Ns` -> coil turn counts, `f` -> flux pulse speed, `k` -> core coupling, `R` -> load current.
  - Failure modes: no AC input, open secondary and weak coupling.
- React/R3F stack was aligned to React 19, `@react-three/fiber` 9 and `@react-three/drei` 10 for Next 15 runtime compatibility.
- `npm run test:visual` now includes `/lab/ac-generator`, `/lab/faraday-induction` and `/lab/transformer`; set `E2E_BASE_URL` to the running dev server, for example `http://127.0.0.1:3009`.

- Persist progress, exercises and bookmarks through Prisma instead of client-only Zustand.
- Add richer drag/drop formula placement with true pointer coordinates.
- Add more precise unit parsing and symbolic formula checking.
- Expand periodic table to 118 elements.
- Add more electrical circuit labs with draggable wires and meters.
- Apply the new visual-simulation pattern to transformer, DC motor, induction motor, Faraday induction and molecule/reaction labs.
