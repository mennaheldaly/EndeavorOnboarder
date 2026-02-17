import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'

interface ReportData {
  for: {
    questions: string[]
    pitchBullets: string[]
  }
  sor: Array<{
    id: number
    sorNumber: number
    mentorName?: string
    feedback?: string
    notes?: string
  }>
  lsp: {
    panelsNotes: Array<{ panelNumber: number; notes: string }>
    deliberationsNotes: string
  }
}

export function Report() {
  const { 
    assessments,
    lspPanels,
    deliberationsNotes,
    setCurrentApp
  } = useAppState()

  const [reportData, setReportData] = useState<ReportData | null>(null)

  useEffect(() => {
    // Gather report data from various sources
    const gatherReportData = (): ReportData => {
      // FOR data - check localStorage (persisted for report)
      const FOR_STORAGE_KEY = 'for_techflow-solutions'
      const forDataStr = localStorage.getItem(FOR_STORAGE_KEY)
      let forQuestions: string[] = []
      let forPitchBullets: string[] = []
      
      if (forDataStr) {
        try {
          const forData = JSON.parse(forDataStr)
          // Check if we have persisted report data
          if (forData.reportQuestions) {
            forQuestions = forData.reportQuestions
          }
          if (forData.reportPitchBullets) {
            forPitchBullets = forData.reportPitchBullets
          }
        } catch (e) {
          console.warn('[Report] Failed to parse FOR data', e)
        }
      }

      // SOR data - from assessments
      const sorData = assessments
        .filter(a => a.sorNumber && a.status === 'completed')
        .map(a => ({
          id: a.sorNumber, // Convert to number - use sorNumber as id
          sorNumber: a.sorNumber,
          mentorName: a.mentorName,
          feedback: a.feedback || '',
          notes: '' // Assessments don't have separate notes field, use feedback
        }))
        .sort((a, b) => a.sorNumber - b.sorNumber)

      // LSP data - from lspPanels and deliberationsNotes
      const panelsNotes = lspPanels
        .filter(panel => panel.notes && panel.notes.trim())
        .map(panel => ({
          panelNumber: panel.id,
          notes: panel.notes
        }))
        .sort((a, b) => a.panelNumber - b.panelNumber)

      return {
        for: {
          questions: forQuestions,
          pitchBullets: forPitchBullets
        },
        sor: sorData,
        lsp: {
          panelsNotes,
          deliberationsNotes: deliberationsNotes || ''
        }
      }
    }

    const data = gatherReportData()
    setReportData(data)
    console.log('[Report] Gathered report data', data)
  }, [assessments, lspPanels, deliberationsNotes])

  const handleCopyReport = () => {
    if (!reportData) return

    let reportText = 'ENDEAVOR ONBOARDING SUMMARY REPORT\n'
    reportText += '='.repeat(50) + '\n\n'

    // FOR Section
    reportText += 'FIRST OPINION REVIEW (FOR)\n'
    reportText += '-'.repeat(50) + '\n\n'
    
    if (reportData.for.questions.length > 0) {
      reportText += 'Questions Asked:\n'
      reportData.for.questions.forEach((q, i) => {
        reportText += `${i + 1}. ${q}\n`
      })
      reportText += '\n'
    } else {
      reportText += 'Questions Asked: No questions recorded.\n\n'
    }

    if (reportData.for.pitchBullets.length > 0) {
      reportText += 'Endeavor Intro Pitch:\n'
      reportData.for.pitchBullets.forEach((bullet, i) => {
        reportText += `• ${bullet}\n`
      })
      reportText += '\n'
    } else {
      reportText += 'Endeavor Intro Pitch: No pitch bullets recorded.\n\n'
    }

    // SOR Section
    reportText += '\nSECOND OPINION REVIEWS (SOR)\n'
    reportText += '-'.repeat(50) + '\n\n'
    
    if (reportData.sor.length > 0) {
      reportData.sor.forEach((sor) => {
        reportText += `SOR #${sor.sorNumber}`
        if (sor.mentorName) {
          reportText += ` - ${sor.mentorName}`
        }
        reportText += '\n'
        if (sor.feedback) {
          reportText += `${sor.feedback}\n`
        } else {
          reportText += 'No notes captured.\n'
        }
        reportText += '\n'
      })
    } else {
      reportText += 'No SOR notes captured.\n\n'
    }

    // LSP Section
    reportText += '\nLOCAL SELECTION PANEL (LSP)\n'
    reportText += '-'.repeat(50) + '\n\n'
    
    if (reportData.lsp.panelsNotes.length > 0) {
      reportText += 'Panel Notes:\n'
      reportData.lsp.panelsNotes.forEach((panel) => {
        reportText += `Panel #${panel.panelNumber}:\n`
        reportText += `${panel.notes}\n\n`
      })
    } else {
      reportText += 'Panel Notes: No panel notes captured.\n\n'
    }

    if (reportData.lsp.deliberationsNotes) {
      reportText += 'Deliberations Notes:\n'
      reportText += `${reportData.lsp.deliberationsNotes}\n`
    } else {
      reportText += 'Deliberations Notes: No notes captured.\n'
    }

    navigator.clipboard.writeText(reportText)
    alert('Report copied to clipboard!')
  }

  const handleBack = () => {
    localStorage.removeItem('showReport')
    setCurrentApp('overview')
  }

  if (!reportData) {
    return (
      <div className="app-container">
        <div className="app-content" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading report data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="app-content" style={{
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: '#111827',
              fontFamily: 'serif'
            }}>
              Endeavor Onboarding Summary
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              Tip: Copy/paste this into an email to your manager.
            </p>
          </div>

          {/* FOR Section */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: '#111827',
              fontFamily: 'serif',
              borderBottom: '2px solid #10b981',
              paddingBottom: '0.5rem'
            }}>
              First Opinion Review (FOR)
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                color: '#374151'
              }}>
                Questions Asked
              </h3>
              {reportData.for.questions.length > 0 ? (
                <ul style={{
                  listStyle: 'disc',
                  paddingLeft: '1.5rem',
                  color: '#374151',
                  lineHeight: 1.8
                }}>
                  {reportData.for.questions.map((q, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{q}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No questions recorded.</p>
              )}
            </div>

            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                color: '#374151'
              }}>
                Endeavor Intro Pitch
              </h3>
              {reportData.for.pitchBullets.length > 0 ? (
                <ul style={{
                  listStyle: 'disc',
                  paddingLeft: '1.5rem',
                  color: '#374151',
                  lineHeight: 1.8
                }}>
                  {reportData.for.pitchBullets.map((bullet, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No pitch bullets recorded.</p>
              )}
            </div>
          </section>

          {/* SOR Section */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: '#111827',
              fontFamily: 'serif',
              borderBottom: '2px solid #10b981',
              paddingBottom: '0.5rem'
            }}>
              Second Opinion Reviews (SOR)
            </h2>

            {reportData.sor.length > 0 ? (
              reportData.sor.map((sor) => (
                <div key={sor.id} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    SOR #{sor.sorNumber}
                    {sor.mentorName && ` - ${sor.mentorName}`}
                  </h3>
                  {sor.feedback ? (
                    <p style={{
                      color: '#374151',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap'
                    }}>{sor.feedback}</p>
                  ) : (
                    <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No notes captured.</p>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No SOR notes captured.</p>
            )}
          </section>

          {/* LSP Section */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: '#111827',
              fontFamily: 'serif',
              borderBottom: '2px solid #10b981',
              paddingBottom: '0.5rem'
            }}>
              Local Selection Panel (LSP)
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                color: '#374151'
              }}>
                Panel Notes
              </h3>
              {reportData.lsp.panelsNotes.length > 0 ? (
                reportData.lsp.panelsNotes.map((panel) => (
                  <div key={panel.panelNumber} style={{ marginBottom: '1rem' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: '#6b7280'
                    }}>
                      Panel #{panel.panelNumber}
                    </h4>
                    <p style={{
                      color: '#374151',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap'
                    }}>{panel.notes}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No panel notes captured.</p>
              )}
            </div>

            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                color: '#374151'
              }}>
                Deliberations Notes
              </h3>
              {reportData.lsp.deliberationsNotes ? (
                <p style={{
                  color: '#374151',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap'
                }}>{reportData.lsp.deliberationsNotes}</p>
              ) : (
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No notes captured.</p>
              )}
            </div>
          </section>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb',
            marginTop: '2rem'
          }}>
            <button
              onClick={handleBack}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Back
            </button>
            <button
              onClick={handleCopyReport}
              className="primary"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '8px',
                border: 'none',
                background: '#10b981',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Copy Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
