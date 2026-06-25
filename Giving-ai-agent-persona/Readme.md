# Giving AI Agent a Persona — Phase 2

Builds on Phase 1 by giving the chatbot a configurable personality using a system prompt. Also introduces a FastAPI server so the agent can be used from the browser via the Agent Lab UI.

## What was built

- **Block 5** — Added a `SystemMessage` at the start of history to give the model a fixed personality
- **Block 6** — Made the persona dynamic — the user can define it before the conversation starts
- **server.py** — Wrapped the agent in a FastAPI server with three endpoints the UI talks to
- **UI integration** — Connected to the Agent Lab UI; persona can be set live from the sidebar

## What it does

- Accepts a custom persona that shapes how the assistant responds
- Remembers the full conversation history within a session
- Exposes a REST API that the Agent Lab UI connects to
- Persona can be changed at any time from the UI sidebar without restarting the server

## Endpoints

| Method | Path | What it does |
|--------|------|-------------|
| GET | `/capabilities` | Returns agent name, version, model, and feature flags |
| POST | `/chat` | Sends a message, returns the assistant's reply |
| POST | `/clear` | Clears conversation history (keeps persona) |
| POST | `/persona` | Updates the assistant's persona |

## Prerequisites

- Python 3.14+
- [Ollama](https://ollama.com) running locally with `llama3.2` pulled
- Agent Lab UI running (`npm run dev` inside `agent-ui/`)

## Setup

```bash
pip install langchain langchain-ollama fastapi uvicorn
```

## Run

```bash
python -m uvicorn server:app --reload --port 8000
```

Then open **http://localhost:5173** in your browser.

## Project structure

```
Giving-ai-agent-persona/
├── agent.py      # Chatbot logic with persona support
├── server.py     # FastAPI server (4 endpoints)
├── requirements.txt
└── Readme.md
```
