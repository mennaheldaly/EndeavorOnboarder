import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import { PanelWorkspaceLayout } from '../components/PanelWorkspaceLayout'
import './Apps.css'

interface LSPProps {
  panelNumber: number
  onComplete: () => void
}

interface TranscriptEntry {
  speaker: 'Founder' | 'Panelist'
  name: string
  text: string
}

export function LSP({ panelNumber, onComplete }: LSPProps) {
  const { 
    lspPanels, 
    completeLSPPanel, 
    updateLSPPanelNotes,
    currentLSPPanel,
    setCurrentApp 
  } = useAppState()
  
  const panel = lspPanels.find(p => p.id === panelNumber)
  
  // Get saved notes from state
  const savedNotes = panel?.notes || ''
  const [notes, setNotes] = useState(savedNotes)
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0)
  const [transcriptComplete, setTranscriptComplete] = useState(false)

  // Update notes in state whenever they change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (panel) {
        updateLSPPanelNotes(panelNumber, notes)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [notes, panelNumber, panel, updateLSPPanelNotes])

  // Load saved notes and reset transcript when panel changes
  useEffect(() => {
    if (panel) {
      setNotes(panel.notes || '')
      setCurrentTranscriptIndex(0)
      setTranscriptComplete(false)
    }
  }, [panelNumber, panel?.id])

  // Panel #1 specific transcript (exact content from requirements)
  const panel1Transcript: TranscriptEntry[] = [
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Thank you for having us. I'll keep this brief.
TechFlow Solutions is a B2B FinTech platform helping mid-sized merchants manage cross-border payments and reconciliation in one workflow. We integrate with local banks and ERPs to reduce settlement time and operational overhead.

In 2022 we expanded quickly into three markets. In 2023 we slowed expansion to stabilize operations, improve unit economics, and reduce churn. Today we serve ~1,200 merchants, with strongest traction in Egypt and the Gulf, and we're preparing to scale again with a more standardized operating model.`
    },
    {
      speaker: 'Panelist',
      name: 'Sarah Nguyen',
      text: `You mentioned you slowed expansion in 2023. What specifically broke as you scaled, and what did you change operationally?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `We scaled customer onboarding too quickly without consistent processes. Support tickets rose, implementation time increased, and we saw higher churn among smaller merchants.
We responded by segmenting customers, standardizing onboarding steps, and creating a dedicated implementation squad. We also tightened qualification so we don't onboard merchants that don't fit the product.`
    },
    {
      speaker: 'Panelist',
      name: 'Karim El-Masry',
      text: `I noticed revenue dipped in 2023. Was that purely strategic, or were there external pressures? And what's the leading indicator that the dip is behind you?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `It was mostly strategic. We exited two markets where CAC rose sharply and we weren't reaching payback quickly enough. We also had sales team turnover mid-year.
The leading indicator is retention: churn improved meaningfully in the last two quarters, and onboarding time is down. We're not back to our 2022 growth rate yet, but quality is better.`
    },
    {
      speaker: 'Panelist',
      name: 'Sarah Nguyen',
      text: `What's the single biggest execution risk over the next 12 months if you start scaling again?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Maintaining onboarding quality as volumes increase. Demand is there, but we need to ensure our processes don't degrade and that we keep hiring ahead of volume, not after we're already stretched.`
    }
  ]

  // Panel #2 specific transcript (exact content from requirements)
  const panel2Transcript: TranscriptEntry[] = [
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Thank you for having us. I'll keep this brief.
TechFlow Solutions is a B2B FinTech platform helping mid-sized merchants manage cross-border payments and reconciliation in one workflow. We integrate with local banks and ERPs to reduce settlement time and operational overhead.

In 2022 we expanded quickly into three markets. In 2023 we slowed expansion to stabilize operations, improve unit economics, and reduce churn. Today we serve ~1,200 merchants, with strongest traction in Egypt and the Gulf, and we're preparing to scale again with a more standardized operating model.`
    },
    {
      speaker: 'Panelist',
      name: 'Lina Abou-Raya',
      text: `You've improved unit economics, but I'm curious about the competitive landscape. What's your defensibility beyond integrations?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `The defensibility comes from the combination of integrations, regulatory compliance, and the relationships we've built with local banks. Each market has different requirements, and we've invested heavily in understanding those nuances. But you're right—we need to build more product-level differentiation. We're working on AI-powered reconciliation that learns from each merchant's patterns.`
    },
    {
      speaker: 'Panelist',
      name: 'James Whitmore',
      text: `How do you think about pricing as you scale? Are you seeing pricing pressure, or do you have room to increase?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `We've actually increased pricing in our core markets over the past year, and retention improved. The value proposition is strong enough that merchants are willing to pay more for reliability and compliance. We're not seeing significant pressure yet, but we're monitoring it closely.`
    },
    {
      speaker: 'Panelist',
      name: 'Lina Abou-Raya',
      text: `What's your biggest concern about scaling into new markets?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Regulatory complexity and the time it takes to build bank relationships. Each new market requires significant upfront investment, and we need to be selective about where we expand. We're focusing on markets where we can leverage existing relationships or where the regulatory environment is more predictable.`
    }
  ]

  // Panel #3 specific transcript
  const panel3Transcript: TranscriptEntry[] = [
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Thank you for having us. I'll keep this brief.
TechFlow Solutions is a B2B FinTech platform helping mid-sized merchants manage cross-border payments and reconciliation in one workflow. We integrate with local banks and ERPs to reduce settlement time and operational overhead.

In 2022 we expanded quickly into three markets. In 2023 we slowed expansion to stabilize operations, improve unit economics, and reduce churn. Today we serve ~1,200 merchants, with strongest traction in Egypt and the Gulf, and we're preparing to scale again with a more standardized operating model.`
    },
    {
      speaker: 'Panelist',
      name: 'Maria Santos',
      text: `From a technical perspective, how are you thinking about scaling your infrastructure as you grow?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `We've built a modular architecture that allows us to scale components independently. We're using microservices for core functions, which gives us flexibility. The challenge is maintaining consistency across markets while allowing for local customization. We're investing in better tooling and automation to manage that complexity.`
    },
    {
      speaker: 'Panelist',
      name: 'David Chen',
      text: `What's your approach to hiring and building the team as you scale?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `We're being very intentional about hiring. We're prioritizing people who can operate independently and who have experience in regulated industries. We're also building a stronger engineering culture and investing in training. The goal is to hire ahead of need, not reactively.`
    },
    {
      speaker: 'Panelist',
      name: 'Maria Santos',
      text: `What's the biggest technical risk you're facing?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Real-time fraud detection and compliance monitoring. We're doing basic checks now, but as we scale, we'll need more sophisticated systems. That requires both technical investment and regulatory expertise. We're planning to address this in the next 12 months, but it's a significant undertaking.`
    }
  ]

  // Select transcript based on panel number
  const transcript = panelNumber === 1 ? panel1Transcript : panelNumber === 2 ? panel2Transcript : panelNumber === 3 ? panel3Transcript : []

  const handleNext = () => {
    if (currentTranscriptIndex < transcript.length - 1) {
      setCurrentTranscriptIndex(currentTranscriptIndex + 1)
    } else {
      setTranscriptComplete(true)
    }
  }

  const handleJumpToEnd = () => {
    setCurrentTranscriptIndex(transcript.length - 1)
    setTranscriptComplete(true)
  }

  const handleComplete = () => {
    // Save final notes
    if (panel) {
      updateLSPPanelNotes(panelNumber, notes)
    }
    
    // Mark panel as completed
    completeLSPPanel(panelNumber)
    
    // Navigate to next panel (not back to overview)
    // The FlowController will handle showing the next panel
    onComplete()
  }

  // Validate panel exists
  if (!panel || (panelNumber !== 1 && panelNumber !== 2 && panelNumber !== 3)) {
    return (
      <div className="app-container">
        <div className="app-content">
          <p>Panel #{panelNumber} is not available.</p>
        </div>
      </div>
    )
  }

  const visibleTranscript = transcript.slice(0, currentTranscriptIndex + 1)
  const isLastTranscriptEntry = currentTranscriptIndex === transcript.length - 1

  // Left Column: Panelists + Founder
  const leftColumn = (
    <>
      <h3 style={{ 
        fontSize: '0.75rem', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#6b7280',
        marginBottom: '0.75rem',
        fontWeight: 600
      }}>
        Panelists
      </h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        overflowY: 'auto',
        flex: 1
      }}>
        {panel.panelists.map((panelist) => (
          <div key={panelist.name} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <img 
              src={panelist.photo} 
              alt={panelist.name}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '0.5rem'
              }}
            />
            <p style={{ 
              fontWeight: 600, 
              fontSize: '0.8125rem',
              marginBottom: '0.25rem',
              textAlign: 'center',
              color: '#111827'
            }}>
              {panelist.name}
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              {panelist.role.split(' ').slice(0, 3).join(' ')}
            </p>
          </div>
        ))}
        
        {/* Founder Section */}
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '0.75rem', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6b7280',
            marginBottom: '0.75rem',
            fontWeight: 600
          }}>
            Company Participants
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces" 
              alt="Omar Hassan"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '0.5rem'
              }}
            />
            <p style={{ 
              fontWeight: 600, 
              fontSize: '0.8125rem',
              marginBottom: '0.25rem',
              textAlign: 'center',
              color: '#111827'
            }}>
              Omar Hassan
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '0.25rem'
            }}>
              Founder & CEO
            </p>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#059669',
              textAlign: 'center',
              fontStyle: 'italic',
              fontWeight: 500
            }}>
              Presenter
            </p>
          </div>
        </div>
      </div>
    </>
  )

  // Center Column: Transcript
  const centerColumn = {
    title: 'Panel Transcript',
    content: (
      <>
        {visibleTranscript.map((entry, index) => (
          <div 
            key={index} 
            style={{ 
              marginBottom: index < visibleTranscript.length - 1 ? '0.75rem' : 0,
              paddingBottom: index < visibleTranscript.length - 1 ? '0.75rem' : 0,
              borderBottom: index < visibleTranscript.length - 1 ? '1px solid #e5e7eb' : 'none'
            }}
          >
            <p style={{ 
              fontWeight: 600, 
              color: entry.speaker === 'Founder' ? '#059669' : '#111827',
              marginBottom: '0.375rem',
              fontSize: '0.8125rem'
            }}>
              [{entry.speaker} — {entry.name}]
            </p>
            <p style={{ 
              color: '#374151',
              whiteSpace: 'pre-wrap',
              margin: 0,
              lineHeight: 1.5,
              fontSize: '0.8125rem'
            }}>
              "{entry.text}"
            </p>
          </div>
        ))}
        {transcriptComplete && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #059669',
            textAlign: 'center'
          }}>
            <p style={{ 
              marginBottom: '0.75rem',
              fontSize: '0.8125rem',
              color: '#374151'
            }}>
              Panel #{panelNumber} complete — capture any final notes before proceeding.
            </p>
            <button
              className="primary"
              onClick={handleComplete}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 500
              }}
            >
              Complete Panel #{panelNumber}
            </button>
          </div>
        )}
      </>
    ),
    actionButton: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleNext}
          disabled={transcriptComplete}
          className="primary"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
            opacity: transcriptComplete ? 0.5 : 1,
            cursor: transcriptComplete ? 'not-allowed' : 'pointer'
          }}
        >
          {isLastTranscriptEntry ? 'Complete' : 'Next'}
        </button>
        {!transcriptComplete && (
          <button
            onClick={handleJumpToEnd}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#374151',
              fontWeight: 500
            }}
          >
            Jump to End
          </button>
        )}
      </div>
    )
  }

  // Right Column: Notes
  const rightColumn = {
    title: 'Panel Notes',
    content: (
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your notes here as the panel progresses. Capture themes, concerns, strengths..."
        style={{ 
          flex: 1,
          minHeight: 0,
          padding: '0.75rem',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          background: '#ffffff',
          resize: 'none',
          fontFamily: 'inherit',
          color: '#111827'
        }}
      />
    )
  }

  return (
    <PanelWorkspaceLayout
      title={`LSP Panel #${panelNumber} — TechFlow Solutions`}
      subtitle="Pitch + Q&A (approx. 60 mins)"
      leftColumn={leftColumn}
      centerColumn={centerColumn}
      rightColumn={rightColumn}
      transcriptScrollDeps={[currentTranscriptIndex, transcriptComplete]}
    />
  )
}
