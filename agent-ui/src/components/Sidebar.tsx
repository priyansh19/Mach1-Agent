import type { Capabilities, ConnectionStatus } from '../types';

interface Props {
  capabilities: Capabilities | null;
  status: ConnectionStatus;
  onClear: () => void;
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connecting: 'Connecting…',
  online:     'Online',
  offline:    'Offline — retrying…',
};

export function Sidebar({ capabilities, status, onClear }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo">Agent Lab</span>
      </div>

      <section className="sidebar-section">
        <p className="section-title">Active Agent</p>
        <p className="agent-name">
          {capabilities?.agent_name ?? 'Connecting…'}
        </p>
        <div className="tag-row">
          {capabilities?.version && (
            <span className="tag tag--blue">v{capabilities.version}</span>
          )}
          {capabilities?.model && (
            <span className="tag tag--purple">{capabilities.model}</span>
          )}
        </div>
      </section>

      <section className="sidebar-section">
        <p className="section-title">Features</p>
        <div className="feature-list">
          {capabilities
            ? Object.entries(capabilities.features).map(([key, enabled]) => (
                <div key={key} className="feature-row">
                  <span className="feature-name">{formatKey(key)}</span>
                  <span className={`badge ${enabled ? 'badge--on' : 'badge--off'}`}>
                    {enabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))
            : <span className="muted">Waiting for server…</span>
          }
        </div>
      </section>

      <div className="sidebar-footer">
        <button className="btn-new-chat" onClick={onClear}>
          ↺ New Conversation
        </button>
        <div className="status-row">
          <div className={`dot dot--${status}`} />
          <span className="muted">{STATUS_LABEL[status]}</span>
        </div>
      </div>
    </aside>
  );
}

function formatKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
