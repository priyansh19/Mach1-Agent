# Feature Plan — Three-Mode AI Agent UI

> Synthesized from 4 parallel scouting agents covering: Claude Desktop, AI co-worker tools (Notion AI, Linear, ChatGPT Agent, Copilot Studio), chat UI patterns (Claude.ai, ChatGPT, Perplexity, Pi), and features unique to our triage-routing + local LLM architecture.

---

## The Vision

A three-tab desktop webapp that behaves like Claude Desktop but runs 90%+ of work locally on your machine, routing only hard questions to Claude CLI. Three distinct modes, each with a purpose-built UI:

| Mode | Purpose | Mental model |
|------|---------|-------------|
| **Chat** | Conversational assistant, Q&A, quick tasks | Claude.ai / ChatGPT |
| **Cowork** | Agentic long-running tasks, document production | Notion Agent / ChatGPT Tasks |
| **Code** | Software development, file operations, diffs | Claude Code / Cursor |

---

## Architecture Context (shapes every feature decision)

- Local LLM: `gemma4:26b` via Ollama — always-on, zero cost per call
- Confidence scoring: 1–10 score on every message before answering
- Triage routing: score ≥7 → local, score <7 → Claude CLI subprocess
- File tools: `create_file`, `read_file`, `edit_file`, `append_to_file` in `workspace/`
- Returns: `response`, `tool_steps`, `confidence`, `handled_by`
- No API key needed — uses existing Claude CLI auth

---

## Phase 6 — Three-Mode Shell (Foundation)

The tab bar and mode switching. Everything else builds on this.

### Global Shell
- [ ] Three-tab top bar: **Chat** · **Cowork** · **Code** — with active indicator and mode-specific accent colors
- [ ] Persistent sidebar across all modes (sessions, agent status, features panel)
- [ ] Mode-specific accent color: Chat = blue, Cowork = amber, Code = green
- [ ] Tab badge: Cowork shows running task count; Code shows active session count
- [ ] Keyboard shortcuts: `Ctrl+1/2/3` to switch modes; persist last-used mode

### Routing Architecture Display (ALL modes)
- [ ] **Routing timeline dots** — row of colored dots at chat bottom (green=local, purple=cloud); hover shows score
- [ ] **Live routing indicator** — "Scoring…" animation → laptop/cloud icon flash before response arrives
- [ ] **Color-coded message left-border** — green for local, purple for cloud responses
- [ ] **"You saved X cloud calls this session"** — live counter in sidebar under agent name
- [ ] **Privacy lock badge** — lock icon + "Private — stayed on device" on local-handled messages
- [ ] **Confidence bar** — thin colored bar replacing text-only "Confidence X/10" badge

---

## Chat Mode Features

### Core Message Experience
- [ ] Streaming markdown with incremental parsing (code blocks, tables, math)
- [ ] Collapsible reasoning/thinking section above final answer (distinct from the answer)
- [ ] Outline view / floating TOC for responses with multiple `##` headers
- [ ] Previous response carousel (`< 1 of 3 >`) when regenerating — compare variants
- [ ] Stopped/partial response handling — "Continue" + "Regenerate from here" buttons
- [ ] Context truncation marker — visible divider "Earlier messages were summarized"
- [ ] Smooth message entry animation — user messages slide up, AI fades in from placeholder
- [ ] Blinking caret at stream end — remove immediately on completion

### Per-Message Model Selector
- [ ] **Model override on each prompt** — a small pill/dropdown attached to the send button with three options:
  - **Auto** (default) — triage routing decides based on confidence score
  - **Local** — force `gemma4:26b` regardless of confidence score
  - **Claude** — force Claude CLI regardless of confidence score
- [ ] Chosen override shown as a badge on the sent message ("Forced: Local" / "Forced: Claude")
- [ ] Override persists for that message only; resets to Auto for the next
- [ ] Server receives `force_model?: 'local' | 'claude' | null` in the request body; when set, skips scoring and routes directly
- [ ] Keyboard shortcut: hold `Alt` while pressing Enter to cycle Auto → Local → Claude before send

