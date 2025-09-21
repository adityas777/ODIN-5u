ODIN — Optimal Dynamic Interplanetary Navigator (Prototype)
----
🔗 Live Demo

Live App: https://v0-remix-of-odin-space-navigation-two.vercel.app/
----
ODIN is a cinematic, interactive prototype of an AI co-pilot for Earth-to-Moon navigation. It plans a nominal trajectory, detects dynamic hazards (solar flares, meteors, debris), and replans in real time with clear, human-readable decision logs—just like your hackathon presentation promised.

✨ Highlights

Immersive Launch Intro

Welcome screen: “LET’S BEGIN YOUR SPACE TRIP WITH ODIN”

LAUNCH button → 3-2-1 countdown → rocket liftoff with smoke, exhaust, camera shake → auto-transition to the main dashboard.

Live Mission Dashboard

Earth→Moon orbital map with glowing nominal path and dotted alternatives (blue = safer, red = riskier).

Real-time hazard spawns (solar flares, meteors, debris) that bend the trajectory.

Select an Alternative Path → the spacecraft smoothly reorients and follows that route (not a straight line).

Cinematic Hazard Animations

Meteors: fiery rock with tail crossing the scene.

Solar flares: expanding plasma waves forming a danger zone.

Debris fields: fast micro-fragments flashing across the path.

Emergency Stop Logic

Pauses the spacecraft with visual “brake” cues.

Waits a few seconds, shows “Hazard cleared – resuming journey”, then continues along the user-selected trajectory.

Explainable AI Logs (Optional)

Human-readable, timestamped reasoning: fuel/time/safety trade-offs when switching routes.

Works with mock data by default; can be upgraded to LLM-generated explanations.




🧭 Product Story

Space missions are fragile: a nominal plan breaks when reality changes—radiation bursts, debris, or small thrust errors. ODIN demonstrates a future-ready approach where an onboard co-pilot continuously plans → detects → replans → explains, prioritizing safety with minimal overhead.

🧱 Tech Stack

Frontend: React + TypeScript (UI generated with v0; refined by hand)

Runtime: Node.js

Styling: Tailwind CSS + custom animations (CSS + JS requestAnimationFrame)

State: Lightweight client state + mock API routes

Optional AI: Connect an LLM for decision-log generation

📦 Project Structure
/
├─ app/                      # App routes & pages
│  ├─ (intro)/welcome/       # Welcome + countdown + launch animation
│  ├─ dashboard/             # Main mission dashboard
│  ├─ api/                   # Mock API routes (hazards, logs, trajectory)
│  └─ layout.tsx
├─ components/
│  ├─ Rocket.tsx             # Rocket sprite & motion controller
│  ├─ TrajectoryCanvas.tsx   # Canvas/WebGL trajectory renderer
│  ├─ HazardLayer.tsx        # Solar flare / meteor / debris animations
│  ├─ ControlPanel.tsx       # Simulate Hazard / Emergency Stop, etc.
│  ├─ DecisionLogs.tsx       # Human-readable logs
│  └─ StatsBar.tsx
├─ lib/
│  ├─ physics.ts             # Basic orbital math & interpolation
│  ├─ spline.ts              # Smooth path-following utilities
│  └─ hazards.ts             # Hazard models & spawn logic
├─ public/                   # Icons, sprites, background images
├─ styles/                   # Tailwind & custom CSS
└─ README.md


Install

npm install
# or
pnpm install


Environment (optional for AI logs)
Create .env.local:

OPENAI_API_KEY=your_key_here
ODIN_LOGS_MODE=mock   # "mock" or "ai"


🧩 Core Interactions (How it Works)

Selecting an Alternative Path

Click an alternative route on the map (tooltip shows trade-offs).

The rocket eases into the new spline with acceleration/turn limits.

Hazard proximity recalculates; stats update in real time.

Simulate Hazard

Control Panel → “Simulate Hazard” spawns a random hazard:

Meteor: moving collider line with tail & glow.

Solar Flare: expanding radial field from the Sun’s direction.

Debris: scattered fast fragments across the arc.

If risk > threshold, the system prompts a replan.

Emergency Stop

Pauses motion, applies a halo/drag effect, and starts a short timer.

After the hold, if the user has a selected route, resume along that path.

Decision Logs

On each replan: append a log with timestamp, hazard, action, delta-v/time/safety deltas and a short explanation.

In mock mode, logs are templated; in ai mode they’re generated via LLM.


🧠 Roadmap

 Plug in real astrodynamics (e.g., patched conics with simplified bodies)

 Add Monte Carlo variability for uncertainty bands

 SCP/nonlinear optimization placeholders → real solvers

 Keyboard shortcuts (H = hazard, E = emergency stop, A/B = pick route)

 ARIA roles & reduced-motion accessibility

🤝 Contributing

Fork this repo

Create a feature branch: git checkout -b feat/your-idea

Commit: git commit -m "feat: add X"

Push: git push origin feat/your-idea

Open a Pull Request

🛡️ License

MIT — see LICENSE for details.
