# 52. Quantum Predictive Blueprint Generator (QPBG)

This module describes how to merge **Predictive Idea Prioritization (P‑IP)** and
**Dynamic Code Generation Prompting (D‑CGP)** into a single feedback loop that
improves both *planning* and *code quality* for AppForge AI / Idea Vault flows.

---

## 52.1 Concepts

### 52.1.1 Predictive Idea Prioritization (P‑IP)

Goal: learn which ideas actually get **shipped** and use that historical signal
to auto‑score new ideas.

Tracked per idea:

- `title: string`
- `description: string`
- `status: 'draft' | 'active' | 'shipped' | 'archived'`
- `createdAt: number`
- `shippedAt?: number`
- `frameworksUsed: string[]` (React, Tailwind, Firestore, etc.)
- `complexityScore: 1 | 2 | 3 | 4 | 5` (manual)
- `predictedPriority?: number` (1–5, AI filled)

Learning signal:

- Positive samples = items moved to `shipped`
- Negative samples = items deleted or left in `draft/archived` for too long

The engine aggregates shipped ideas and learns:

- Which titles/descriptions correlate with shipped status
- Which complexity levels are realistic for you
- Which frameworks appear in shipped vs abandoned work

For a new idea, P‑IP returns:

```ts
interface PredictiveScore {
  predictedPriority: number; // 1–5
  confidence: number;        // 0–1
  reasons: string[];         // human‑readable explanation
}
```

### 52.1.2 Dynamic Code Generation Prompting (D‑CGP)

Goal: adapt LLM prompts to your **real** technical preferences: stack choices,
state management, patterns that regularly succeed for you.

The engine inspects code from successfully shipped ideas:

- Functional React components vs class components
- React Query / Zustand / Redux / Firestore patterns
- Tailwind vs CSS‑in‑JS, etc.

It then emits a hidden, internal prefix:

```ts
interface BlueprintPromptContext {
  preferredFrameworks: string[];
  commonPatterns: string[];
  antiPatterns: string[];
  comment: string; // for logging/debug only
}
```

This is prepended internally to every “generate code” call:

> User prefers React functional components, Tailwind CSS and Firestore.
> Avoid class components and inline styles. Use Zustand for local state when
> complexity > 3. …

The user never sees this prefix, but the model does.

---

## 52.2 Combined Flow – Quantum Predictive Blueprint Generator

The **Quantum Predictive Blueprint Generator (QPBG)** is the bridge between
P‑IP (planning) and D‑CGP (code quality).

### 52.2.1 Data flow

1. **User creates idea** in Idea Vault / AppForge:
   - Title, description, initial priority, optional complexity.

2. **User triggers Quantum Analysis**:
   - Hook: `triggerQuantumAnalysis('idea_created', ideaData)`.

3. **Engine runs P‑IP**:
   - Compares new idea vs shipped history.
   - Outputs `PredictiveScore`.

4. **Engine runs D‑CGP**:
   - Reads frameworks/patterns of the **top shipped** ideas that match the
     same domain / complexity band.
   - Outputs `BlueprintPromptContext`.

5. **QPBG snapshot is stored with idea**:

```ts
interface BlueprintSnapshot {
  predictiveScore: PredictiveScore;
  blueprintContext: BlueprintPromptContext;
  savedAt: number;
}
```

6. **When user requests code generation** for this idea, AppForge chat uses:

```ts
const fullPrompt = selfLearn.generateEnhancedPrompt(
  userPrompt,
  blueprintSnapshot
)
```

so both **history** and **idea‑specific blueprint** are applied.

---

## 52.3 API Shapes

### 52.3.1 Engine interface

```ts
// lib/quantum-blueprint-engine.ts
export interface IdeaRecord {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'shipped' | 'archived';
  createdAt: number;
  shippedAt?: number;
  frameworksUsed: string[];
  complexityScore?: number; // 1–5
}

export interface PredictiveScore {
  predictedPriority: number; // 1–5
  confidence: number;        // 0–1
  reasons: string[];
}

export interface BlueprintPromptContext {
  preferredFrameworks: string[];
  commonPatterns: string[];
  antiPatterns: string[];
  comment: string;
}

export interface BlueprintSnapshot {
  predictiveScore: PredictiveScore;
  blueprintContext: BlueprintPromptContext;
  savedAt: number;
}

export interface QuantumBlueprintEngine {
  recordIdeaSnapshot(idea: IdeaRecord): void;
  recordShipped(ideaId: string): void;
  recordAbandoned(ideaId: string): void;

  computePredictiveScore(idea: IdeaRecord): PredictiveScore;
  computeBlueprintContext(idea: IdeaRecord): BlueprintPromptContext;
  generateSnapshot(idea: IdeaRecord): BlueprintSnapshot;
}
```

### 52.3.2 Integration with Self‑Learn Engine

Minimal change to the existing `SelfLearnEngine`:

```ts
generateEnhancedPrompt(basePrompt: string, snapshot?: BlueprintSnapshot): string {
  const base = /* existing learning‑based enhancement */;

  if (!snapshot) return base;

  return `Planning insights:
Priority: ${snapshot.predictiveScore.predictedPriority}/5 (confidence ${Math.round(snapshot.predictiveScore.confidence * 100)}%)
Reasons: ${snapshot.predictiveScore.reasons.join('; ')}

Technical blueprint:
Preferred frameworks: ${snapshot.blueprintContext.preferredFrameworks.join(', ')}
Patterns to use: ${snapshot.blueprintContext.commonPatterns.join(', ')}
Patterns to avoid: ${snapshot.blueprintContext.antiPatterns.join(', ')}

Now generate code that respects this blueprint:

${base}`;
}
```

No backend storage is strictly required for v1; everything can live in
`localStorage` or Firestore depending on the app.

---

## 52.4 UI Hooks (React)

### 52.4.1 Quantum Panel

- Add a **"Quantum Blueprint"** section under the existing Self‑Learn / Quantum
  panel:
  - Shows predicted priority (1–5).
  - Shows suggested stack (React + Tailwind + Firestore, etc.).
  - Shows a one‑line “reason” (“Matches 3 of your last 4 shipped ideas”).

### 52.4.2 Buttons

- **"Apply Blueprint to Prompt"** – pushes the pre‑computed blueprint into the
  AppForge chat input (or modifies the prompt using
  `generateEnhancedPrompt(prompt, snapshot)`).
- **"Re‑analyze Idea"** – recomputes snapshot after you change frameworks,
  complexity, or status.

---

## 52.5 Roadmap

### v2.0.1
- Implement `QuantumBlueprintEngine` as a pure client module.
- Wire it to Idea Vault / AppForge Self‑Learn.
- Store snapshots per idea in localStorage/Firestore.

### v2.1
- Move learnings to backend for cross‑device continuity.
- Track actual deploy success/fail per idea and feed it back into P‑IP.

### v3.0
- Multi‑user aggregation (team intelligence).
- Per‑customer and per‑project profiles.
- “Blueprint Marketplace” where successful blueprints can be reused.