### Input Box
- [ ] Auto-resizing textarea (grows to 8 lines, then scrolls internally)
- [ ] `/` slash command menu — keyboard-navigable overlay: `/new`, `/search`, `/export`, `/model:fast`, `/tone:formal`
- [ ] `@filename` reference syntax — type `@` to fuzzy-search workspace files and attach inline
- [ ] Voice input with live transcript preview (edit before sending)
- [ ] Formatting toolbar on text selection: Bold, Italic, Code, Quote, List
- [ ] Saved prompts library — `/saved` command or bookmark icon; save any sent message as a reusable prompt
- [ ] Global hotkey `Ctrl+Shift+Space` to focus chat from anywhere in the app
- [ ] Mid-conversation model switching dropdown in the composer (not just the header)

### Response Rendering
- [ ] Code blocks: Copy + Explain + Apply-to-file actions (not just copy)
- [ ] Syntax highlighting for 40+ languages (auto-detected, labeled in block header)
- [ ] KaTeX inline and block math rendering (`$...$` and `$$...$$`)
- [ ] Mermaid diagram rendering — fenced blocks tagged ```mermaid render as SVG
- [ ] Interactive sortable tables — markdown tables with column sort + "Copy as CSV"
- [ ] Chart generation from data — "Visualize" button on numerical data renders Recharts chart
- [ ] **Artifact side panel** — right-side panel for long-form outputs (documents, code files, HTML)
- [ ] Live HTML/React artifact preview — sandboxed iframe, updates as AI streams
- [ ] "View source / View preview" toggle on every artifact
- [ ] Download artifact as file (`.html`, `.py`, `.md`, `.csv`)
- [ ] Collapsible long sections — responses with 3+ headers get "Show all / Collapse" toggle

### Conversation Management
- [ ] **Full-text search across all conversations** (message content, not just titles) — `Cmd+K`
- [ ] Smart auto-grouping by date: Today / Yesterday / This week / Last month (collapsible)
- [ ] Conversation folders — drag sessions into named folders
- [ ] Pinned conversations — pin up to 5 to top of sidebar
- [ ] Bulk actions — multi-select sessions: delete, move to folder, export
- [ ] Archive instead of delete — recoverable; separate Trash with 30-day retention
- [ ] Export as Markdown / PDF / JSON — single click from overflow menu
- [ ] Shareable conversation snapshot link

### AI Transparency (Unique to our architecture)
- [ ] **Routing explainer popover** — clicking the "via Local / via Claude" badge shows WHY: "Score 8/10 ≥7 threshold — answered locally"
- [ ] **Confidence negotiation intercept** — borderline messages (score 5–6) show: "Confidence 6/10 — borderline. Send locally anyway or escalate to Claude?" with two buttons
- [ ] **"Why Claude?" drawer** — any cloud-handled message gets an expandable panel explaining the uncertainty type: "Future prediction / Specialized domain / Subjective opinion"
- [ ] **"What if?" threshold replay** — ghost button on cloud-handled messages: "Re-run locally?" forces local regardless of score
- [ ] Context window usage meter — subtle progress bar in conversation header showing % used
- [ ] Numbered inline citations on factual claims — superscript `[1]` expanding to source card
- [ ] Confidence sparkline — mini chart in sidebar showing confidence scores for last N turns
- [ ] Uncertainty text styling — when model hedges ("I'm not certain..."), style that phrase in italic/lighter color

### Personalization
- [ ] Quick-reply suggestion chips after each AI response (context-aware, 2–3 chips, dismissible)
- [ ] Tone and length presets in conversation header: Formal/Casual, Short/Detailed
- [ ] Speech style mirroring — AI adapts to user's message length and formality; shows "Adapting to your style" badge
- [ ] Per-conversation custom instructions override (beyond global)
- [ ] Theme: light/dark + accent color picker
- [ ] Message density: Compact / Comfortable / Spacious
- [ ] Font size control (accessibility)

### Cost & Savings Dashboard
- [ ] **"You saved X cloud calls this session"** — live tally: "9 local / 3 cloud"
- [ ] **Session cost estimate** — "~$0.01" tag per session item in sidebar
- [ ] **Cumulative "lifetime local rate"** — progress bar: "87% of all responses answered locally"
- [ ] **"What would 100% cloud have cost?"** comparison — hypothetical vs. actual spend
- [ ] **Cost-per-answer toggle** — "Show costs" mode appends `$0.00` (local) or `$0.003` (cloud) to each message
- [ ] Per-session cost summary in exported .md files

---

## Cowork Mode Features

### Layout
- [ ] **Dual-zone layout** — narrow left goal/Q&A panel + wide right activity/output panel (never merged into one stream)
- [ ] Task queue panel (left column) with status chips
- [ ] Output/document panel (right, 70% width)
- [ ] Running task badge on Cowork tab icon (live count)

### Task Management
- [ ] Natural language task entry → agent decomposes into editable bulleted plan before executing
- [ ] **Pre-execution plan review** — ordered step list with edit/remove per step + "Run Plan" button
- [ ] Task cards with status badges: Pending / Running / Awaiting Approval / Done / Failed
- [ ] **Triage inbox panel** — newly created tasks wait here for user acceptance before queuing
- [ ] Priority picker: Urgent / High / Normal / Low (AI suggests based on task text)
- [ ] Scheduled/recurring tasks — datetime picker + repeat interval (daily/weekly/on-trigger)
- [ ] Milestone grouping — tasks nested under a project with X/N progress bar
- [ ] Duplicate detection — yellow banner: "Similar task exists: [title] — Link or continue?"
- [ ] Cycle/sprint board view — kanban: Backlog / In Progress / Review / Done

### Document & Output Rendering
- [ ] Inline markdown with raw/preview toggle on all outputs
- [ ] **Per-step status chips during execution** — "Searching 3 files..." "Comparing options..." as distinct non-text elements before answer
- [ ] Tool-call disclosure card per invocation — tool name + input + output + timestamp; collapsed by default
- [ ] **File diff view inside tool-step cards** — green/red before/after diff for `edit_file` and `append_to_file`
- [ ] Editable output block — double-click any output to edit inline; "Regenerate" preserved
- [ ] Multi-section document renderer — article with floating TOC, inline citations, section-level regenerate buttons
- [ ] Code blocks with Run-in-sandbox button (sends to FastAPI execution endpoint)
- [ ] Export menu on any output: Copy Markdown / Copy Plain Text / Download .md / Save to KB

### Context & Knowledge Base
- [ ] **Project Space container** — named workspace grouping tasks, files, URLs, custom instructions
- [ ] File drop zone panel — drag-and-drop context files; shows filename + size chips
- [ ] URL context card — paste URL → shows favicon + title + "Refresh" button
- [ ] **Live workspace file tree panel** — collapsible panel showing `workspace/` files with size + last-modified; click to preview
- [ ] Context token usage meter — visual bar showing context window fill %
- [ ] Custom system instruction textarea per Space
- [ ] Per-task context override — add/exclude specific files for one task without changing Space defaults
- [ ] **Memory surface panel** — readable/editable list of remembered facts with Clear button
- [ ] Knowledge base search — full-text search across all uploaded files within a Space

### Approval & Automation Controls
- [ ] **Autonomy dial** — four positions: Observe & Suggest / Plan & Propose / Act with Confirmation / Act Autonomously
- [ ] **Pre-execution approval gate** — modal listing actions in plain language: Proceed / Edit Plan / Cancel
- [ ] **Mid-execution Pause / Resume / Abort** — three persistent buttons while task runs (not just a stop button)
- [ ] Step-level override — "Skip this step" + "Edit before continuing" per running step
- [ ] **Human-in-the-loop checkpoint card** — execution pauses, renders "Agent needs input: [question]" with option buttons; resumes on submit
- [ ] **Reversibility indicator** — each proposed action tagged "Reversible" (green) or "Irreversible" (red)
- [ ] **Audit log with per-action undo** — chronological timeline with Undo button + countdown timer per entry
- [ ] Progressive autonomy expansion — after 5 successful auto-approvals of same action type: "Allow automatically in future?"
- [ ] Allow-list manager — settings panel for which apps/domains agent can interact with

### Task History & Progress
- [ ] **Mission-control dashboard** — live grid of active tasks: name, current step, elapsed time, mini progress bar
- [ ] Per-task step progress tracker — vertical stepper: ✓ (done) / ⟳ (running) / ○ (pending) / ✗ (failed)
- [ ] Task detail drawer — click any task to open right-side drawer with full step log, tool calls, output, tokens
- [ ] Failed task error card — three-part: What happened / Why / Suggested next step + Retry + Retry with edits
- [ ] Time-range activity chart — bar chart of tasks/day over 30 days (Recharts)
- [ ] Diff-linked history entries — "View Changes" for tasks that modified documents

### Workspace-Specific (File Agent Features)
- [ ] **"Open in workspace" quick action** — preview file in modal directly from tool-step cards
- [ ] **Workspace file change indicator** — sessions that wrote files show file icon in sidebar
- [ ] **Workspace snapshot per session** — capture file list at session start; include in export
- [ ] **File creation shortcut** — `/create notes.txt` opens mini inline editor before sending

---

## Code Mode Features

### Layout
- [ ] **Drag-and-drop pane grid** — any arrangement of panes (react-grid-layout or react-mosaic)
- [ ] Session sidebar with filter by status / project / environment
- [ ] Session toolbar: title (editable), environment selector, model picker, permission mode, view mode, usage ring

### Pane Types
- [ ] **Chat pane** — main conversational interface
- [ ] **Diff pane** — unified file diff (`diff2html`); `+N -N` stats badge in toolbar; click line to comment; "Review code" button triggers Claude inline comments
- [ ] **Terminal pane** — embedded shell (xterm.js); opens in working directory; multi-tab; `Ctrl+\`` toggle
- [ ] **File editor pane** — click any file path in chat to open; Save button; warns on disk changes; right-click: "Attach as context" / "Copy path"
- [ ] **Preview pane** — embedded browser for running apps; `Cmd+Shift+P` toggle; auto-starts dev server; element selector `Cmd+Shift+S`
- [ ] **Plan pane** — shows proposed plan before changes (Plan permission mode)
- [ ] **Tasks pane** — running subagents, shell commands, dynamic workflows; click to see output or stop

