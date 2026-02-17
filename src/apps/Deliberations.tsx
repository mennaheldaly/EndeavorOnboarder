import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import { PanelWorkspaceLayout } from '../components/PanelWorkspaceLayout'
import './Apps.css'

interface DeliberationsProps {
  onComplete: (result: 'unanimous-yes' | 'comeback') => void
}

interface TranscriptEntry {
  speaker: string
  name: string
  text: string
}

export function Deliberations({ onComplete }: DeliberationsProps) {
  const { 
    foundersLeft, 
    deliberationsNotes, 
    updateDeliberationsNotes,
    setCurrentApp,
    voteRound1Completed,
    voteRound1Result,
    postRound1DiscussionCompleted,
    voteRound2Completed,
    voteRound2Result,
    passedLSP,
    setVoteRound1Completed,
    setPostRound1DiscussionCompleted,
    setVoteRound2Completed,
    setPassedLSP
  } = useAppState()
  
  const [notes, setNotes] = useState(deliberationsNotes)
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0)
  const [showRound1VoteResults, setShowRound1VoteResults] = useState(false)
  const [showRound2Discussion, setShowRound2Discussion] = useState(false)
  const [round2DiscussionIndex, setRound2DiscussionIndex] = useState(0)
  const [showRound2VoteResults, setShowRound2VoteResults] = useState(false)

  // Update notes in state whenever they change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateDeliberationsNotes(notes)
    }, 500)
    return () => clearTimeout(timer)
  }, [notes, updateDeliberationsNotes])

  // Load saved notes
  useEffect(() => {
    setNotes(deliberationsNotes)
  }, [deliberationsNotes])

  // Load state from AppState
  useEffect(() => {
    if (voteRound1Completed) {
      setShowRound1VoteResults(true)
      setShowRound2Discussion(true)
    }
    if (postRound1DiscussionCompleted) {
      setRound2DiscussionIndex(round2DiscussionTranscript.length - 1)
    }
    if (voteRound2Completed) {
      setShowRound2VoteResults(true)
    }
  }, [voteRound1Completed, postRound1DiscussionCompleted, voteRound2Completed])

  // All 6 panelists (from all three panels)
  const allPanelists = [
    { name: 'Sarah Nguyen', role: 'FinTech CEO, Mexico', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces' },
    { name: 'Karim El-Masry', role: 'Venture Capital Partner', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces' },
    { name: 'Lina Abou-Raya', role: 'Private Equity Investor', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces' },
    { name: 'James Whitmore', role: 'PropTech CTO', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces' },
    { name: 'Maria Santos', role: 'Serial Tech Founder', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces' },
    { name: 'David Chen', role: 'Enterprise SaaS Founder', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=faces' },
  ]

  // Round 1 transcript (updated for 6 panelists)
  const round1Transcript: TranscriptEntry[] = [
    {
      speaker: 'Panelist',
      name: 'Sarah Nguyen',
      text: `Overall, I'm leaning positive. The founder seems coachable and they've already shown they can make hard operational decisions — exiting markets, tightening ICP, rebuilding onboarding. That's usually a good sign.`
    },
    {
      speaker: 'Panelist',
      name: 'Lina Abou-Raya',
      text: `I agree. The go-to-market is more disciplined now. I like that incentives are tied to retention and not just bookings. It's not the fastest growth story, but it feels real and fixable.`
    },
    {
      speaker: 'Panelist',
      name: 'James Whitmore',
      text: `From a product and strategy lens, I'm cautiously optimistic. The differentiation is credible in these markets—integrations, regulatory complexity, and local relationships do create inertia. I'd want to pressure test defensibility, but I don't see a red flag.`
    },
    {
      speaker: 'Panelist',
      name: 'Maria Santos',
      text: `On the technical side, I appreciate their approach to architecture and technical debt management. The modular system they've built shows foresight, and their focus on maintainability over speed is the right call for a FinTech at this stage.`
    },
    {
      speaker: 'Panelist',
      name: 'David Chen',
      text: `I'm concerned about the unit economics at scale. They've improved CAC, but I want to see more evidence that the model works beyond Mexico. The expansion plan feels ambitious given current traction.`
    },
    {
      speaker: 'Panelist',
      name: 'Karim El-Masry',
      text: `I share David's concern. The regulatory environment in LatAm is complex, and scaling compliance across multiple markets is expensive. I'd need to see a clearer path to profitability before I'm comfortable.`
    },
  ]

  // Round 2 discussion transcript (after Round 1 vote)
  const round2DiscussionTranscript: TranscriptEntry[] = [
    {
      speaker: 'Panelist',
      name: 'Sarah Nguyen',
      text: `I hear the concerns about unit economics and regulatory complexity. But I think we're missing something — they've already navigated Mexico's regulatory landscape successfully. That experience is valuable and transferable.`
    },
    {
      speaker: 'Panelist',
      name: 'Lina Abou-Raya',
      text: `Sarah makes a good point. And on unit economics, they've shown they can improve metrics when they focus. The discipline they've demonstrated gives me confidence they can replicate this in new markets.`
    },
    {
      speaker: 'Panelist',
      name: 'James Whitmore',
      text: `I'm coming around. The founder's ability to make hard calls — exiting markets, pivoting strategy — shows maturity. That's exactly what you need when scaling into complex regulatory environments.`
    },
    {
      speaker: 'Panelist',
      name: 'Maria Santos',
      text: `From a technical perspective, their architecture supports multi-market expansion. The modular approach means they can adapt to different regulatory requirements without rebuilding. That's a real advantage.`
    },
    {
      speaker: 'Panelist',
      name: 'David Chen',
      text: `You all make compelling points. I'm still cautious, but I can see the path forward. If they can maintain discipline and leverage their Mexico experience, I think they have a shot. I'm willing to support.`
    },
    {
      speaker: 'Panelist',
      name: 'Karim El-Masry',
      text: `I appreciate the discussion. The regulatory concerns are real, but the team has demonstrated they can navigate complexity. Combined with the improved unit economics and disciplined approach, I'm comfortable moving forward. I'll vote yes.`
    },
  ]

  const handleNext = () => {
    if (currentTranscriptIndex < round1Transcript.length - 1) {
      setCurrentTranscriptIndex(currentTranscriptIndex + 1)
    }
  }

  const handleVoteRound1 = () => {
    setShowRound1VoteResults(true)
    setVoteRound1Completed(true, { yes: 5, no: 1 })
  }

  const handleContinueDeliberations = () => {
    setShowRound2Discussion(true)
    setRound2DiscussionIndex(0)
  }

  const handleNextRound2Discussion = () => {
    if (round2DiscussionIndex < round2DiscussionTranscript.length - 1) {
      setRound2DiscussionIndex(round2DiscussionIndex + 1)
    } else {
      setPostRound1DiscussionCompleted(true)
    }
  }

  const handleVoteRound2 = () => {
    setShowRound2VoteResults(true)
    setVoteRound2Completed(true, { yes: 6, no: 0 })
    setPassedLSP(true)
  }

  const handleProceedToChampionSelection = () => {
    onComplete('unanimous-yes')
  }

  // Redirect if founders haven't left
  if (!foundersLeft) {
    return (
      <div className="app-container">
        <div className="app-content" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--endeavor-gray-dark)' }}>
            Deliberations are only available after founders have been dismissed.
          </p>
          <button 
            className="primary" 
            onClick={() => setCurrentApp('overview')}
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            Return to Overview
          </button>
        </div>
      </div>
    )
  }

  const visibleRound1Transcript = round1Transcript.slice(0, currentTranscriptIndex + 1)
  const visibleRound2Transcript = round2DiscussionTranscript.slice(0, round2DiscussionIndex + 1)
  const showVoteRound1Button = currentTranscriptIndex === round1Transcript.length - 1 && !showRound1VoteResults
  const showContinueDeliberationsButton = showRound1VoteResults && !showRound2Discussion
  const showVoteRound2Button = showRound2Discussion && round2DiscussionIndex === round2DiscussionTranscript.length - 1 && !showRound2VoteResults

  // Round 1 vote results (forced)
  const round1Votes = {
    'Sarah Nguyen': 'yes',
    'Lina Abou-Raya': 'yes',
    'James Whitmore': 'yes',
    'Maria Santos': 'yes',
    'David Chen': 'yes',
    'Karim El-Masry': 'no'
  }

  // Round 2 vote results (forced - all yes)
  const round2Votes = {
    'Sarah Nguyen': 'yes',
    'Lina Abou-Raya': 'yes',
    'James Whitmore': 'yes',
    'Maria Santos': 'yes',
    'David Chen': 'yes',
    'Karim El-Masry': 'yes'
  }

  // Get current vote for each panelist
  const getCurrentVote = (panelistName: string) => {
    if (showRound2VoteResults) {
      return round2Votes[panelistName as keyof typeof round2Votes] === 'yes' ? 'YES' : 'NO'
    }
    if (showRound1VoteResults) {
      return round1Votes[panelistName as keyof typeof round1Votes] === 'yes' ? 'YES' : 'NO'
    }
    return null
  }

  // Left Column: Panelists
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
        {allPanelists.map((panelist) => {
          const currentVote = getCurrentVote(panelist.name)
          return (
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
                textAlign: 'center',
                marginBottom: currentVote ? '0.5rem' : 0
              }}>
                {panelist.role.split(' ').slice(0, 3).join(' ')}
              </p>
              {currentVote && (
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: currentVote === 'YES' ? '#059669' : '#dc2626',
                  marginTop: '0.25rem',
                  fontWeight: 600
                }}>
                  {currentVote}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </>
  )

  // Center Column: Transcript
  const centerColumn = {
    title: 'Deliberation Transcript',
    infoLine: showRound1VoteResults && !showRound2VoteResults ? 'A unanimous vote is required for the company to pass the LSP.' : undefined,
    content: (
      <>
        {/* Round 1 Transcript */}
        {visibleRound1Transcript.map((entry, index) => (
          <div 
            key={`r1-${index}`}
            style={{ 
              marginBottom: index < visibleRound1Transcript.length - 1 ? '0.75rem' : 0,
              paddingBottom: index < visibleRound1Transcript.length - 1 ? '0.75rem' : 0,
              borderBottom: index < visibleRound1Transcript.length - 1 ? '1px solid #e5e7eb' : 'none'
            }}
          >
            <p style={{ 
              fontWeight: 600, 
              color: '#111827',
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

        {/* Vote Round 1 Results */}
        {showRound1VoteResults && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}>
            <h4 style={{ 
              marginBottom: '0.75rem', 
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#111827'
            }}>
              Vote Results — Round #1
            </h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem', 
              marginBottom: '0.75rem' 
            }}>
              {allPanelists.map((panelist) => (
                <div key={panelist.name} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: '#f9fafb',
                  borderRadius: '4px'
                }}>
                  <span style={{ 
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    color: '#111827'
                  }}>
                    {panelist.name}
                  </span>
                  <span style={{ 
                    color: round1Votes[panelist.name as keyof typeof round1Votes] === 'yes' ? '#059669' : '#dc2626',
                    fontWeight: 600,
                    fontSize: '0.8125rem'
                  }}>
                    {round1Votes[panelist.name as keyof typeof round1Votes] === 'yes' ? 'YES' : 'NO'}
                  </span>
                </div>
              ))}
            </div>
            {showContinueDeliberationsButton && (
              <button 
                className="primary" 
                onClick={handleContinueDeliberations}
                style={{ 
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500
                }}
              >
                Continue Deliberations
              </button>
            )}
          </div>
        )}

        {/* Round 2 Discussion Transcript */}
        {showRound2Discussion && visibleRound2Transcript.map((entry, index) => (
          <div 
            key={`r2-${index}`}
            style={{ 
              marginBottom: index < visibleRound2Transcript.length - 1 ? '0.75rem' : 0,
              paddingBottom: index < visibleRound2Transcript.length - 1 ? '0.75rem' : 0,
              borderBottom: index < visibleRound2Transcript.length - 1 ? '1px solid #e5e7eb' : 'none',
              marginTop: index === 0 ? '1rem' : 0,
              paddingTop: index === 0 ? '1rem' : 0,
              borderTop: index === 0 ? '1px solid #e5e7eb' : 'none'
            }}
          >
            <p style={{ 
              fontWeight: 600, 
              color: '#111827',
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

        {/* Vote Round 2 Results */}
        {showRound2VoteResults && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#ffffff',
            borderRadius: '8px',
            border: '2px solid #059669',
            marginBottom: '1rem'
          }}>
            <h4 style={{ 
              marginBottom: '0.75rem', 
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#111827'
            }}>
              Vote Results — Round #2
            </h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem', 
              marginBottom: '0.75rem' 
            }}>
              {allPanelists.map((panelist) => (
                <div key={panelist.name} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: '#f9fafb',
                  borderRadius: '4px'
                }}>
                  <span style={{ 
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    color: '#111827'
                  }}>
                    {panelist.name}
                  </span>
                  <span style={{ 
                    color: '#059669',
                    fontWeight: 600,
                    fontSize: '0.8125rem'
                  }}>
                    YES
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              padding: '0.75rem',
              background: '#059669',
              color: '#ffffff',
              borderRadius: '4px',
              marginBottom: '0.75rem',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0,
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                Unanimous approval reached — Deliberations complete.
              </p>
            </div>
            <button 
              className="primary" 
              onClick={handleProceedToChampionSelection}
              style={{ 
                width: '100%',
                padding: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 500
              }}
            >
              Proceed to Champion Selection
            </button>
          </div>
        )}
      </>
    ),
    actionButton: (
      <>
        {showVoteRound1Button && (
          <button
            onClick={handleVoteRound1}
            className="primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            Vote Round #1
          </button>
        )}
        {!showRound1VoteResults && !showVoteRound1Button && (
          <button
            onClick={handleNext}
            className="primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            Next
          </button>
        )}
        {showRound2Discussion && !showVoteRound2Button && (
          <button
            onClick={handleNextRound2Discussion}
            className="primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            Next
          </button>
        )}
        {showVoteRound2Button && (
          <button
            onClick={handleVoteRound2}
            className="primary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 500
            }}
          >
            Vote Round #2
          </button>
        )}
      </>
    )
  }

  // Right Column: Notes
  const rightColumn = {
    title: 'Deliberations Notes',
    content: (
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your notes here as deliberations progress..."
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
      title="LSP Deliberations — TechFlow Solutions"
      subtitle="Founders have left. Panelists align on final decision."
      leftColumn={leftColumn}
      centerColumn={centerColumn}
      rightColumn={rightColumn}
      transcriptScrollDeps={[currentTranscriptIndex, round2DiscussionIndex, showRound1VoteResults, showRound2VoteResults]}
    />
  )
}
