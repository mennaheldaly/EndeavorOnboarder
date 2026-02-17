import { useAppState } from '../state/AppState'
import './Apps.css'

interface FoundersLeaveProps {
  onContinue: () => void
}

export function FoundersLeave({ onContinue }: FoundersLeaveProps) {
  const { setFoundersLeft } = useAppState()

  const handleTellFounders = () => {
    setFoundersLeft(true)
  }

  return (
    <div className="app-container">
      <div className="app-content" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          padding: '2rem',
          background: 'var(--endeavor-gray-light)',
          borderRadius: '4px',
          marginBottom: '2rem',
        }}>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            Thank the founders and let them know you'll follow up after deliberations.
          </p>
        </div>

        <div style={{
          padding: '2rem',
          background: 'var(--endeavor-white)',
          border: '2px solid var(--endeavor-teal)',
          borderRadius: '4px',
          marginBottom: '2rem',
        }}>
          <p style={{ fontSize: '1rem', lineHeight: '1.8', fontStyle: 'italic', color: 'var(--endeavor-gray-dark)' }}>
            "Thank you for your time today — you're all set. We'll regroup with the panelists for deliberations and follow up with an update afterward."
          </p>
        </div>

        <div className="cta-section">
          <button 
            className="primary" 
            onClick={() => {
              handleTellFounders()
              onContinue()
            }}
            style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
          >
            Tell Founders They May Leave
          </button>
        </div>
      </div>
    </div>
  )
}

