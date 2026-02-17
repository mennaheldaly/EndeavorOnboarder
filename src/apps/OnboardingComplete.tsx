import { useAppState } from '../state/AppState'
import './Apps.css'

export function OnboardingComplete() {
  const { setCurrentApp } = useAppState()

  const handleAccessReport = () => {
    // Set flag to show report page
    localStorage.setItem('showReport', 'true')
    setCurrentApp('overview')
  }

  return (
    <div className="app-container">
      <div className="app-content" style={{
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '3rem 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Congratulations 🎉
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}>
            You've finished the Endeavor onboarding. Send this report to your manager.
          </p>
          <button
            className="primary"
            onClick={handleAccessReport}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: '#10b981',
              color: '#ffffff',
              transition: 'all 0.2s'
            }}
          >
            Access Report
          </button>
        </div>
      </div>
    </div>
  )
}
