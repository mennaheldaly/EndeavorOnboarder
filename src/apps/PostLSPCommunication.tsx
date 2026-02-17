import { useState } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'

interface PostLSPCommunicationProps {
  onComplete: () => void
}

export function PostLSPCommunication({ onComplete }: PostLSPCommunicationProps) {
  const { selectedChampion } = useAppState()
  const [completed, setCompleted] = useState(false)

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 style={{ marginBottom: '2rem' }}>Panelist Communication</h1>
        
        <div style={{
          padding: '2rem',
          background: 'var(--endeavor-gray-light)',
          borderRadius: '4px',
          marginBottom: '2rem',
          maxWidth: '800px',
        }}>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            Panelists should be informed of the final LSP outcome. Avoid sharing how individual panelists voted.
          </p>
        </div>

        <div style={{
          padding: '2rem',
          background: 'var(--endeavor-white)',
          border: '1px solid var(--endeavor-gray)',
          borderRadius: '4px',
          maxWidth: '600px',
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Call Summary / Confirmation Checklist</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                onChange={(e) => {
                  if (e.target.checked) {
                    setCompleted(true)
                  }
                }}
              />
              <span>All panelists notified of LSP outcome</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span>Champion ({selectedChampion}) confirmed for follow-up</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span>No individual voting details shared</span>
            </label>
          </div>
        </div>

        <div className="cta-section">
          <button 
            className="primary" 
            onClick={onComplete}
            disabled={!completed}
            style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
          >
            Prepare Champion Follow-Up
          </button>
        </div>
      </div>
    </div>
  )
}

