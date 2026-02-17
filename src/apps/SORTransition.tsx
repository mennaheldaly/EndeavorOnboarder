import { useAppState } from '../state/AppState'
import './Apps.css'

interface SORTransitionProps {
  onContinue: () => void
}

export function SORTransition({ onContinue }: SORTransitionProps) {
  return (
    <div className="app-container">
      <div className="app-content" style={{ 
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
            <h1 style={{ 
              fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: '#111827',
              lineHeight: 1.2
            }}>
              Second Opinion Reviews
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              margin: 0
            }}>
              TechFlow Solutions
            </p>
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            background: '#f3f4f6',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-start'
          }}>
            Stage complete: SOR #1
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card: What happens during SORs */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#111827'
              }}>
                What happens during SORs
              </h2>
              <p style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: '#374151',
                marginBottom: '1rem'
              }}>
                This same process is repeated for a total of five Second Opinion Reviews, each with a different mentor.
              </p>
              <p style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: '#6b7280',
                marginBottom: '0.75rem',
                fontWeight: 500
              }}>
                Over the coming weeks and months:
              </p>
              <ul style={{
                fontSize: '0.9375rem',
                lineHeight: 1.8,
                color: '#374151',
                margin: 0,
                paddingLeft: '1.5rem'
              }}>
                <li style={{ marginBottom: '0.5rem' }}>SORs are scheduled</li>
                <li style={{ marginBottom: '0.5rem' }}>Meetings are held</li>
                <li style={{ marginBottom: '0.5rem' }}>Notes and assessments are logged in Salesforce</li>
              </ul>
            </div>

            {/* Card: When to start the profile */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#111827'
              }}>
                When to start the profile
              </h2>
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '0.75rem'
              }}>
                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#1e40af',
                  margin: 0
                }}>
                  After the second or third SOR, you will begin writing the profile. There are tips on how to write a profile throughout the document. It must be completed 2 weeks before the LSP so that it's given to panelists.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card: Summary */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#111827'
              }}>
                Summary
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total SORs:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>5 (each with a different mentor)</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Profile drafting:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>After SOR 2–3</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Deadline:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>2 weeks before LSP</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Outcome:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>Proceed to LSP if SOR feedback is strong</span>
                </div>
              </div>
            </div>

            {/* Card: What's next */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#111827'
              }}>
                What's next
              </h2>
              <p style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: '#374151',
                marginBottom: '1.5rem'
              }}>
                Once all five Second Opinion Reviews are completed and feedback is strong, companies may proceed to the Local Selection Panels (LSP).
              </p>
              <button 
                className="primary" 
                onClick={onContinue}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                PROCEED TO LSP PREPARATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
