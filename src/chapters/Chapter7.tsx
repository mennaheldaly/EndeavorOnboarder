import { useState, useEffect } from 'react'
import './Chapter.css'

interface Chapter7Props {
  onComplete: () => void
}

export function Chapter7({ onComplete }: Chapter7Props) {
  const [liveNotes, setLiveNotes] = useState<string[]>([])
  const [summary, setSummary] = useState('')
  const [canProceed, setCanProceed] = useState(false)

  const panelists = [
    { name: 'Robert Martinez', role: 'Tech Investor', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces' },
    { name: 'Jennifer Park', role: 'Operations Expert', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces' },
    { name: 'Michael Thompson', role: 'FinTech Advisor', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces' },
    { name: 'Amanda Foster', role: 'Growth Strategist', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces' },
  ]

  const discussionPoints = [
    { time: 2000, text: 'Panelist 1: "Strong product-market fit demonstrated in Mexico market"' },
    { time: 5000, text: 'Panelist 2: "Unit economics need improvement before scaling"' },
    { time: 8000, text: 'Panelist 3: "Founder shows strong vision but needs operational support"' },
    { time: 12000, text: 'Panelist 4: "Partnership strategy could accelerate growth significantly"' },
    { time: 16000, text: 'Panelist 1: "Team structure needs strengthening for next phase"' },
    { time: 20000, text: 'Panelist 2: "Fundraising timeline seems aggressive but achievable"' },
    { time: 24000, text: 'Panelist 3: "Overall consensus: Strong candidate with clear growth path"' },
  ]

  useEffect(() => {
    const timers = discussionPoints.map((point) => {
      return setTimeout(() => {
        setLiveNotes((prev) => [...prev, point.text])
      }, point.time)
    })

    // Enable proceed after all notes are shown
    const enableTimer = setTimeout(() => {
      setCanProceed(true)
    }, 28000)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(enableTimer)
    }
  }, [])

  const handleProceed = () => {
    if (summary.trim().length < 50) {
      alert('Please provide a more detailed summary (at least 50 characters)')
      return
    }
    onComplete()
  }

  return (
    <div className="chapter section-large">
      <div className="container">
        <div className="panel-header">
          <h1>Local Selection Panel</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Observe the panel discussion. Highlight key themes and synthesize the consensus.
          </p>
        </div>

        <div className="panel-interface">
          <div className="panelists-grid">
            {panelists.map((panelist) => (
              <div key={panelist.name} className="panelist-card">
                <img src={panelist.photo} alt={panelist.name} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{panelist.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>
                  {panelist.role}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Live Discussion Feed</h2>
            <div className="notes-feed">
              {liveNotes.length === 0 ? (
                <p style={{ color: 'var(--endeavor-gray-dark)', fontStyle: 'italic' }}>
                  Discussion will begin shortly...
                </p>
              ) : (
                liveNotes.map((note, index) => (
                  <div key={index} className="note-entry">
                    {note}
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Synthesis & Summary</h2>
            <p style={{ marginBottom: '1rem', color: 'var(--endeavor-gray-dark)' }}>
              Summarize the key themes, risks identified, and overall consensus from the panel discussion.
            </p>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write your synthesis here... Include key themes, risks, and consensus points."
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '1rem',
                border: '1px solid var(--endeavor-gray)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                resize: 'vertical',
              }}
            />
          </div>

          <div className="cta-section">
            <button
              className="primary"
              onClick={handleProceed}
              disabled={!canProceed || summary.trim().length < 50}
            >
              ➡️ Proceed to ISP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

