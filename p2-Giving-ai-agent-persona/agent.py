from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

llm = ChatOllama(model="llama3.2")

DEFAULT_PROMPT = "You are a helpful assistant who replies in a concise and friendly manner."
history = [SystemMessage(content=DEFAULT_PROMPT)]

def set_persona(persona: str) -> None:
    history.clear()
    history.append(SystemMessage(content=persona))

def chat(message: str) -> str:
    history.append(HumanMessage(content=message))
    response = llm.invoke(history)
    history.append(AIMessage(content=response.content))
    return response.content

def clear_history() -> None:
    persona = history[0].content if history else DEFAULT_PROMPT
    history.clear()
    history.append(SystemMessage(content=persona))