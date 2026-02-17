import { useAppState } from '../state/AppState'
import './Chapter.css'

interface Chapter3Props {
  onComplete: () => void
}

export function Chapter3({ onComplete }: Chapter3Props) {
  const { meetings } = useAppState()
  const latestMeeting = meetings[meetings.length - 1]

  return (
    <div className="chapter section-large">
      <div className="container">
        <h1>Meeting Confirmed</h1>
        <p style={{ marginBottom: '3rem', maxWidth: '700px', fontSize: '1.25rem' }}>
          The SOR meeting has been scheduled and all attendees have been notified.
        </p>

        {latestMeeting && (
          <div style={{
            padding: '3rem',
            background: 'var(--endeavor-gray-light)',
            borderRadius: '4px',
            maxWidth: '700px',
            margin: '0 auto 3rem',
          }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>
              {latestMeeting.type} #{latestMeeting.sorNumber}
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--endeavor-gray-dark)', marginBottom: '0.5rem' }}>
                Date & Time
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {latestMeeting.date} {latestMeeting.time} {latestMeeting.timezone}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--endeavor-gray-dark)', marginBottom: '0.5rem' }}>
                Attendees
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {latestMeeting.attendees.map((attendee, index) => (
                  <p key={index} style={{ fontSize: '1rem' }}>{attendee}</p>
                ))}
              </div>
            </div>

            {latestMeeting.agenda && (
              <div>
                <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--endeavor-gray-dark)', marginBottom: '0.5rem' }}>
                  Agenda
                </p>
                <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>{latestMeeting.agenda}</p>
              </div>
            )}
          </div>
        )}

        <div className="sidebar-card" style={{
          maxWidth: '700px',
          margin: '0 auto 3rem',
          position: 'static',
        }}>
          <div className="card-content">
            <h3>Prepare for the Meeting</h3>
            <p>
              Review the company materials and be ready to facilitate a productive conversation. 
              During the meeting, you'll take notes on key discussion points, insights, and action items.
            </p>
          </div>
        </div>

        <div className="cta-section">
          <button className="primary" onClick={onComplete}>
            ➡️ Start Meeting
          </button>
        </div>
      </div>
    </div>
  )
}
