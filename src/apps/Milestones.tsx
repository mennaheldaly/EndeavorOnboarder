import { useAppState } from '../state/AppState'
import './Apps.css'

interface MilestonesProps {
  type: 'sor-complete' | 'lsp-ready' | 'isp-ready'
  onContinue: () => void
}

export function Milestones({ type, onContinue }: MilestonesProps) {
  const { completedSORs, deliberationsComplete } = useAppState()

  if (type === 'sor-complete') {
    return (
      <div className="app-container">
        <div className="app-content" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
            All Second Opinion Reviews Complete
          </h1>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 3rem',
            padding: '3rem',
            background: 'var(--endeavor-gray-light)',
            borderRadius: '4px',
          }}>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              This phase typically takes several months. If mentor feedback is strong and founders are ready, 
              companies may proceed to Local Selection Panels. Multiple companies may be grouped into the same LSP cycle.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--endeavor-gray-dark)' }}>
              Completed SORs: {completedSORs.length} of 5
            </p>
          </div>
          <button className="primary" onClick={onContinue} style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
            Prepare for LSP
          </button>
        </div>
      </div>
    )
  }

  if (type === 'lsp-ready') {
    return (
      <div className="app-container">
        <div className="app-content" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
            Ready for Local Selection Panels
          </h1>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 3rem',
            padding: '3rem',
            background: 'var(--endeavor-gray-light)',
            borderRadius: '4px',
          }}>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
              The company has completed all SORs and is ready for panel evaluation. 
              You will observe 2-3 panels, each with 2 panelists.
            </p>
          </div>
          <button className="primary" onClick={onContinue} style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
            Begin LSP
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="app-content" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
          Ready for International Selection Panel
        </h1>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 3rem',
          padding: '3rem',
          background: 'var(--endeavor-gray-light)',
          borderRadius: '4px',
        }}>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
            Deliberations complete. The company has been approved to proceed to ISP. 
            Choose the ISP format and prepare for founder support activities.
          </p>
        </div>
        <button className="primary" onClick={onContinue} style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
          Continue to ISP
        </button>
      </div>
    </div>
  )
}

