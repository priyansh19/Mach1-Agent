# Local AI Agent — Build Log

> A local-first AI agent built incrementally, one phase at a time. Each phase adds one capability. The final product is a three-mode desktop webapp: Chat · Cowork · Code — powered by `gemma4:26b` running entirely on your machine, with Claude as a fallback only when the local model isn't confident enough.

---

## The Idea

Most AI tools route everything to the cloud. This project builds the opposite: an agent that handles 90%+ of requests locally (zero cost, private, fast), and only escalates to Claude when the local model genuinely doesn't know. The result is a tool that feels like Claude Desktop but runs on your hardware.

**Stack:** LangChain + LangGraph · Ollama (gemma4:26b) · FastAPI · React + TypeScript + Vite

---

## What's Built

### Phase 1 — Simple LangChain Agent (`p1-Simple-Langchain-AI-Agent/`)
The foundation. A LangChain chatbot with `ChatOllama` and a basic message history loop.
- Model: `llama3.2` (later upgraded to `gemma4:26b`)
- No tools, no memory — just raw conversation
- Introduced the `HumanMessage` / `AIMessage` / `SystemMessage` pattern

### Phase 2 — Persona Agent (`p2-Giving-ai-agent-persona/`)
Added system-level personality and a FastAPI server.
- Custom persona via `SystemMessage`
- FastAPI with CORS, Pydantic `BaseModel`
- Vite + React frontend connected via proxy (`5173 → 8000`)
- `/persona` endpoint to swap personality at runtime
- First version of the shared UI

### Phase 3 — Tool-Using Agent (`p3-Tool-Using-Agent/`)
The agent can now read and write files on your machine.
- Tools: `create_file`, `read_file`, `edit_file`, `append_to_file` (all in `workspace/`)
- Migrated from `langchain.agents` to **LangGraph** `create_react_agent`
- `@tool` decorator with precise docstrings as tool descriptions
- Tool call display cards in the UI (collapsible, input/output)

### Phase 4 — Confidence Scoring Agent (`p4-Confidence-Scoring-Agent/`)
The agent evaluates how confident it is before answering.
- Separate LLM call scores each message 1–10 before responding
- Score returned alongside response in API
- Confidence badge in UI (green ≥8 / yellow 5–7 / red <5)
- `/capabilities` endpoint — UI dynamically shows/hides features based on what the agent supports

### Phase 5 — Triage Routing Agent (`p5-Triage-Routing-Agent/`) ← current
The core intelligence: route based on confidence.
- `CONFIDENCE_THRESHOLD = 7` — score ≥7 stays local, score <7 escalates to Claude CLI
- Claude called via `subprocess.run(["claude", "-p", ...])` — no API key needed, uses existing CLI auth
- Full conversation history passed to Claude for context
- `handled_by` field in API response — UI shows "via Local" or "via Claude" badge
- Session management UI: multiple isolated sessions, session list, rename, export, search
- All 7 UI features: copy button, timestamps, session rename, export .md, search, char counter, retry button

---

## The UI (`agent-ui/`)

A shared plug-and-play React UI that connects to any agent version via the `/capabilities` endpoint. Features auto-appear/disappear based on what the active agent supports.

**Currently implemented:**
- Multi-session management (localStorage persistence, session isolation)
- Copy button on assistant messages
- Message timestamps (HH:MM per message)
- Inline session rename
- Export session as Markdown download
- Search sessions in sidebar
- Input character counter (2000 char limit)
- Retry failed messages
- Stop generation (AbortController)
- Auto-title sessions from first message
- Jump-to-bottom floating button
- Persistent draft per session
- Edit & re-send any user message
- Pin sessions (sort to top with gold border)
- Import session from .md file
- Keyboard shortcuts: `Ctrl+K` command palette · `Alt+N` new session
- Bookmark individual messages + filter to bookmarked only
- Undo send (3-second grace period after each message)
- Confidence badge per message
- Handled-by badge (via Local / via Claude)
- Collapsible tool-step cards with input/output

---

## What's Coming

