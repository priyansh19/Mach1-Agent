import type { Capabilities, ChatResponse } from './types';

export async function fetchCapabilities(): Promise<Capabilities> {
  const res = await fetch('/capabilities');
  if (!res.ok) throw new Error('Server unreachable');
  return res.json() as Promise<Capabilities>;
}

export async function sendChat(message: string, signal?: AbortSignal): Promise<ChatResponse> {
  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json() as Promise<ChatResponse>;
}

export async function clearConversation(): Promise<void> {
  try {
    await fetch('/clear', { method: 'POST' });
  } catch {
    // older agents may not support /clear yet — that's fine
  }
}

export async function setPersona(persona: string): Promise<void> {
  try {
    await fetch('/persona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona }),
    });
  } catch {
    // older agents may not support /persona yet — that's fine
  }
}