### Session Management
- [ ] Parallel sessions — run multiple sessions simultaneously, each with own history and code changes
- [ ] Git worktree isolation per session — auto-creates isolated branch in `.claude/worktrees/`
- [ ] Split-view sessions — hold `Ctrl` + click sidebar session to view two side-by-side
- [ ] Session renaming — click title in toolbar
- [ ] Context usage ring — shows context window fill % + plan usage; click to expand
- [ ] Auto-archive on PR merge toggle
- [ ] OS push notification when background session finishes
- [ ] **Side chat** — `Ctrl+;` opens a second isolated conversation reading main thread context but not writing back

### Input Features
- [ ] `@mention` files — type `@filename` for autocomplete; adds file to context
- [ ] Stop button (ESC) — interrupt Claude mid-task
- [ ] Mid-task correction — type while Claude is running; reads correction at next step boundary
- [ ] View mode cycle (`Ctrl+O`): Normal / Verbose / Summary — controls tool call verbosity

### Permission Modes
- [ ] **Ask permissions** (default) — shows diff + asks before each edit
- [ ] **Auto accept edits** — auto-approves file edits; still asks before other terminal commands
- [ ] **Plan mode** — explore and propose plan without touching files
- [ ] **Auto** — minimal prompts, background safety classifier handles approval

