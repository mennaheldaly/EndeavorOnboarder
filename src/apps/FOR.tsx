import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
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
}

export function FOR() {
  const { setCurrentStage } = useAppState()

  // Initialize state from localStorage
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(() => {
    const saved = localStorage.getItem(FOR_STORAGE_KEY)
    if (saved) {
      try {
        const data: FORData = JSON.parse(saved)
        return data.selectedQuestions || []
      } catch (e) {
        console.warn('[FOR] Failed to parse saved questions', e)
      }
    }
    return []
  })

  const [pitchBullets, setPitchBullets] = useState<string[]>(() => {
    const saved = localStorage.getItem(FOR_STORAGE_KEY)
    if (saved) {
      try {
        const data: FORData = JSON.parse(saved)
        return data.pitchBullets || []
      } catch (e) {
        console.warn('[FOR] Failed to parse saved bullets', e)
      }
    }
    return ['']
  })

  // Persist to localStorage
  useEffect(() => {
    const data: FORData = {
      selectedQuestions,
      pitchBullets: pitchBullets.filter(b => b.trim()),
      forCompleted: false // Will be computed, not stored
    }
    localStorage.setItem(FOR_STORAGE_KEY, JSON.stringify(data))
    console.log('[FOR] Saved state', { selectedQuestions: selectedQuestions.length, pitchBullets: pitchBullets.filter(b => b.trim()).length })
  }, [selectedQuestions, pitchBullets])

  // Compute completion
  const isQuestionsComplete = selectedQuestions.length >= 8
  const isPitchComplete = pitchBullets.filter(b => b.trim()).length >= 4
  const isForComplete = isQuestionsComplete && isPitchComplete

  // Debug logging
  useEffect(() => {
    console.log('[FOR] completion check', {
      selectedQuestionsLength: selectedQuestions.length,
      pitchBulletsLength: pitchBullets.filter(b => b.trim()).length,
      isQuestionsComplete,
      isPitchComplete,
      isForComplete
    })
  }, [selectedQuestions.length, pitchBullets.length, isQuestionsComplete, isPitchComplete, isForComplete])

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
      console.warn('[FOR] Cannot proceed - incomplete', { isQuestionsComplete, isPitchComplete })
      return
    }

    // Mark FOR as completed
    const data: FORData = {
      selectedQuestions,
      pitchBullets: pitchBullets.filter(b => b.trim()),
      forCompleted: true
    }
    localStorage.setItem(FOR_STORAGE_KEY, JSON.stringify(data))

    // Update stage to SOR
    setCurrentStage('SOR')
    console.log('[FOR] Proceeding to SOR phase', { stage: 'SOR' })

    // Navigate to overview (which will route to SOR based on stage)
    // The FlowController will handle routing based on stage
  }

  return (
    <div className="app-container">
      <div className="app-content" style={{
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#111827'
              }}>
                TechFlow Solutions
              </h1>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                FinTech • Mexico
              </p>
            </div>
            <div style={{
              padding: '0.375rem 0.75rem',
              background: '#ecfdf5',
              color: '#065f46',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              Stage: FOR Phase
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Left: About the Endeavor Selection Process */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: '#111827'
            }}>
              About the Endeavor Selection Process
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '1rem'
            }}>
              The diagram below shows the full Endeavor selection process. In this case, the First Opinion Review (FOR) is the starting point, and the company will progress through Second Opinion Reviews (SOR), Local Selection Panel (LSP), and International Selection Panel (ISP).
            </p>
            <img
              src="/endeavor-selection-process-diagram.png"
              alt="Endeavor Selection Process Diagram"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                marginTop: '1rem'
              }}
            />
          </div>

          {/* Right: What happens in the FOR */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: '#111827'
            }}>
              What happens in the FOR
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: '1rem'
            }}>
              The First Opinion Review (FOR) is an initial meeting where founders come to the office. You'll ask questions to understand the company, the entrepreneurs, and their fit with Endeavor. You'll capture notes during the conversation.
            </p>
            <div style={{
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '8px',
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

        {/* FOR Question Planner */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0
            }}>
              FOR Question Planner
            </h2>
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
            Select at least 8 questions you would ask during the FOR meeting. These questions will help guide your conversation with the founders.
          </p>

          {Object.entries(FOR_QUESTIONS).map(([category, questions]) => (
            <div key={category} style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '1rem'
              }}>
                {category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {questions.map((question, index) => (
                  <label
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      transition: 'background 0.2s',
                      background: selectedQuestions.includes(question) ? '#f0fdf4' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedQuestions.includes(question)) {
                        e.currentTarget.style.background = '#f9fafb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedQuestions.includes(question)) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question)}
                      onChange={() => toggleQuestion(question)}
                      style={{
                        marginTop: '0.25rem',
                        cursor: 'pointer'
                      }}
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
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0
            }}>
              Endeavor Intro Pitch Prep
            </h2>
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

          <div style={{
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.6,
              margin: 0
            }}>
              <strong>Guidelines:</strong> Keep it short and founder-friendly. Clarify Endeavor's value proposition and the selection process. Aim for 4-6 bullet points that explain what Endeavor is, how we help entrepreneurs, and what the journey ahead looks like.
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

        {/* Proceed Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={handleProceedToSOR}
            disabled={!isForComplete}
            className="primary"
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              opacity: isForComplete ? 1 : 0.5,
              cursor: isForComplete ? 'pointer' : 'not-allowed'
            }}
          >
            PROCEED TO SOR PHASE
          </button>
        </div>
      </div>
    </div>
  )
}
