import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import './Chapter.css'

interface Chapter4Props {
  onComplete: () => void
}

export function Chapter4({ onComplete }: Chapter4Props) {
  const { addNote, meetings } = useAppState()
  const [notes, setNotes] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null)
  const [meetingEnded, setMeetingEnded] = useState(false)

  const prompts = [
    { time: 2000, text: "Mentor asks about growth constraints" },
    { time: 8000, text: "Founder mentions upcoming fundraise" },
    { time: 15000, text: "Discussion on unit economics and profitability" },
    { time: 22000, text: "Mentor suggests strategic partnership opportunities" },
    { time: 30000, text: "Founder shares challenges with team scaling" },
  ]

  useEffect(() => {
    const timers = prompts.map((prompt) => {
      return setTimeout(() => {
        setCurrentPrompt(prompt.text)
        setTimeout(() => setCurrentPrompt(null), 3000)
      }, prompt.time)
    })

    // End meeting after 35 seconds
    const endTimer = setTimeout(() => {
      setMeetingEnded(true)
    }, 35000)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(endTimer)
    }
  }, [])

  const handleWrapUp = () => {
    if (notes.trim()) {
      const note = {
        id: Date.now().toString(),
        meetingId: meetings[meetings.length - 1]?.id || '1',
        content: notes,
        timestamp: new Date().toISOString(),
      }
      addNote(note)
    }
    onComplete()
  }

  return (
    <div className="chapter section-large">
      <div className="container">
        <h1>SOR Meeting</h1>
        <p style={{ marginBottom: '2rem', maxWidth: '700px' }}>
          The meeting is in progress. Take notes as key moments arise.
        </p>

        <div className="meeting-interface">
          <div className="video-call-panel">
            <div className="video-participant">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces" 
                alt="Maria Rodriguez"
              />
              <p style={{ fontWeight: 600 }}>Maria Rodriguez</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>Mentor</p>
            </div>
            
            <div style={{ fontSize: '2rem', color: 'var(--endeavor-gray-dark)', margin: '1rem 0' }}>+</div>
            
            <div className="video-participant">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces" 
                alt="Omar Hassan"
              />
              <p style={{ fontWeight: 600 }}>Omar Hassan</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>Founder</p>
            </div>

            {meetingEnded && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'var(--endeavor-teal)',
                color: 'var(--endeavor-white)',
                borderRadius: '4px',
                fontWeight: 500,
              }}>
                Meeting Ended
              </div>
            )}
          </div>

          <div className="notes-panel">
            <h3>Meeting Notes</h3>
            
            {currentPrompt && (
              <div className="meeting-prompt">
                💡 {currentPrompt}
              </div>
            )}

            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your notes here as the meeting progresses..."
              disabled={meetingEnded}
            />

            {meetingEnded && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--endeavor-gray)' }}>
                <button className="primary" onClick={handleWrapUp}>
                  Wrap Up Meeting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

