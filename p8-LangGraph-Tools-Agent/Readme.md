# Phase 8 — LangGraph Tools Agent + Summarizer

> Builds on Phase 7. Replaces the flat `create_react_agent` setup with a full **LangGraph state graph**, adds web search + MCP tool support, and closes the memory loop with a **Summarizer Agent** that distills episodic chats into semantic facts every N turns.

---

## What's New in Phase 8

| Feature | Detail |
|---|---|
| **Custom LangGraph graph** | Explicit nodes for triage, local agent, Claude fallback, memory save, summarizer |
| **Web search tool** | DuckDuckGo search via `langchain-community` — no API key needed |
| **Wikipedia tool** | Instant factual lookups via `langchain-community` |
| **MCP tool support** | `langchain-mcp-adapters` — any MCP server's tools drop in as LangChain tools |
| **Summarizer Agent** | Every N turns, distills raw episodic memory into clean semantic facts |
| **Conditional graph edges** | Triage node routes to local or Claude based on confidence score |

---

## Architecture

```
START
  │
  ▼
[triage_node] ── score ≥ threshold ──► [local_agent_node]
      │                                        │ ↕ tool calls
      │ score < threshold                      │ (file, web, wiki, MCP...)
      ▼                                        │
[claude_node] ◄──────────────────────────────┘
      │
      ▼
[memory_save_node] ── saves to episodic memory
      │
      ▼ every N=10 turns
[summarizer_node] ── distills facts → semantic memory
      │
     END
```

---

## Memory Pipeline (now complete)

```
User message
    │
    ▼
[RAG retrieval] ← episodic_memory + semantic_memory
    │
    ▼
[LangGraph agent] → response
    │
    ▼
[memory_save_node] → episodic_memory (raw chat)
    │
    ▼ (every N=10 turns)
[summarizer_node] → semantic_memory (distilled facts)
```

---

## Tools Available

| Tool | Source | API Key? |
|---|---|---|
| `create_file` | Local file system | No |
| `read_file` | Local file system | No |
| `edit_file` | Local file system | No |
| `append_to_file` | Local file system | No |
| `web_search` | DuckDuckGo | No |
| `wikipedia` | Wikipedia API | No |
| MCP tools | Any MCP server via `langchain-mcp-adapters` | Depends on server |

---

## New Dependencies

```
langchain-community       # DuckDuckGo + Wikipedia tools
langchain-mcp-adapters    # MCP tool bridge
duckduckgo-search         # DuckDuckGo backend
langgraph                 # Already present, now used explicitly
```

---

## Running

```bash
cd p8-LangGraph-Tools-Agent
pip install -r requirements.txt
python server.py
# → http://localhost:8000
```

---

## Key Differences from Phase 7

| | Phase 7 | Phase 8 |
|---|---|---|
| Graph | `create_react_agent` (prebuilt) | Custom `StateGraph` with explicit nodes |
| Claude routing | `subprocess.run(["claude", ...])` | LangGraph Claude node with history |
| Web access | None | DuckDuckGo + Wikipedia |
| MCP tools | None | via `langchain-mcp-adapters` |
| Summarizer | None | Every N=10 turns |
| Memory loop | Open (never consolidates) | Closed (episodic → semantic) |
