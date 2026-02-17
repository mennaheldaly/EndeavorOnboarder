import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'

interface PostLSPNextStepsProps {
  onStep1Complete: () => void
  onStep2Complete: () => void
  onStep3Complete: () => void
}

export function PostLSPNextSteps({ onStep1Complete, onStep2Complete, onStep3Complete }: PostLSPNextStepsProps) {
  const {
    selectedChampion,
    championPanelistId,
    congratsEmailSent,
    prosConsDrafted,
    championEmailSent,
    lspPros,
    lspCons,
    currentApp,
    setCurrentApp,
    setCongratsEmailSent,
    setProsConsDrafted,
    setChampionEmailSent
  } = useAppState()

  // Step state model with persistence
  const caseId = 'techflow-solutions' // In production, this would come from route/context
  const STORAGE_KEY = `postLspSteps_${caseId}`

  // Default step state - all steps start as NOT STARTED
  const DEFAULT_STEPS = {
    founderEmailSent: false,
    notesSynthesized: false,
    championEmailSent: false
  }

  // Sanitize step state - ensures all values are strict booleans
  // Never allows strings, undefined, or truthy values to become true
  function sanitizeSteps(input: any): typeof DEFAULT_STEPS {
    if (!input || typeof input !== 'object') {
      console.log('[PostLSP] sanitizeSteps: invalid input, returning defaults', { input })
      return DEFAULT_STEPS
    }
    const sanitized = {
      founderEmailSent: input.founderEmailSent === true,
      notesSynthesized: input.notesSynthesized === true,
      championEmailSent: input.championEmailSent === true
    }
    console.log('[PostLSP] sanitizeSteps', { input, sanitized })
    return sanitized
  }

  // Initialize step state - restore from global flags if returning from navigation
  const [steps, setSteps] = useState<typeof DEFAULT_STEPS>(() => {
    console.log('[PostLSP] Initializing state', { caseId, key: STORAGE_KEY, congratsEmailSent, prosConsDrafted, championEmailSent })
    // Check if we're returning from navigation (global flags indicate completion)
    // If so, restore state from flags; otherwise start fresh
    if (congratsEmailSent || prosConsDrafted || championEmailSent) {
      const restored = {
        founderEmailSent: congratsEmailSent || false,
        notesSynthesized: prosConsDrafted || false,
        championEmailSent: championEmailSent || false
      }
      console.log('[PostLSP] Restoring state from global flags', restored)
      return restored
    }
    // No global flags set - start fresh (hard refresh)
    console.log('[PostLSP] Starting fresh (no global flags)', DEFAULT_STEPS)
    return DEFAULT_STEPS
  })

  // Legacy state for backward compatibility - derived from step state only
  const [step1Done, setStep1Done] = useState(false)
  const [step2Done, setStep2Done] = useState(false)
  const [step3Done, setStep3Done] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null)

  // Debug logging for mount/unmount
  useEffect(() => {
    console.log('[PostLSPNextSteps] Component mounted')
    return () => {
      console.log('[PostLSPNextSteps] Component unmounted')
    }
  }, [])

  // Reset to defaults on mount ONLY if no global flags indicate completion (true hard refresh)
  useEffect(() => {
    const isReturningFromNavigation = congratsEmailSent || prosConsDrafted || championEmailSent
    const returnToFlag = localStorage.getItem('returnToPostLSPNextSteps') === 'true'
    
    console.log('[PostLSP] Mount effect check', { 
      caseId, 
      key: STORAGE_KEY,
      isReturningFromNavigation,
      returnToFlag,
      congratsEmailSent,
      prosConsDrafted,
      championEmailSent
    })
    
    // Only reset if we're NOT returning from navigation (true hard refresh)
    if (!isReturningFromNavigation && !returnToFlag) {
      console.log('[PostLSP] Hard refresh detected - resetting to defaults', { caseId, key: STORAGE_KEY })
      setSteps(DEFAULT_STEPS)
      // Clear localStorage to ensure clean state
      localStorage.removeItem(STORAGE_KEY)
      const oldKey = `lspSteps_${caseId}`
      localStorage.removeItem(oldKey)
    } else {
      console.log('[PostLSP] Returning from navigation - restoring from global flags', { 
        congratsEmailSent,
        prosConsDrafted,
        championEmailSent
      })
      // Restore state from global flags
      setSteps(prev => {
        const updated = {
          founderEmailSent: congratsEmailSent || prev.founderEmailSent,
          notesSynthesized: prosConsDrafted || prev.notesSynthesized,
          championEmailSent: championEmailSent || prev.championEmailSent
        }
        console.log('[PostLSP] Restored state from flags', { prev, updated })
        return updated
      })
    }
  }, [STORAGE_KEY, caseId, congratsEmailSent, prosConsDrafted, championEmailSent])

  // Persist step state to localStorage during session (for navigation)
  // Note: This is cleared on mount, so it only persists during the current session
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(steps))
    console.log('[PostLSP] Saved state to localStorage (session only)', { caseId, steps })
  }, [steps, STORAGE_KEY, caseId])

  // Sync legacy state with step state ONLY (do not use global flags)
  useEffect(() => {
    // Compute UI booleans - these control the "Done" badges
    const computedStep1Done = steps.founderEmailSent
    const computedStep2Done = steps.notesSynthesized
    const computedStep3Done = steps.championEmailSent
    
    console.log('[PostLSP] computed UI booleans', { 
      computedStep1Done, 
      computedStep2Done, 
      computedStep3Done,
      stepsState: steps
    })
    
    setStep1Done(computedStep1Done)
    setStep2Done(computedStep2Done)
    setStep3Done(computedStep3Done)
  }, [steps])

  // Debug logging for current state
  useEffect(() => {
    console.log('[PostLSP] steps state', { 
      caseId, 
      stepsState: steps,
      founderEmailSent: steps.founderEmailSent,
      notesSynthesized: steps.notesSynthesized,
      championEmailSent: steps.championEmailSent,
      step1Done, 
      step2Done, 
      step3Done,
      // Log global flags for comparison (should NOT be used)
      globalFlags: {
        congratsEmailSent,
        prosConsDrafted,
        championEmailSent
      }
    })
  }, [steps, step1Done, step2Done, step3Done, caseId, congratsEmailSent, prosConsDrafted, championEmailSent])

  // Show toast and auto-dismiss
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleStep1 = () => {
    console.log('[PostLSPNextSteps] compose founder email clicked', { 
      returnTo: 'post-lsp-next-steps',
      step: 'FOUNDER_EMAIL'
    })
    // Open inbox with congrats email composer
    localStorage.setItem('composeCongratsEmail', JSON.stringify({ timestamp: Date.now() }))
    localStorage.setItem('returnToPostLSPNextSteps', 'true')
    setCurrentApp('inbox')
  }

  const handleStep2 = () => {
    // Strict gating: Check if Step 1 is complete
    if (!steps.founderEmailSent) {
      console.log('[LSP Steps] blocked Step 2 - Step 1 incomplete', { 
        founderEmailSent: steps.founderEmailSent 
      })
      return
    }

    console.log('[PostLSP] navigate -> synthesize', { 
      returnTo: 'post-lsp-next-steps',
      step: 'SYNTHESIZE_NOTES',
      targetUrl: 'synthesize-notes'
    })
    // Navigate to dedicated Synthesize Notes screen
    // Set flags first
    localStorage.setItem('showSynthesizeNotes', 'true')
    localStorage.setItem('returnToPostLSPNextSteps', 'true')
    console.log('[PostLSP] Flags set, dispatching event', { currentApp })
    // Dispatch event to trigger state update in FlowController
    window.dispatchEvent(new CustomEvent('navigate-to-synthesize'))
    // Force FlowController to re-render by changing app
    // FlowController checks localStorage directly, so it will catch the flag
    // We need to trigger a re-render - if already on overview, we need to force it
    if (currentApp === 'overview') {
      // Force re-render by temporarily switching apps
      // This ensures FlowController re-evaluates and checks localStorage
      setCurrentApp('inbox')
      // Change back immediately - FlowController will check localStorage on this render
      setTimeout(() => {
        setCurrentApp('overview')
      }, 20)
    } else {
      setCurrentApp('overview')
    }
    // Also trigger a small delay to ensure state updates
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('navigate-to-synthesize'))
    }, 100)
  }

  const handleStep3 = () => {
    // Strict gating: Check if Step 2 is complete
    if (!steps.notesSynthesized) {
      console.log('[LSP Steps] blocked Step 3 - Step 2 incomplete', { 
        notesSynthesized: steps.notesSynthesized 
      })
      return
    }

    console.log('[PostLSPNextSteps] compose champion email clicked', { 
      step: 'CHAMPION_EMAIL',
      redirectTo: 'isp-landing'
    })
    // Open inbox with champion email composer
    // Set emailType and nextRoute for ISP redirect after sending
    localStorage.setItem('composeChampionEmail', JSON.stringify({ 
      timestamp: Date.now(),
      emailType: 'CHAMPION_FOLLOWUP',
      nextRoute: 'isp-landing'
    }))
    // DO NOT set returnToPostLSPNextSteps - champion email should go to ISP landing
    setCurrentApp('inbox')
  }

  // Listen for step completion events
  useEffect(() => {
    const handleStep1Complete = () => {
      console.log('[PostLSP] Step1 complete event received')
      // Update step state - ONLY mark as done when event is received
      setSteps(prev => {
        const updated = {
          ...prev,
          founderEmailSent: true
        }
        console.log('[PostLSP] Step1 complete: founder email sent', updated)
        return updated
      })
      setStep1Done(true)
      setCongratsEmailSent(true)
      showToast('Founder email sent')
      onStep1Complete()
    }

    const handleStep2Complete = () => {
      console.log('[PostLSP] Step2 complete event received')
      // Update step state - ONLY mark as done when event is received
      setSteps(prev => {
        const updated = {
          ...prev,
          notesSynthesized: true
        }
        console.log('[PostLSP] Step2 complete: notes synthesized', updated)
        return updated
      })
      setStep2Done(true)
      setProsConsDrafted(true)
      showToast('Notes synthesized')
      onStep2Complete()
    }

    const handleStep3Complete = () => {
      console.log('[PostLSP] Step3 complete event received')
      // Update step state - ONLY mark as done when event is received
      setSteps(prev => {
        const updated = {
          ...prev,
          championEmailSent: true
        }
        console.log('[PostLSP] Step3 complete: champion email sent', updated)
        return updated
      })
      setStep3Done(true)
      setChampionEmailSent(true)
      showToast('Champion follow-up sent')
      // Note: Navigation to ISP landing is handled in Inbox handleSend
      // This component will unmount when FlowController shows GlobalReviewSession
      onStep3Complete()
    }

    window.addEventListener('post-lsp-step1-complete', handleStep1Complete)
    window.addEventListener('post-lsp-step2-complete', handleStep2Complete)
    window.addEventListener('post-lsp-step3-complete', handleStep3Complete)

    return () => {
      window.removeEventListener('post-lsp-step1-complete', handleStep1Complete)
      window.removeEventListener('post-lsp-step2-complete', handleStep2Complete)
      window.removeEventListener('post-lsp-step3-complete', handleStep3Complete)
    }
  }, [onStep1Complete, onStep2Complete, onStep3Complete, setCongratsEmailSent, setProsConsDrafted, setChampionEmailSent])

  const getChampionName = () => {
    if (!championPanelistId) return 'Champion'
    const nameMap: Record<string, string> = {
      'sarah-nguyen': 'Sarah Nguyen',
      'karim-el-masry': 'Karim El-Masry',
      'lina-abou-raya': 'Lina Abou-Raya',
      'james-whitmore': 'James Whitmore',
      'maria-santos': 'Maria Santos',
      'david-chen': 'David Chen'
    }
    return nameMap[championPanelistId] || 'Champion'
  }


  // Render logging - log right before render
  console.log('[PostLSP] render', {
    caseId,
    stepsState: steps,
    founderEmailSent: steps.founderEmailSent,
    notesSynthesized: steps.notesSynthesized,
    championEmailSent: steps.championEmailSent,
    step1Done,
    step2Done,
    step3Done
  })

  return (
    <div className="app-container">
      <div className="app-content" style={{ 
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '1.5rem',
            padding: '0.75rem 1.25rem',
            background: toast.type === 'success' ? '#059669' : '#3b82f6',
            color: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            fontSize: '0.875rem',
            fontWeight: 500,
            animation: 'slideIn 0.3s ease-out'
          }}>
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '2rem', position: 'relative' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            marginBottom: '0.5rem',
            color: '#111827'
          }}>
            Post-LSP: Next steps
          </h1>
          <p style={{ 
            fontSize: '0.9375rem', 
            color: '#6b7280',
            lineHeight: 1.6
          }}>
            You've confirmed the champion selection. Complete the steps below to close out the LSP and prepare the champion follow-up.
          </p>
        </div>

        {/* Steps Checklist */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Step 1 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step1Done ? '#059669' : '#e5e7eb',
                  color: step1Done ? '#ffffff' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}>
                  {step1Done ? '✓' : '1'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    color: '#111827'
                  }}>
                    Thank the founder
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Send a congratulatory email to the founder. Do not attribute feedback or votes to specific panelists.
                  </p>
                </div>
              </div>
              <div style={{
                padding: '0.375rem 0.75rem',
                background: step1Done ? '#d1fae5' : '#f3f4f6',
                color: step1Done ? '#065f46' : '#374151',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                marginLeft: '1rem'
              }}>
                {step1Done ? 'Done' : 'Not started'}
              </div>
            </div>
            {!step1Done && (
              <button
                className="primary"
                onClick={handleStep1}
                style={{
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '8px'
                }}
              >
                Compose founder email
              </button>
            )}
          </div>

          {/* Step 2 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            opacity: steps.founderEmailSent ? 1 : 0.6
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step2Done ? '#059669' : steps.founderEmailSent ? '#e5e7eb' : '#f3f4f6',
                  color: step2Done ? '#ffffff' : steps.founderEmailSent ? '#6b7280' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}>
                  {step2Done ? '✓' : '2'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    color: '#111827'
                  }}>
                    Synthesize deliberation notes
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Review and synthesize key themes from the deliberations into pros, cons, and summary notes.
                  </p>
                </div>
              </div>
              <div style={{
                padding: '0.375rem 0.75rem',
                background: step2Done ? '#d1fae5' : steps.founderEmailSent ? '#f3f4f6' : '#f9fafb',
                color: step2Done ? '#065f46' : steps.founderEmailSent ? '#374151' : '#9ca3af',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                marginLeft: '1rem'
              }}>
                {step2Done ? 'Done' : steps.founderEmailSent ? 'Not started' : 'Waiting for Step 1'}
              </div>
            </div>
            {!step2Done && steps.founderEmailSent && (
              <button
                className="primary"
                onClick={handleStep2}
                style={{
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '8px'
                }}
              >
                Synthesize notes
              </button>
            )}
            {!steps.founderEmailSent && (
              <div>
                <button
                  className="primary"
                  disabled
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('[LSP Steps] blocked Step 2 - Step 1 incomplete')
                  }}
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    borderRadius: '8px',
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }}
                >
                  Synthesize notes
                </button>
                <p style={{
                  fontSize: '0.8125rem',
                  color: '#9ca3af',
                  margin: '0.5rem 0 0 0',
                  fontStyle: 'italic'
                }}>
                  Complete Step 1 to unlock
                </p>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            opacity: steps.notesSynthesized ? 1 : 0.6
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step3Done ? '#059669' : steps.notesSynthesized ? '#e5e7eb' : '#f3f4f6',
                  color: step3Done ? '#ffffff' : steps.notesSynthesized ? '#6b7280' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}>
                  {step3Done ? '✓' : '3'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    color: '#111827'
                  }}>
                    Email the champion
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Send a follow-up email to {getChampionName()} with synthesized feedback summary and request availability for a feedback call with the founder.
                  </p>
                </div>
              </div>
              <div style={{
                padding: '0.375rem 0.75rem',
                background: step3Done ? '#d1fae5' : steps.notesSynthesized ? '#f3f4f6' : '#f9fafb',
                color: step3Done ? '#065f46' : steps.notesSynthesized ? '#374151' : '#9ca3af',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                marginLeft: '1rem'
              }}>
                {step3Done ? 'Done' : steps.notesSynthesized ? 'Not started' : 'Waiting for Step 2'}
              </div>
            </div>
            {!step3Done && steps.notesSynthesized && (
              <button
                className="primary"
                onClick={handleStep3}
                style={{
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: '8px'
                }}
              >
                Compose champion email
              </button>
            )}
            {!steps.notesSynthesized && (
              <div>
                <button
                  className="primary"
                  disabled
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('[LSP Steps] blocked Step 3 - Step 2 incomplete')
                  }}
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    borderRadius: '8px',
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }}
                >
                  Compose champion email
                </button>
                <p style={{
                  fontSize: '0.8125rem',
                  color: '#9ca3af',
                  margin: '0.5rem 0 0 0',
                  fontStyle: 'italic'
                }}>
                  Complete Step 2 to unlock
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
