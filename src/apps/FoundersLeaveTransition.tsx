import { useAppState } from '../state/AppState'
import './Apps.css'

interface FoundersLeaveTransitionProps {
  onBeginDeliberations: () => void
}

export function FoundersLeaveTransition({ onBeginDeliberations }: FoundersLeaveTransitionProps) {
  const { setFoundersLeft } = useAppState()

  const handleBeginDeliberations = () => {
    setFoundersLeft(true)
    // The FlowController will automatically show Deliberations when foundersLeft is true
    onBeginDeliberations()
  }


  return (
    <div className="app-container">
      <div className="app-content" style={{ 
        maxWidth: '1152px', // max-w-6xl equivalent
        margin: '0 auto', 
        padding: 'var(--spacing-xl) var(--spacing-lg)'
      }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 700, 
          marginBottom: '2rem',
          color: '#111827',
          textAlign: 'left'
        }}>
          Transition to Deliberations
        </h1>

        {/* Instruction Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          textAlign: 'left'
        }}>
          {/* Explanation Paragraphs */}
          <p style={{ 
            fontSize: '0.9375rem', 
            lineHeight: 1.6,
            color: '#374151',
            marginBottom: '1rem'
          }}>
            The founder presentation and Q&A are now complete.
          </p>

          <p style={{ 
            fontSize: '0.9375rem', 
            lineHeight: 1.6,
            color: '#374151',
            marginBottom: '1rem'
          }}>
            At this point, ask the founders to step out so the panelists can regroup privately. The panel will discuss their perspectives, deliberate, and work toward a decision.
          </p>

          <p style={{ 
            fontSize: '0.9375rem', 
            lineHeight: 1.6,
            color: '#374151',
            marginBottom: 0
          }}>
            Your role is to capture structured notes throughout the deliberation, including key feedback, concerns, and the final outcome.
          </p>
        </div>

        {/* Begin Deliberations Button */}
        <button
          className="primary"
          onClick={handleBeginDeliberations}
          style={{
            padding: '0.875rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Begin Deliberations
        </button>
      </div>
    </div>
  )
}
