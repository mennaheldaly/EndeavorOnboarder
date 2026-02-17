import { useAppState } from '../state/AppState'
import './Apps.css'

interface LSPCompleteProps {
  onContinue: () => void
}

export function LSPComplete({ onContinue }: LSPCompleteProps) {
  const { setISPReady } = useAppState()

  const handleContinue = () => {
    setISPReady(true)
    onContinue()
  }

  return (
    <div className="app-container">
      <div className="app-content" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: 'var(--spacing-xl)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 600, 
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--endeavor-black)'
        }}>
          LSP Completed
        </h1>

        <div style={{
          padding: 'var(--spacing-xl)',
          background: 'var(--endeavor-white)',
          borderRadius: '4px',
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'left'
        }}>
          <p style={{ 
            fontSize: '1.125rem', 
            lineHeight: 1.8,
            color: 'var(--endeavor-gray-dark)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Unanimous approval achieved. Champion follow-up scheduled and logged. Company can proceed to ISP preparation when ready.
          </p>
        </div>

        <button
          className="primary"
          onClick={handleContinue}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.125rem'
          }}
        >
          Continue to ISP Preparation
        </button>
      </div>
    </div>
  )
}
