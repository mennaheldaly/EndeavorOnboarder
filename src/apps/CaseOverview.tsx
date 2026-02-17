import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import { FoundersLeaveTransition } from './FoundersLeaveTransition'
import './Apps.css'

const FOR_QUESTIONS = {
  'The Entrepreneur(s)': [
    'What is your background & track record? (education, previous ventures founded, mafias and how is the entrepreneur involved with the ecosystem)',
    'What is your current role within the company?'
  ],
  'The Business': [
    'What does the company do?',
    'How was the idea born?',
    'How did the company evolve and what were the key milestones the company achieved?',
    'What is your Business Model? Explain how your company generates revenue (B2C/B2B/B2G… + how the company makes money)',
    'Which products/services does the company sell?',
    'Breakdown the different revenue streams.',
    'Walk me through the competitive landscape. Is your business concept a disruptive invention on the market or are there any other players?',
    'What is your main differentiator? Are there any entry barriers for competitors? What competitive mode makes you win? (entry barriers)',
    'Who is your target customer?',
    'If the business is B2B/B2G/B2B2C: Who is the buyer persona?',
    'What does your customer segmentation look like? (by geography, gender, type…)',
    'In which countries are you operating?',
    'How big is the opportunity you are addressing? (market size and market share)'
  ],
  'Metrics & Growth Plan (Inflection Point)': [
    'Historical revenue / revenue growth (at least revenue from the latest full year and the previous year)',
    'Number of employees',
    'Projected revenue / revenue growth (present year revenue + following 2 years)',
    'Have you raised money? Please describe the financing rounds and investors.',
    'What is your objective in the short-mid term? What is your strategy and main levers to achieve that goal?',
    'If appropriate, introduce some additional questions about key business execution metrics during the FOR. Walk me through your unit economics.',
    'What are the key metrics you follow on a daily/weekly basis? (examples: CAC, LTV, NPS, ARR, NRR, Gross Churn, Net Churn, GMV, MAUs, DAUs, sales cycle, # patents…)',
    "What is the metric you're working to be better at?",
    'What is the long-term vision for the company?'
  ],
  'Challenges & Endeavor': [
    'What are your biggest challenges today? What keeps you awake at night?',
    'What risks do you see to the business?',
    'How can Endeavor help you?'
  ]
}

const CASE_ID = 'techflow-solutions'
const FOR_STORAGE_KEY = `for_${CASE_ID}`

interface FORData {
  selectedQuestions: string[]
  pitchBullets: string[]
  forCompleted: boolean
  reportQuestions?: string[] // Persisted for report
  reportPitchBullets?: string[] // Persisted for report
}

