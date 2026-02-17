import { useAppState } from '../state/AppState'
import './Chapter.css'

interface Chapter6Props {
  onComplete: () => void
}

export function Chapter6({ onComplete }: Chapter6Props) {
  const { completedSORs } = useAppState()

  // For this demo, we'll show progression through SORs 1-5
  // In a full implementation, you'd repeat the flow for each SOR
  const totalSORs = 5
  const currentSOR = completedSORs.length + 1

  return (
    <div className="chapter section-large">
      <div className="container">
        <h1>Your Progress</h1>
        <p style={{ marginBottom: '3rem', maxWidth: '700px', fontSize: '1.25rem' }}>
          Track your journey through the Endeavor selection process with TechFlow Solutions.
        </p>

        <div className="timeline">
          {Array.from({ length: totalSORs }, (_, i) => i + 1).map((sorNum) => {
            const isCompleted = completedSORs.includes(sorNum)
            const isCurrent = sorNum === currentSOR && !isCompleted
            const mentors = [
              'Maria Rodriguez',
              'James Chen',
              'Sarah Williams',
              'David Kim',
              'Lisa Anderson',
            ]
            const focus = [
              'Growth strategy and scaling',
              'Financial modeling and unit economics',
              'Team building and leadership',
              'Strategic partnerships',
              'Fundraising preparation',
            ]

            return (
              <div
                key={sorNum}
                className={`timeline-item ${isCompleted ? 'completed' : ''}`}
                style={{
                  opacity: sorNum > currentSOR ? 0.5 : 1,
                }}
              >
                <h3>
                  SOR {sorNum} {isCompleted && '✓'}
                </h3>
                <p>
                  <strong>Mentor:</strong> {mentors[sorNum - 1]}
                </p>
                <p>
                  <strong>Focus:</strong> {focus[sorNum - 1]}
                </p>
                {isCompleted && (
                  <p style={{ color: 'var(--endeavor-teal)', marginTop: '0.5rem' }}>
                    Completed
                  </p>
                )}
                {isCurrent && (
                  <p style={{ color: 'var(--endeavor-yellow)', marginTop: '0.5rem' }}>
                    Ready to initiate
                  </p>
                )}
              </div>
            )
          })}

          <div
            className="timeline-item"
            style={{
              opacity: completedSORs.length < totalSORs ? 0.5 : 1,
            }}
          >
            <h3>LSP (Local Selection Panel)</h3>
            <p>Panel review and evaluation</p>
            {completedSORs.length >= totalSORs && (
              <p style={{ color: 'var(--endeavor-teal)', marginTop: '0.5rem' }}>
                Ready to proceed
              </p>
            )}
          </div>

          <div
            className="timeline-item"
            style={{
              opacity: completedSORs.length < totalSORs ? 0.5 : 1,
            }}
          >
            <h3>ISP (International Selection Panel)</h3>
            <p>Final selection and founder support</p>
          </div>
        </div>

        {completedSORs.length < totalSORs ? (
          <div className="cta-section">
            <p style={{ marginBottom: '1rem', color: 'var(--endeavor-gray-dark)' }}>
              Complete SOR {currentSOR} to continue
            </p>
            <button
              className="primary"
              onClick={() => {
                // In a full implementation, this would cycle back through SORs 2-5
                // For this demo, we'll proceed to LSP after showing the timeline
                if (completedSORs.length === 0) {
                  // Simulate completing remaining SORs for demo purposes
                  // In real app, user would go through each SOR flow
                  onComplete()
                } else {
                  onComplete()
                }
              }}
            >
              {completedSORs.length === 0
                ? 'Continue to LSP (Demo)'
                : `Initiate SOR ${currentSOR}`}
            </button>
          </div>
        ) : (
          <div className="cta-section">
            <button className="primary" onClick={onComplete}>
              ➡️ Proceed to LSP
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