### CI / PR Integration
- [ ] CI status bar in session toolbar after PR opened (polls GitHub CLI)
- [ ] Auto-fix toggle — Claude attempts to fix failing CI checks automatically
- [ ] Auto-merge toggle — Claude squash-merges PR once checks pass

### Environments
- [ ] Local environment — direct file access
- [ ] SSH environment — connect to remote machine via SSH config

---

## Cross-Mode Features (All Three Modes)

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+1/2/3` | Switch Chat / Cowork / Code mode |
| `Ctrl+K` | Command palette (already implemented) |
| `Alt+N` | New session/task/conversation (already implemented) |
| `Ctrl+Enter` | Send message |
| `Esc` | Stop generation / close modal |
| `Ctrl+Shift+C` | Copy last response |
| `↑` in empty input | Edit last user message |
| `Ctrl+/` | Show keyboard shortcut cheatsheet |

### Triage Architecture Unique Features
- [ ] **Live threshold slider** — draggable 1–10 slider in sidebar labeled "Route to cloud below:"; sends PATCH to `/config`; live preview "Escalate if score < 7"
- [ ] **Threshold zone visualization** — green "Local zone (≥7)" and purple "Cloud zone (<7)" resize as slider moves
- [ ] **Routing timeline** — colored dots per exchange at session bottom; hover shows confidence score
- [ ] **"Train your threshold" post-session review** — after session end, shows escalated messages with suggestion: raise or lower threshold?
- [ ] **Local capability score** — after 10+ exchanges: "Your local model handled X% of this topic confidently"
- [ ] **Cloud call quota warning** — user sets "max cloud calls/session"; banner at threshold: "3 of 5 cloud calls used"
- [ ] **Offline graceful degradation** — when Claude CLI unreachable: "Cloud fallback unavailable — all questions handled locally"
- [ ] **Local model identity card** — model name, "Running on: your machine", inference latency, model size
- [ ] **Response latency comparison** — local vs. cloud response time displayed per message; local usually wins for high-confidence topics

---

## Phase Roadmap

| Phase | Name | Core deliverable |
|-------|------|-----------------|
| ✅ P1 | Simple Langchain Agent | Basic chat with Ollama |
| ✅ P2 | Persona Agent | System prompt + FastAPI + UI |
| ✅ P3 | Tool-Using Agent | File tools with LangGraph |
| ✅ P4 | Confidence Scoring Agent | Score + badge UI |
| ✅ P5 | Triage Routing Agent | Local/Claude routing + session UI |
| 🔜 P6 | Episodic Memory Agent | Vector store for past conversations |
| 🔜 P7 | Semantic Memory Agent | Long-term knowledge extraction |
| 🔜 P8 | Summarizer Agent | Auto-compress long histories |
| 🔜 P9 | Three-Mode UI Shell | Chat / Cowork / Code tab bar + mode switching |
| 🔜 P10 | Cowork Mode | Task management, approval controls, dual-zone layout |
| 🔜 P11 | Code Mode | Diff pane, terminal pane, file editor, preview pane |
| 🔜 🏆 | **Milestone — [Name TBD]** | All phases combined into one complete local-first AI agent |

---

## Top 10 "Build First" Features (highest impact, lowest effort)

1. **Three-mode tab bar** — the visual foundation everything else needs
2. **Live threshold slider** — biggest behavioral impact; data already exists
3. **Routing timeline dots** — zero new data; pure visual; demo-worthy
4. **Confidence negotiation intercept** — makes the invisible architecture interactive
5. **Artifact side panel** — opens up code/document output to a whole new level
6. **Dual-zone layout for Cowork** — fundamental UX change; conversation vs. work output
7. **Pre-execution plan review** — the biggest UX differentiator for agentic mode
8. **File diff view in tool steps** — already show tool steps; diff makes them meaningful
9. **Full-text conversation search** — ChatGPT's biggest missing feature; easy win
10. **Cost-per-answer toggle** — the "wow" demo feature; no other tool does this

---

*Plan compiled from scouting: Claude Desktop docs, Notion Agent/Linear/ChatGPT Tasks/Copilot Studio patterns, AI chat UI research (TheFrontKit/925Studios/Smashing Magazine), and architecture-specific ideation for the local triage routing model.*
