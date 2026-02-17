import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'

interface SynthesizeNotesProps {
  onComplete: () => void
}

export function SynthesizeNotes({ onComplete }: SynthesizeNotesProps) {
  const {
    lspPanels,
    deliberationsNotes,
    lspPros,
    lspCons,
    updateLSPPros,
    updateLSPCons,
    setProsConsDrafted,
    setCurrentApp
  } = useAppState()

  const [localPros, setLocalPros] = useState<string[]>(lspPros.length > 0 ? lspPros : [''])
  const [localCons, setLocalCons] = useState<string[]>(lspCons.length > 0 ? lspCons : [''])
  const [localRecap, setLocalRecap] = useState(localStorage.getItem('lspRecap') || '')

  // Debug logging for mount/unmount
  useEffect(() => {
    console.log('[SYNTHESIZE] mounted', { 
      hasPros: localPros.length > 0,
      hasCons: localCons.length > 0
    })
    return () => {
      console.log('[SYNTHESIZE] unmounted')
    }
  }, [])

  const handleAddPro = () => {
    setLocalPros([...localPros, ''])
  }

  const handleAddCon = () => {
    setLocalCons([...localCons, ''])
  }

  const handleUpdatePro = (index: number, value: string) => {
    const newPros = [...localPros]
    newPros[index] = value
    setLocalPros(newPros)
  }

  const handleUpdateCon = (index: number, value: string) => {
    const newCons = [...localCons]
    newCons[index] = value
    setLocalCons(newCons)
  }

  const handleRemovePro = (index: number) => {
    setLocalPros(localPros.filter((_, i) => i !== index))
  }

  const handleRemoveCon = (index: number) => {
    setLocalCons(localCons.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const filteredPros = localPros.filter(p => p.trim())
    const filteredCons = localCons.filter(c => c.trim())
    
    updateLSPPros(filteredPros)
    updateLSPCons(filteredCons)
    localStorage.setItem('lspRecap', localRecap)
    setProsConsDrafted(true)
    
    // Update step state for Post-LSP workflow
    const caseId = 'techflow-solutions' // In production, this would come from route/context
    const STORAGE_KEY = `postLspSteps_${caseId}`
    const saved = localStorage.getItem(STORAGE_KEY)
    let steps = saved ? JSON.parse(saved) : {
      founderEmailSent: false,
      notesSynthesized: false,
      championEmailSent: false
    }
    steps.notesSynthesized = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(steps))
    console.log('[PostLSP] Step 2 complete: notes synthesized', { caseId, steps })
    
    // Dispatch event for Post-LSP Next Steps
    window.dispatchEvent(new CustomEvent('post-lsp-step2-complete'))
    
    // Return to Post-LSP Next Steps screen if flag is set
    const returnToPostLSP = localStorage.getItem('returnToPostLSPNextSteps') === 'true'
    console.log('[SYNTHESIZE] saved, returning', { 
      returnTo: returnToPostLSP ? 'post-lsp-next-steps' : null
    })
    
    if (returnToPostLSP) {
      localStorage.removeItem('returnToPostLSPNextSteps')
      setCurrentApp('overview')
    } else {
      onComplete()
    }
  }

  return (
    <div className="app-container" style={{ 
      height: 'calc(100vh - 60px)', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="app-content" style={{ 
        padding: '1.5rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          marginBottom: '1.5rem',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#111827'
        }}>
          Synthesize LSP Notes
        </h1>
        
        {/* Two-column fixed-height layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 400px', 
          gap: '1.5rem',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* LEFT: Editable fields */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            overflowY: 'auto',
            paddingRight: '0.5rem'
          }}>
            {/* Strengths */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '0.75rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  margin: 0
                }}>
                  Strengths
                </h2>
                <button 
                  onClick={handleAddPro} 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.875rem',
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#374151',
                    fontWeight: 500
                  }}
                >
                  + Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {localPros.map((pro, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => handleUpdatePro(index, e.target.value)}
                      placeholder="Enter a strength..."
                      style={{ 
                        flex: 1, 
                        padding: '0.625rem',
                        fontSize: '0.875rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button 
                      onClick={() => handleRemovePro(index)} 
                      style={{ 
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        fontSize: '1.25rem',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {localPros.length === 0 && (
                  <p style={{ 
                    color: '#6b7280', 
                    fontStyle: 'italic', 
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    Click "+ Add" to add strengths
                  </p>
                )}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '0.75rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  margin: 0
                }}>
                  Challenges / Gaps
                </h2>
                <button 
                  onClick={handleAddCon} 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.875rem',
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#374151',
                    fontWeight: 500
                  }}
                >
                  + Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {localCons.map((con, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => handleUpdateCon(index, e.target.value)}
                      placeholder="Enter a challenge or gap..."
                      style={{ 
                        flex: 1, 
                        padding: '0.625rem',
                        fontSize: '0.875rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button 
                      onClick={() => handleRemoveCon(index)} 
                      style={{ 
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        fontSize: '1.25rem',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {localCons.length === 0 && (
                  <p style={{ 
                    color: '#6b7280', 
                    fontStyle: 'italic', 
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    Click "+ Add" to add challenges or gaps
                  </p>
                )}
              </div>
            </div>

            {/* Recap */}
            <div>
              <h2 style={{ 
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '0.75rem',
                margin: 0
              }}>
                Recap & Pre-ISP Milestones
              </h2>
              <textarea
                value={localRecap}
                onChange={(e) => setLocalRecap(e.target.value)}
                placeholder="Enter recap and pre-ISP milestones..."
                style={{ 
                  width: '100%',
                  minHeight: '150px',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* RIGHT: Read-only notes */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            borderLeft: '1px solid #e5e7eb',
            paddingLeft: '1.5rem',
            gap: '1.25rem'
          }}>
            <h2 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '0.5rem',
              margin: 0
            }}>
              LSP Notes
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ 
                  fontSize: '0.8125rem', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Panel #1 Notes
                </h3>
                <div style={{
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  minHeight: '100px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  {lspPanels[0]?.notes || 'No notes recorded'}
                </div>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: '0.8125rem', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Panel #2 Notes
                </h3>
                <div style={{
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  minHeight: '100px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  {lspPanels[1]?.notes || 'No notes recorded'}
                </div>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: '0.8125rem', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Panel #3 Notes
                </h3>
                <div style={{
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  minHeight: '100px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  {lspPanels[2]?.notes || 'No notes recorded'}
                </div>
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: '0.8125rem', 
                  marginBottom: '0.5rem', 
                  fontWeight: 600,
                  color: '#374151',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Deliberations Notes
                </h3>
                <div style={{
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  minHeight: '100px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: '#374151',
                  border: '1px solid #e5e7eb'
                }}>
                  {deliberationsNotes || 'No notes recorded'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ 
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0
        }}>
          <button 
            className="primary" 
            onClick={handleSave} 
            style={{ 
              padding: '0.75rem 2rem', 
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px'
            }}
          >
            Save synthesis
          </button>
        </div>
      </div>
    </div>
  )
}