export function CaseOverview() {
  const { 
    completedSORs, 
    startSOR, 
    setCurrentApp,
    currentApp,
    currentStage,
    setCurrentStage,
    lspPanels,
    foundersLeft,
    deliberationsComplete,
    congratsEmailSent,
    prosConsDrafted,
    lspPros,
    lspCons,
    deliberationsNotes,
    updateLSPPros,
    updateLSPCons,
    setProsConsDrafted
  } = useAppState()

  // FOR state management - Reset selections and bullets on hard refresh
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const [pitchBullets, setPitchBullets] = useState<string[]>([''])

  const [forExpanded, setForExpanded] = useState(true)

  // Only persist FOR completion status, not selections/bullets (they reset on refresh)
  // This useEffect is removed - selections and bullets are not persisted

  // Compute FOR completion
  const isQuestionsComplete = selectedQuestions.length >= 8
  const isPitchComplete = pitchBullets.filter(b => b.trim()).length >= 4
  const isForComplete = isQuestionsComplete && isPitchComplete

  // Debug logging
  useEffect(() => {
    console.log('[CaseOverview] FOR completion check', {
      caseId: CASE_ID,
      selectedQuestionsLength: selectedQuestions.length,
      pitchBulletsLength: pitchBullets.filter(b => b.trim()).length,
      isQuestionsComplete,
      isPitchComplete,
      isForComplete,
      currentStage
    })
  }, [selectedQuestions.length, pitchBullets.length, isQuestionsComplete, isPitchComplete, isForComplete, currentStage])

  // Note: Stage always resets to FOR on hard refresh (handled in AppState initialization)
  // No need to validate here since AppState always initializes to FOR

  const toggleQuestion = (question: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(question)) {
        return prev.filter(q => q !== question)
      } else {
        return [...prev, question]
      }
    })
  }

  const addBullet = () => {
    setPitchBullets(prev => [...prev, ''])
  }

  const removeBullet = (index: number) => {
    setPitchBullets(prev => prev.filter((_, i) => i !== index))
  }

  const updateBullet = (index: number, value: string) => {
    setPitchBullets(prev => prev.map((b, i) => i === index ? value : b))
  }

  const copyToClipboard = () => {
    const text = pitchBullets.filter(b => b.trim()).map(b => `• ${b.trim()}`).join('\n')
    navigator.clipboard.writeText(text)
    alert('Pitch bullets copied to clipboard!')
  }

  const handleProceedToSOR = () => {
    if (!isForComplete) {
      console.warn('[CaseOverview] Cannot proceed to SOR - FOR incomplete', { isQuestionsComplete, isPitchComplete })
      return
    }

    // Mark FOR as completed
    // Save selections and bullets for the report (separate from session state)
    const data: FORData = {
      selectedQuestions: [], // Don't persist selections for session
      pitchBullets: [], // Don't persist bullets for session
      forCompleted: true,
      // Persist for report
      reportQuestions: selectedQuestions.filter(q => q.trim()),
      reportPitchBullets: pitchBullets.filter(b => b.trim())
    }
    localStorage.setItem(FOR_STORAGE_KEY, JSON.stringify(data))

    // Update stage to SOR
    setCurrentStage('SOR')
    console.log('[CaseOverview] Proceeding to SOR phase', { stage: 'SOR' })
  }
  const [showFoundersLeaveTransition, setShowFoundersLeaveTransition] = useState(false)
  const [showProsCons, setShowProsCons] = useState(false)
  const [localPros, setLocalPros] = useState<string[]>(lspPros)
  const [localCons, setLocalCons] = useState<string[]>(lspCons)
  const [localRecap, setLocalRecap] = useState<string>('')
  const [companyStoryExpanded, setCompanyStoryExpanded] = useState(false)
  
  const nextSOR = completedSORs.length + 1
  const allSORsComplete = completedSORs.length >= 5
  const allLSPPanelsComplete = lspPanels.every(p => p.completed)
  const sorProgress = completedSORs.length

  // Show Pros/Cons synthesis if congrats email sent but not yet drafted
  useEffect(() => {
    console.log('[CaseOverview] useEffect triggered:', {
      currentApp,
      congratsEmailSent,
      prosConsDrafted,
      showProsCons,
      flag: localStorage.getItem('showSynthesis'),
      returnToPostLSP: localStorage.getItem('returnToPostLSPNextSteps')
    })
    if (currentApp !== 'overview') {
      console.log('[CaseOverview] Not on overview, skipping')
      return
    }
    const shouldShow = localStorage.getItem('showSynthesis') === 'true' || (congratsEmailSent && !prosConsDrafted)
    console.log('[CaseOverview] shouldShow:', shouldShow)
    if (shouldShow && !showProsCons) {
      console.log('[CaseOverview] Setting showProsCons to true')
      setShowProsCons(true)
      localStorage.removeItem('showSynthesis')
    }
  }, [currentApp, congratsEmailSent, prosConsDrafted, showProsCons])

  if (showFoundersLeaveTransition) {
    return (
      <FoundersLeaveTransition 
        onBeginDeliberations={() => {
          setShowFoundersLeaveTransition(false)
          setCurrentApp('overview')
        }}
      />
    )
  }

  // Show Pros/Cons Synthesis Screen
  const synthesisFlag = localStorage.getItem('showSynthesis')
  const shouldShowSynthesis = (showProsCons || synthesisFlag === 'true') && congratsEmailSent && !prosConsDrafted && currentApp === 'overview'
  
  if (shouldShowSynthesis) {
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

    const handleNext = () => {
      const filteredPros = localPros.filter(p => p.trim())
      const filteredCons = localCons.filter(c => c.trim())
      
      updateLSPPros(filteredPros)
      updateLSPCons(filteredCons)
      localStorage.setItem('lspRecap', localRecap)
      setProsConsDrafted(true)
      setShowProsCons(false)
      // Dispatch event for Post-LSP Next Steps
      window.dispatchEvent(new CustomEvent('post-lsp-step2-complete'))
      // Return to Post-LSP Next Steps screen if flag is set
      const returnToPostLSP = localStorage.getItem('returnToPostLSPNextSteps') === 'true'
      console.log('[Synthesize] done, navigating back', { 
        returnTo: returnToPostLSP ? 'post-lsp-next-steps' : null
      })
      if (returnToPostLSP) {
        localStorage.removeItem('returnToPostLSPNextSteps')
        setCurrentApp('overview')
      }
    }

    return (
      <div className="app-container">
        <div className="app-content" style={{ padding: 'var(--spacing-xl)' }}>
          <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Synthesize LSP Notes</h1>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-xl)' }}>
            <div>
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <h2>Strengths</h2>
                  <button onClick={handleAddPro} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    + Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {localPros.map((pro, index) => (
                    <div key={index} style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => handleUpdatePro(index, e.target.value)}
                        placeholder="Enter a strength..."
                        style={{ flex: 1, padding: 'var(--spacing-sm)' }}
                      />
                      <button onClick={() => handleRemovePro(index)} style={{ padding: '0.5rem' }}>
                        ×
                      </button>
                    </div>
                  ))}
                  {localPros.length === 0 && (
                    <p style={{ color: 'var(--endeavor-gray-dark)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                      Click "+ Add" to add strengths
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <h2>Challenges / Gaps</h2>
                  <button onClick={handleAddCon} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    + Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  {localCons.map((con, index) => (
                    <div key={index} style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => handleUpdateCon(index, e.target.value)}
                        placeholder="Enter a challenge or gap..."
                        style={{ flex: 1, padding: 'var(--spacing-sm)' }}
                      />
                      <button onClick={() => handleRemoveCon(index)} style={{ padding: '0.5rem' }}>
                        ×
                      </button>
                    </div>
                  ))}
                  {localCons.length === 0 && (
                    <p style={{ color: 'var(--endeavor-gray-dark)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                      Click "+ Add" to add challenges or gaps
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Recap & Pre-ISP Milestones</h2>
                <textarea
                  value={localRecap}
                  onChange={(e) => setLocalRecap(e.target.value)}
                  placeholder="Enter recap and pre-ISP milestones..."
                  style={{ 
                    width: '100%',
                    minHeight: '200px',
                    padding: 'var(--spacing-sm)',
                    fontSize: '0.9375rem',
                    fontFamily: 'inherit',
                    border: '1px solid var(--endeavor-gray)',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            <div style={{ position: 'sticky', top: 'var(--spacing-md)', height: 'fit-content', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: 'var(--spacing-md)' }}>LSP Notes</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>Panel #1 Notes</h3>
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--endeavor-gray-light)',
                    borderRadius: '4px',
                    minHeight: '150px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.875rem',
                    lineHeight: 1.6
                  }}>
                    {lspPanels[0]?.notes || 'No notes recorded'}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>Panel #2 Notes</h3>
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--endeavor-gray-light)',
                    borderRadius: '4px',
                    minHeight: '150px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.875rem',
                    lineHeight: 1.6
                  }}>
                    {lspPanels[1]?.notes || 'No notes recorded'}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>Panel #3 Notes</h3>
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--endeavor-gray-light)',
                    borderRadius: '4px',
                    minHeight: '150px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.875rem',
                    lineHeight: 1.6
                  }}>
                    {lspPanels[2]?.notes || 'No notes recorded'}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', fontWeight: 600 }}>Deliberations Notes</h3>
                  <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--endeavor-gray-light)',
                    borderRadius: '4px',
                    minHeight: '150px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.875rem',
                    lineHeight: 1.6
                  }}>
                    {deliberationsNotes || 'No notes recorded'}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
                <button 
                  className="primary" 
                  onClick={handleNext} 
                  style={{ 
                    padding: '1rem 3rem', 
                    fontSize: '1.125rem',
                    width: '100%'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Use global stage from AppState instead of computing locally
  // This ensures consistency and proper routing

  return (
    <div className="app-container" style={{ background: '#f8f9fa' }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: '60px',
        zIndex: 100,
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Left: Company Name */}
          <div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              margin: 0,
              marginBottom: '4px',
              color: '#111827'
            }}>
              TechFlow Solutions
            </h1>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280', 
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              FinTech • Mexico
            </p>
                </div>

          {/* Middle: Badges */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{
              padding: '4px 12px',
              background: '#f3f4f6',
              borderRadius: '12px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Stage: {currentStage === 'FOR' ? 'FOR Phase' : currentStage === 'SOR' ? 'SOR Phase' : currentStage === 'LSP' ? 'LSP Phase' : 'ISP Phase'}
            </span>
            {currentStage !== 'FOR' && (
              <span style={{
                padding: '4px 12px',
                background: '#f3f4f6',
                borderRadius: '12px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#374151'
              }}>
                Progress: {sorProgress}/5
              </span>
            )}
              </div>
              
          {/* Right: CTA */}
          {currentStage === 'FOR' && (
            <button
              className="primary"
              onClick={handleProceedToSOR}
              disabled={!isForComplete}
              style={{
                padding: '8px 20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                opacity: isForComplete ? 1 : 0.5,
                cursor: isForComplete ? 'pointer' : 'not-allowed'
              }}
            >
              {isForComplete ? 'Proceed to SOR' : 'Complete FOR to unlock SOR'}
            </button>
          )}
          {currentStage !== 'FOR' && !allSORsComplete && (
            <button
              className="primary"
              onClick={() => {
                startSOR(nextSOR)
                setCurrentApp('inbox')
              }}
              style={{
                padding: '8px 20px',
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              Initiate SOR #{nextSOR}
            </button>
          )}
                </div>

        {/* Stats Row */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>ARR:</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>$7M</span>
              </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Team:</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>105</span>
            </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Markets:</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>Mexico, Colombia</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Timeline:</span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>Series A in 12 months</span>
            </div>
          </div>
        </div>

      {/* Main Content */}
        <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '24px'
      }}>
        {/* LEFT COLUMN (8/12) */}
        {currentStage !== 'FOR' && (
          <div style={{ gridColumn: 'span 8' }}>
            {/* About Endeavor Network - Full-width header section (SOR and beyond) */}
            <div style={{
              background: '#ffffff',
              padding: '48px 32px',
              marginBottom: '48px',
              borderBottom: '1px solid #e5e7eb'
            }}>
            <div style={{
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '24px'
              }}>
                About the Endeavor Network
              </h2>

          <p style={{ 
                fontSize: '1rem',
                color: '#374151',
                lineHeight: 1.7,
                marginBottom: '20px',
                maxWidth: '900px'
              }}>
                Mentors are experienced entrepreneurs, operators, and industry leaders who provide strategic guidance based on their own scaling experience. Many are founders of high-growth companies, including Endeavor Entrepreneurs who have successfully completed the selection process, while others are trusted mentors within the broader Endeavor network who bring deep functional or industry expertise.
              </p>

              <p style={{
                fontSize: '1rem',
                color: '#374151',
                lineHeight: 1.7,
                marginBottom: '32px',
                maxWidth: '900px'
              }}>
                The diagram below shows the full Endeavor selection process. In this case, the First Opinion Review (FOR) has already been completed, and the company is now progressing through Second Opinion Reviews (SORs). Your role is to coordinate mentor sessions, capture structured feedback, and help prepare the company for the Local Selection Panel.
              </p>

          <div style={{
                marginBottom: '40px',
                maxWidth: '100%'
              }}>
                <img
                  src="/endeavor-selection-process-diagram.png"
                  alt="Endeavor Selection Process Diagram"
                  style={{
                    width: '100%',
                    maxWidth: '900px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                />
              </div>

              <div style={{
                marginTop: '40px',
                paddingTop: '32px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '16px'
                }}>
                  Mentor Selection Strategy for SORs
                </h3>

                <p style={{
                  fontSize: '1rem',
                  color: '#374151',
                  lineHeight: 1.7,
                  marginBottom: '20px',
                  maxWidth: '900px'
                }}>
                  You will coordinate five Second Opinion Reviews with different mentors to ensure well-rounded, unbiased feedback.
                </p>

            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
                  marginBottom: '20px',
                  maxWidth: '900px'
                }}>
                  <li style={{
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: '1rem',
                    color: '#374151',
                    lineHeight: 1.7
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 600, flexShrink: 0 }}>✓</span>
                    <span>All mentors have completed the Endeavor selection process themselves</span>
              </li>
                  <li style={{
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: '1rem',
                    color: '#374151',
                    lineHeight: 1.7
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 600, flexShrink: 0 }}>✓</span>
                    <span>Diverse expertise: at least one financial expert, one strategic advisor, and one mentor from a similar industry</span>
              </li>
                  <li style={{
                    padding: '8px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: '1rem',
                    color: '#374151',
                    lineHeight: 1.7
                  }}>
                    <span style={{ color: '#10b981', fontWeight: 600, flexShrink: 0 }}>✓</span>
                    <span>Geographic balance: typically a mix of local and global mentors</span>
              </li>
            </ul>

                <p style={{
                  fontSize: '0.9375rem',
                  color: '#6b7280',
                  lineHeight: 1.7,
                  marginTop: '24px',
                  maxWidth: '900px',
                  fontStyle: 'italic'
                }}>
                  This diversity ensures comprehensive feedback across strategic, operational, and scaling dimensions, helping founders strengthen their positioning before the Local Selection Panel.
            </p>
          </div>
            </div>
          </div>
          </div>
        )}

        {/* FOR Section - Show when stage is FOR */}
        {currentStage === 'FOR' && (
          <div style={{ gridColumn: 'span 12', marginBottom: '24px' }}>
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  margin: 0
                }}>
                  First Opinion Review (FOR)
                </h2>
                <button
                  onClick={() => setForExpanded(!forExpanded)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    padding: '0.5rem'
                  }}
                >
                  {forExpanded ? '▼ Collapse' : '▶ Expand'}
                </button>
            </div>

              {forExpanded && (
                <>
                  {/* About Endeavor Selection Process + What happens in FOR */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '1.5rem'
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: '#111827'
                      }}>
                        About the Endeavor Selection Process
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        lineHeight: 1.6,
                        marginBottom: '1rem'
                      }}>
                        The diagram below shows the full Endeavor selection process. <strong>You are here: FOR</strong>. The company will progress through Second Opinion Reviews (SOR), Local Selection Panel (LSP), and International Selection Panel (ISP).
                      </p>
                      <img
                        src="/endeavor-selection-process-diagram.png"
                        alt="Endeavor Selection Process Diagram"
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
            </div>

              <div style={{ 
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '1.5rem'
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                marginBottom: '1rem',
                        color: '#111827'
                      }}>
                        FOR Meeting: What happens
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        lineHeight: 1.6,
                        marginBottom: '1rem'
                      }}>
                        The First Opinion Review (FOR) is an initial in-person meeting where the founders come to the office and present their company, including their background, business model, traction, and growth plans. You will listen carefully, then ask targeted questions to better understand the company, the entrepreneurs, and their fit with Endeavor's selection criteria, capturing structured notes throughout the conversation.
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        lineHeight: 1.6,
                        marginBottom: '1rem'
                      }}>
                        At the end of the meeting, you will briefly introduce Endeavor—explaining its mission, value proposition and services, and selection process—so the founders understand how Endeavor supports high-growth entrepreneurs and what to expect in the next stages.
                      </p>
          <div style={{
                        padding: '0.75rem',
                        background: '#ffffff',
                        borderRadius: '6px',
                        marginTop: '1rem'
                      }}>
                        <p style={{
                          fontSize: '0.8125rem',
                          color: '#6b7280',
                          margin: 0,
                          fontWeight: 500
                        }}>
                          Duration: ~60 minutes
                        </p>
                        <p style={{
                          fontSize: '0.8125rem',
                          color: '#6b7280',
                          margin: '0.25rem 0 0 0'
                        }}>
                          Outcome: Determine if the company should proceed to SOR phase
                  </p>
              </div>
          </div>
            </div>

                  {/* Company Introduction */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                      fontSize: '0.9375rem',
                      color: '#374151',
                      lineHeight: 1.7,
                      marginBottom: '1.5rem'
                    }}>
                      TechFlow is the sample company we will be going through the Endeavor process with. Here is a bit about the company, then we will start the FOR.
                    </p>

                    {/* Company Overview and Company Story */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '1.5rem',
                      marginBottom: '1.5rem'
                    }}>
                      {/* Company Overview Card */}
                      <div style={{ 
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}>
                        <h3 style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 600, 
                          marginBottom: '16px',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Company Overview
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>What they do</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                              AI-powered financial planning tools for SMBs across Latin America
                            </div>
                          </div>
                          <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Traction</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                              Strong PMF in Mexico, early traction in Colombia exceeding projections
                            </div>
                          </div>
                          <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Inflection point</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                              Multi-market expansion, repeatable GTM, accelerating toward $20M+ ARR
                            </div>
                          </div>
                          <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Focus areas</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                              Unit economics optimization, leadership hiring, Series A preparation
                            </div>
                          </div>
            </div>
          </div>

                      {/* Company Story Card */}
          <div style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 600, 
                            color: '#111827',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            margin: 0
                          }}>
                            Company Story
                          </h3>
                          <button
                            onClick={() => setCompanyStoryExpanded(!companyStoryExpanded)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              padding: '4px 8px'
                            }}
                          >
                            {companyStoryExpanded ? 'Read less' : 'Read more'}
                          </button>
                        </div>
                        <div 
                          style={{ 
                            fontSize: '0.75rem', 
                            color: '#6b7280', 
                            lineHeight: 1.6,
                            maxWidth: '700px'
                          }}
                          className="company-story-text"
                        >
                          {companyStoryExpanded ? (
                            <>
                              <p style={{ marginBottom: '12px', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                                TechFlow Solutions provides AI-powered financial planning tools for small and medium-sized businesses 
                                across Latin America. Their platform helps business owners forecast cash flow, optimize expenses, and 
                                make data-driven financial decisions without requiring a finance background.
                              </p>
                              <p style={{ marginBottom: '12px', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                                Omar has built TechFlow to $7M ARR with a team of 105, achieving strong product-market fit in Mexico and rapidly expanding adoption among SMBs. The company has recently secured several high-value partnerships that significantly expand its distribution reach, positioning TechFlow to scale much faster across Latin America.
                              </p>
                              <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                                TechFlow is now at a critical inflection point. Having proven strong demand and a repeatable acquisition model in Mexico, and with early traction in Colombia exceeding initial projections, the company is preparing to expand into multiple new markets and accelerate growth toward $20M+ ARR over the next few years. To execute on this opportunity, Omar is focused on strengthening the leadership team, optimizing unit economics at scale, and preparing for a Series A round within the next 12 months.
                              </p>
                            </>
                          ) : (
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                              TechFlow Solutions provides AI-powered financial planning tools for small and medium-sized businesses 
                              across Latin America. Their platform helps business owners forecast cash flow, optimize expenses, and 
                              make data-driven financial decisions without requiring a finance background. Omar has built TechFlow to $7M ARR...
                            </p>
                          )}
                        </div>
                      </div>
          </div>
        </div>

                  {/* FOR Question Planner */}
              <div style={{ 
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                  <div style={{ 
                    display: 'flex', 
                      justifyContent: 'space-between',
                    alignItems: 'center', 
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0
                      }}>
                        FOR Question Planner
                      </h3>
                      <div style={{
                        padding: '0.375rem 0.75rem',
                        background: isQuestionsComplete ? '#d1fae5' : '#f3f4f6',
                        color: isQuestionsComplete ? '#065f46' : '#6b7280',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        Selected: {selectedQuestions.length} {isQuestionsComplete ? '✓' : `(need ${8 - selectedQuestions.length} more)`}
              </div>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '1.5rem'
                    }}>
                      Select at least 8 questions you would ask during the FOR meeting.
                    </p>

                    {Object.entries(FOR_QUESTIONS).map(([category, questions]) => (
                      <div key={category} style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#111827',
                          marginBottom: '0.75rem'
                        }}>
                          {category}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {questions.map((question, index) => (
                            <label
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '0.75rem',
                                borderRadius: '6px',
                                background: selectedQuestions.includes(question) ? '#f0fdf4' : 'transparent',
                                transition: 'background 0.2s'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedQuestions.includes(question)}
                                onChange={() => toggleQuestion(question)}
                                style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                              />
                              <span style={{
                                fontSize: '0.875rem',
                                color: '#374151',
                                lineHeight: 1.5,
                                flex: 1
                              }}>
                                {question}
                    </span>
                            </label>
                          ))}
            </div>
                      </div>
                    ))}
                  </div>

                  {/* Endeavor Intro Pitch Prep */}
          <div style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
            padding: '1.5rem',
                    marginBottom: '1.5rem'
                  }}>
                  <div style={{ 
                    display: 'flex', 
                      justifyContent: 'space-between',
                    alignItems: 'center', 
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#111827',
                        margin: 0
                      }}>
                        Endeavor Intro Pitch Prep
                      </h3>
                      <div style={{
                        padding: '0.375rem 0.75rem',
                        background: isPitchComplete ? '#d1fae5' : '#f3f4f6',
                        color: isPitchComplete ? '#065f46' : '#6b7280',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {pitchBullets.filter(b => b.trim()).length} bullets {isPitchComplete ? '✓' : `(need ${4 - pitchBullets.filter(b => b.trim()).length} more)`}
          </div>
                  </div>

                  {/* Review Endeavor Intro Slides */}
                  <div style={{ 
                    marginBottom: '2rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Review Endeavor Intro Slides
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '1.5rem',
                      lineHeight: 1.6
                    }}>
                      Use these slides from the Endeavor intro presentation to help prepare your pitch bullets.
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      gap: '1.5rem',
                      marginBottom: '1.5rem'
                    }}
                    className="slides-grid"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <div
                          key={num}
                      style={{ 
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            background: '#ffffff',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onClick={() => {
                            // Optional: Open fullscreen modal
                            const img = new Image()
                            img.src = `/images/endeavor/endeavor-slide-${num}.png`
                            const newWindow = window.open('', '_blank')
                            if (newWindow) {
                              newWindow.document.write(`
                                <html>
                                  <head><title>Endeavor Slide ${num}</title></head>
                                  <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000">
                                    <img src="${img.src}" style="max-width:100%;max-height:100%;object-fit:contain" />
                                  </body>
                                </html>
                              `)
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)'
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        >
                    <div style={{ 
                            width: '100%',
                            aspectRatio: '16/9',
                            background: '#f9fafb',
                      display: 'flex', 
                      alignItems: 'center', 
                            justifyContent: 'center'
                          }}>
                            <img
                              src={`/images/endeavor/endeavor-slide-${num}.png`}
                              alt={`Endeavor Intro Slide ${num}`}
                              draggable={false}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                padding: '12px'
                              }}
                            />
                    </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                      padding: '1rem',
                      background: '#ffffff',
                      borderRadius: '6px',
                      marginBottom: '1rem'
                    }}>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        lineHeight: 1.6,
                        margin: 0
                      }}>
                        <strong>Guidelines:</strong> Keep it short and founder-friendly. Clarify Endeavor's value proposition and the selection process. Aim for 4-6 bullet points.
                      </p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      {pitchBullets.map((bullet, index) => (
                        <div key={index} style={{
                    display: 'flex', 
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                          alignItems: 'flex-start'
                        }}>
                          <textarea
                            value={bullet}
                            onChange={(e) => updateBullet(index, e.target.value)}
                            placeholder={`Bullet point ${index + 1}`}
                            style={{
                              flex: 1,
                              padding: '0.75rem',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                              minHeight: '60px'
                            }}
                          />
                          {pitchBullets.length > 1 && (
                            <button
                              onClick={() => removeBullet(index)}
                              style={{
                                padding: '0.5rem',
                                background: '#fee2e2',
                                color: '#991b1b',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Remove
                            </button>
                  )}
                </div>
                      ))}
              </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={addBullet}
                      style={{ 
                          padding: '0.625rem 1.25rem',
                          background: '#f3f4f6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Add bullet
                      </button>
                      <button
                        onClick={copyToClipboard}
                        disabled={!isPitchComplete}
                        style={{
                          padding: '0.625rem 1.25rem',
                          background: isPitchComplete ? '#10b981' : '#f3f4f6',
                          color: isPitchComplete ? '#ffffff' : '#9ca3af',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: isPitchComplete ? 'pointer' : 'not-allowed',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Copy to clipboard
                      </button>
                    </div>
                  </div>

                  {/* Proceed to SOR Button */}
                  <div style={{
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <button
                      className="primary"
                      onClick={handleProceedToSOR}
                      disabled={!isForComplete}
                      style={{
                        padding: '0.875rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: isForComplete ? 'pointer' : 'not-allowed',
                        background: isForComplete ? '#10b981' : '#f3f4f6',
                        color: isForComplete ? '#ffffff' : '#9ca3af',
                        transition: 'all 0.2s',
                        opacity: isForComplete ? 1 : 0.6
                      }}
                    >
                      {isForComplete ? 'Proceed to SOR Phase' : `Complete FOR to unlock (${selectedQuestions.length}/8 questions, ${pitchBullets.filter(b => b.trim()).length}/4 bullets)`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* LEFT COLUMN (8/12) - Only show Company Overview/Story when NOT in FOR stage */}
        {currentStage !== 'FOR' && (
          <div style={{ gridColumn: 'span 8' }}>
              {/* Company Overview Card */}
                    <div style={{ 
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  marginBottom: '16px',
                  color: '#111827',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Company Overview
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>What they do</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                      AI-powered financial planning tools for SMBs across Latin America
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Traction</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                      Strong PMF in Mexico, early traction in Colombia exceeding projections
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Inflection point</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                      Multi-market expansion, repeatable GTM, accelerating toward $20M+ ARR
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>Focus areas</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                      Unit economics optimization, leadership hiring, Series A preparation
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Story Card (Collapsible) */}
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0
                  }}>
                    Company Story
                  </h2>
                  <button
                    onClick={() => setCompanyStoryExpanded(!companyStoryExpanded)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      padding: '4px 8px'
                    }}
                  >
                    {companyStoryExpanded ? 'Read less' : 'Read more'}
                  </button>
                </div>
                <div 
                  style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    lineHeight: 1.6,
                    maxWidth: '700px'
                  }}
                  className="company-story-text"
                >
                  {companyStoryExpanded ? (
                    <>
                      <p style={{ marginBottom: '12px', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                        TechFlow Solutions provides AI-powered financial planning tools for small and medium-sized businesses 
                        across Latin America. Their platform helps business owners forecast cash flow, optimize expenses, and 
                        make data-driven financial decisions without requiring a finance background.
                      </p>
                      <p style={{ marginBottom: '12px', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                        Omar has built TechFlow to $7M ARR with a team of 105, achieving strong product-market fit in Mexico and rapidly expanding adoption among SMBs. The company has recently secured several high-value partnerships that significantly expand its distribution reach, positioning TechFlow to scale much faster across Latin America.
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                        TechFlow is now at a critical inflection point. Having proven strong demand and a repeatable acquisition model in Mexico, and with early traction in Colombia exceeding initial projections, the company is preparing to expand into multiple new markets and accelerate growth toward $20M+ ARR over the next few years. To execute on this opportunity, Omar is focused on strengthening the leadership team, optimizing unit economics at scale, and preparing for a Series A round within the next 12 months.
                      </p>
                    </>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>
                      TechFlow Solutions provides AI-powered financial planning tools for small and medium-sized businesses 
                      across Latin America. Their platform helps business owners forecast cash flow, optimize expenses, and 
                      make data-driven financial decisions without requiring a finance background. Omar has built TechFlow to $7M ARR...
                    </p>
                  )}
                </div>
              </div>
          </div>
        )}

        {/* RIGHT COLUMN (4/12) */}
        {currentStage !== 'FOR' && (
          <div className="case-overview-right-column" style={{ gridColumn: 'span 4' }}>
            {/* Selection Status Card */}
        <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                marginBottom: '16px',
                color: '#111827',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Selection Status
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  padding: '4px 12px',
                  background: allSORsComplete ? '#d1fae5' : '#fef3c7',
                  color: allSORsComplete ? '#065f46' : '#92400e',
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  fontWeight: 500
                }}>
                  {allSORsComplete ? 'Ready for LSP' : 'Ready to initiate'}
                </span>
            </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  SOR Checklist
                </div>
                  {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '4px 0',
                    fontSize: '0.875rem',
                    color: completedSORs.includes(num) ? '#6b7280' : '#111827'
                  }}>
                    <span style={{ 
                      color: completedSORs.includes(num) ? '#10b981' : '#d1d5db',
                      fontSize: '1rem'
                    }}>
                      {completedSORs.includes(num) ? '✓' : '○'}
                    </span>
                    <span style={{ 
                      textDecoration: completedSORs.includes(num) ? 'line-through' : 'none',
                      opacity: completedSORs.includes(num) ? 0.6 : 1
                    }}>
                      SOR {num} {num === nextSOR && !allSORsComplete && '(Next)'}
                    </span>
                  </div>
                ))}
          </div>
              <div style={{ 
                height: '4px', 
                background: '#e5e7eb', 
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${(sorProgress / 5) * 100}%`, 
                  background: 'var(--endeavor-teal)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
                  </div>

            {/* Next Action Card */}
            {!allSORsComplete && (
          <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  marginBottom: '12px',
                  color: '#111827',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Next Action Required
                </h2>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  lineHeight: 1.5,
                  marginBottom: '16px'
                }}>
                  Coordinate with Account Manager to schedule SOR #{nextSOR} with an appropriate mentor.
                </p>
              <button 
                className="primary" 
                onClick={() => {
                  startSOR(nextSOR)
                  setCurrentApp('inbox')
                }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    fontWeight: 500
                }}
              >
                Initiate SOR #{nextSOR}
              </button>
            </div>
            )}

            {/* People Card */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                marginBottom: '16px',
                color: '#111827',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                People
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Founder */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces" 
                    alt="Omar Hassan"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                      Omar Hassan
          </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '4px' }}>
                      Founder & CEO
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Built TechFlow to $7M ARR
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', background: '#e5e7eb' }} />

                {/* Mentor */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" 
                alt="Maria Rodriguez" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                      Maria Rodriguez
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '4px' }}>
                      Mentor • FinTech scaling expert
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      Endeavor Entrepreneur
                      </span>
                  </div>
            </div>

                <div style={{ height: '1px', background: '#e5e7eb' }} />

                {/* Account Manager */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" 
                alt="Daniel Kim" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                      Daniel Kim
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '4px' }}>
                      Account Manager
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      Endeavor Employee
                      </span>
                    </div>
            </div>

                <div style={{ height: '1px', background: '#e5e7eb' }} />

                {/* Your Role */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                    width: '40px', 
                    height: '40px', 
                borderRadius: '50%', 
                    background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                    fontSize: '1.25rem'
              }}>
                👤
              </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                      Your Role
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                      Endeavor Associate
                    </div>
                  </div>
                </div>
            </div>
          </div>

            {/* Contact Information Card */}
          <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1rem' }}>ℹ️</span>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                    Contact Information
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>
                    Find emails and profiles in Salesforce
                  </div>
                </div>
          </div>
        </div>

            {/* LSP Progress (if applicable) */}
        {allSORsComplete && (
                  <div style={{ 
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  marginBottom: '16px',
                  color: '#111827',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  LSP Progress
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[1, 2, 3].map((num) => (
                    <div key={num} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                      gap: '8px',
                      padding: '4px 0',
                      fontSize: '0.875rem',
                      color: lspPanels[num - 1]?.completed ? '#6b7280' : '#111827'
                    }}>
                      <span style={{ 
                        color: lspPanels[num - 1]?.completed ? '#10b981' : '#d1d5db',
                        fontSize: '1rem'
                      }}>
                        {lspPanels[num - 1]?.completed ? '✓' : '○'}
                    </span>
                      <span style={{ 
                        textDecoration: lspPanels[num - 1]?.completed ? 'line-through' : 'none',
                        opacity: lspPanels[num - 1]?.completed ? 0.6 : 1
                      }}>
                        Panel #{num}
                    </span>
                  </div>
                  ))}
                  {allLSPPanelsComplete && (
                    <>
                      <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                        gap: '8px',
                        padding: '4px 0',
                        fontSize: '0.875rem',
                        color: deliberationsComplete ? '#6b7280' : '#111827'
                      }}>
                        <span style={{ 
                          color: deliberationsComplete ? '#10b981' : foundersLeft ? '#f59e0b' : '#d1d5db',
                          fontSize: '1rem'
                        }}>
                          {deliberationsComplete ? '✓' : foundersLeft ? '▶' : '🔒'}
                      </span>
                        <span>
                          Deliberations
                      </span>
                    </div>
                    </>
                  )}
            </div>
          </div>
        )}
          </div>
        )}

      </div>
    </div>
  )
}
