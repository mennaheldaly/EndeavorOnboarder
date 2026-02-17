import { useAppState } from '../state/AppState'
import './Apps.css'

interface ISPSignupProps {
  onSignup: () => void
}

export function ISPSignup({ onSignup }: ISPSignupProps) {
  const { setISPReady, setISPSignedUp } = useAppState()

  const handleSignup = () => {
    setISPSignedUp(true)
    setISPReady(true)
    onSignup()
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
          ISP Registration
        </h1>

        <div style={{
          padding: 'var(--spacing-xl)',
          background: 'var(--endeavor-white)',
          borderRadius: '4px',
          marginBottom: 'var(--spacing-xl)',
          textAlign: 'center',
          border: '2px solid var(--endeavor-teal)'
        }}>
          <p style={{ 
            fontSize: '1.125rem', 
            lineHeight: 1.8,
            color: 'var(--endeavor-gray-dark)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Sign up TechFlow Solutions for the International Selection Panel.
          </p>
        </div>

        <button
          className="primary"
          onClick={handleSignup}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.125rem'
          }}
        >
          Sign up for Athens ISP December 2026
        </button>
      </div>
    </div>
  )
}
