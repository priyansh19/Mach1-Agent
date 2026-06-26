import { useEffect, useRef, useState, KeyboardEvent } from 'react';

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

interface Props {
  commands: Command[];
  onClose: () => void;
}

export function CommandPalette({ commands, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { setSelected(0); }, [query]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter')     { filtered[selected]?.action(); onClose(); }
    if (e.key === 'Escape')    { onClose(); }
  }

  function execute(cmd: Command) { cmd.action(); onClose(); }

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette-box" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Type a command…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="palette-list">
          {filtered.length === 0 && <div className="palette-empty">No commands match</div>}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`palette-item ${i === selected ? 'palette-item--active' : ''}`}
              onClick={() => execute(cmd)}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="palette-label">{cmd.label}</span>
              {cmd.shortcut && <span className="palette-shortcut">{cmd.shortcut}</span>}
            </button>
          ))}
        </div>
        <div className="palette-hint">↑↓ navigate · Enter select · Esc close</div>
      </div>
    </div>
  );
}
