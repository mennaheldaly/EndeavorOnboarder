import { useState } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'

interface LSPOverviewProps {
  onBegin: () => void
}

export function LSPOverview({ onBegin }: LSPOverviewProps) {
  const { lspPanels, deliberationsComplete, selectedChampion, championFollowupScheduled } = useAppState()
  const [selectedCompany, setSelectedCompany] = useState('techflow')
  
  const panel1Complete = lspPanels.find(p => p.id === 1)?.completed || false
  const panel2Complete = lspPanels.find(p => p.id === 2)?.completed || false
  const panel3Complete = lspPanels.find(p => p.id === 3)?.completed || false
  
  const companies = [
    {
      id: 'techflow',
      name: 'TechFlow Solutions',
      tags: 'FinTech • Mexico',
      status: 'Ready for LSP',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'greentech',
      name: 'GreenTech Innovations',
      tags: 'CleanTech • Colombia',
      status: 'Ready for LSP',
      avatar: null
    }
  ]
  
  return (
    <div className="app-container">
      <div className="app-content" style={{ 
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        maxWidth: '1152px', // max-w-6xl equivalent
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.25rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: '#111827',
              lineHeight: 1.2
            }}>
              LSP Cycle
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              Panels run like structured SORs: founders pitch, panelists ask questions, you capture notes.
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
            Stage: LSP Preparation
          </div>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* LEFT COLUMN - Company Selection + Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Companies in LSP Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#111827'
              }}>
                Companies in LSP
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {companies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => setSelectedCompany(company.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedCompany === company.id ? '#f9fafb' : 'transparent',
                      borderLeft: selectedCompany === company.id ? '3px solid #14b8a6' : '3px solid transparent',
                      transition: 'all 0.15s'
                    }}
                  >
                    {company.avatar ? (
                      <img 
                        src={company.avatar}
                        alt={company.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        🏢
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        {company.name}
                      </div>
                      <div style={{
                        fontSize: '0.8125rem',
                        color: '#6b7280'
                      }}>
                        {company.tags}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      whiteSpace: 'nowrap'
                    }}>
                      {company.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How the LSP cycle works Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.125rem' }}>ℹ️</span>
                How the LSP cycle works
              </h2>
              <ul style={{
                margin: 0,
                paddingLeft: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <li style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#6b7280'
                }}>
                  In an LSP cycle, 2–3 companies typically move through the same set of panels in parallel, alternating across Panel #1–#3.
                </li>
                <li style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#6b7280'
                }}>
                  You will focus on your assigned company (TechFlow Solutions), attending every panel with them and capturing notes throughout the discussions.
                </li>
                <li style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#6b7280'
                }}>
                  LSPs are held in a booked physical location and usually last 5–6 hours, covering introductions, panels, and final deliberations.
                </li>
                <li style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#6b7280'
                }}>
                  Your role is to capture structured notes, log outcomes, and ensure all feedback is documented properly.
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN - Checklist + CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Checklist Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: '#111827'
              }}>
                LSP Checklist — TechFlow Solutions
              </h2>
              <p style={{
                fontSize: '0.8125rem',
                color: '#6b7280',
                marginBottom: '1rem'
              }}>
                Complete each step as you progress through the LSP cycle.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 0',
                  fontSize: '0.9375rem',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '1.125rem', width: '1.5rem', textAlign: 'center' }}>
                    {panel1Complete ? '✓' : '○'}
                  </span>
                  <span>Panel #1 (2 panelists)</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 0',
                  fontSize: '0.9375rem',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '1.125rem', width: '1.5rem', textAlign: 'center' }}>
                    {panel2Complete ? '✓' : '○'}
                  </span>
                  <span>Panel #2 (2 panelists)</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 0',
                  fontSize: '0.9375rem',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '1.125rem', width: '1.5rem', textAlign: 'center' }}>
                    {panel3Complete ? '✓' : '○'}
                  </span>
                  <span>Panel #3 (2 panelists)</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 0',
                  fontSize: '0.9375rem',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '1.125rem', width: '1.5rem', textAlign: 'center' }}>
                    {deliberationsComplete ? '✓' : '○'}
                  </span>
                  <span>Deliberations (all 6 panelists)</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 0',
                  fontSize: '0.9375rem',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '1.125rem', width: '1.5rem', textAlign: 'center' }}>
                    {selectedChampion ? '✓' : '○'}
                  </span>
                  <span>Outcome + Champion</span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 0',
                  fontSize: '0.9375rem',
                  color: '#374151'
                }}>
                  <span style={{ fontSize: '1.125rem', width: '1.5rem', textAlign: 'center' }}>
                    {championFollowupScheduled ? '✓' : '○'}
                  </span>
                  <span>Champion follow-up scheduled + logged</span>
                </div>
              </div>
            </div>

            {/* Next Step Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                color: '#111827'
              }}>
                Next step
              </h2>
              <p style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: '#374151',
                marginBottom: '1.5rem'
              }}>
                Start with Panel #1 and log notes as panelists ask questions.
              </p>
              {!panel1Complete ? (
                <button 
                  className="primary" 
                  onClick={onBegin}
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
                  Enter Panel #1
                </button>
              ) : !panel2Complete ? (
                <p style={{ 
                  fontSize: '0.9375rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Panel #1 complete. Continue to Panel #2.
                </p>
              ) : !panel3Complete ? (
                <p style={{ 
                  fontSize: '0.9375rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Panel #2 complete. Continue to Panel #3.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
