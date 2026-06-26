interface Props { onClose: () => void; }

const SHORTCUTS = [
  { key: 'Ctrl+K',         action: 'Open command palette' },
  { key: 'Alt+N',          action: 'New session' },
  { key: 'Ctrl+1',         action: 'Switch to Chat mode' },
  { key: 'Ctrl+2',         action: 'Switch to Cowork mode' },
  { key: 'Ctrl+3',         action: 'Switch to Code mode' },
  { key: 'Enter',          action: 'Send message' },
  { key: 'Ctrl+Enter',     action: 'Send message (alternative)' },
  { key: 'Shift+Enter',    action: 'New line in input' },
  { key: '↑ (empty input)','action': 'Recall last sent message' },
  { key: 'Esc',            action: 'Close modal / stop generation' },
  { key: 'Ctrl+/',         action: 'Show this cheatsheet' },
];

export function ShortcutCheatsheet({ onClose }: Props) {
  return (
    <div className="palette-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cheatsheet-box">
        <div className="cheatsheet-header">
          <span>Keyboard Shortcuts</span>
          <button className="cheatsheet-close" onClick={onClose}>✕</button>
        </div>
        <div className="cheatsheet-list">
          {SHORTCUTS.map(s => (
            <div key={s.key} className="cheatsheet-row">
              <kbd className="cheatsheet-key">{s.key}</kbd>
              <span className="cheatsheet-action">{s.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