### Near Term — Agent Phases
| Phase | Name | What it adds |
|-------|------|-------------|
| P6 | Episodic Memory Agent | Vector store — agent remembers past conversations |
| P7 | Semantic Memory Agent | Extracts long-term facts from conversations |
| P8 | Summarizer Agent | Auto-compresses long histories to stay under context limits |

### The UI Transformation — Three Modes
The current UI is a single chat surface. It's being redesigned as a three-mode app:

**Chat mode** — what we have now, refined. Full-text search, artifact side panel, slash commands, inline citations, conversation branching, cost-per-answer display.

**Cowork mode** — agentic task management. Natural language → decomposed plan → approval gate → execution → output. Dual-zone layout (conversation left, work output right). Document editing, scheduled/recurring tasks, audit log with undo.

**Code mode** — software development workspace. Diff pane, terminal pane, file editor, preview pane, parallel sessions with git worktree isolation, CI status bar.

### What Makes This Different from Every Other AI Tool

1. **Local-first triage** — runs 90%+ locally, escalates only when genuinely uncertain. No other tool does this with a visible, tunable confidence threshold
2. **Cost transparency** — every message shows `$0.00` (local) or `$0.003` (cloud). Running cost counter, lifetime local rate, "what would 100% cloud have cost?"
3. **Privacy by default** — local responses get a lock icon: "This response never left your machine"
4. **Interactive routing** — borderline messages (confidence 5–6) show: "Send locally anyway or escalate?" You choose
5. **Confidence tuning** — live slider to adjust the threshold in real time; the model learns which domains it handles well
6. **Zero API key required** — Claude is called via CLI subprocess using your existing auth

---

## The Final Product

**Name: TBD** (something that reflects local-first intelligence — not "milestone agent")

A single app that combines all eight agent phases into one intelligent, self-routing system:
- Remembers everything (episodic + semantic memory)
- Handles 90%+ of questions locally with zero cost
- Escalates gracefully to Claude when genuinely needed
- Works across Chat, Cowork, and Code workflows
- Tracks its own cost savings in real time
- Runs entirely on your PC

The positioning: the smartest local co-worker that exists. Not a cloud service you pay per token. Not a dumb local model. Something in between that's smarter than either.

---

## Project Structure

```
langchain-agents/
├── p1-Simple-Langchain-AI-Agent/   # Phase 1 — basic LangChain chatbot
├── p2-Giving-ai-agent-persona/     # Phase 2 — persona + FastAPI server
├── p3-Tool-Using-Agent/            # Phase 3 — file tools + LangGraph
├── p4-Confidence-Scoring-Agent/    # Phase 4 — confidence scoring
├── p5-Triage-Routing-Agent/        # Phase 5 — triage routing (CURRENT)
│   ├── agent.py                    # Core agent: scoring + routing + tools
│   ├── server.py                   # FastAPI: /chat /capabilities /clear
│   └── workspace/                  # Agent's file sandbox
├── agent-ui/                       # Shared React + TypeScript UI
│   └── src/
│       ├── App.tsx                 # Main state, all handlers
│       ├── api.ts                  # fetch wrappers
│       ├── types.ts                # Shared types
│       └── components/
│           ├── Sidebar.tsx         # Sessions, features, persona, agent info
│           ├── ChatArea.tsx        # Message list, input, stop/undo
│           └── MessageBubble.tsx   # Individual message with actions
└── docs/
    └── FEATURE_PLAN.md             # Full UI feature roadmap (three modes)
```

---

## Running Locally

```bash
# Start Ollama with gemma4:26b
ollama pull gemma4:26b
ollama serve

# Start the agent server (from p5-Triage-Routing-Agent/)
pip install -r requirements.txt
python server.py

# Start the UI (from agent-ui/)
npm install
npm run dev
# → http://localhost:5173
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| LLM runtime | Ollama (local) + Claude CLI (fallback) |
| Agent framework | LangGraph `create_react_agent` |
| LLM interface | LangChain `ChatOllama` |
| API server | FastAPI + Uvicorn |
| Frontend | React 18 + TypeScript + Vite |
| State | React state + localStorage |
| Styling | Vanilla CSS (GitHub-dark design system) |
| Markdown | `react-markdown` + `remark-gfm` |
