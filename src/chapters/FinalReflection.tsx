import { useAppState } from '../state/AppState'
import './Chapter.css'

export function FinalReflection() {
  const { emails, meetings, notes, logs, completedSORs } = useAppState()

  return (
    <div className="chapter section-large">
      <div className="container">
        <div className="reflection-section">
          <h1>Journey Reflection</h1>
          <p style={{ 
            marginBottom: '3rem', 
            maxWidth: '700px', 
            fontSize: '1.25rem',
            textAlign: 'center',
            margin: '0 auto 3rem'
          }}>
            A summary of your experience guiding TechFlow Solutions through the Endeavor selection process.
          </p>

          <div className="reflection-timeline">
            <div className="reflection-item">
              <h3>The Beginning</h3>
              <p>
                You were assigned TechFlow Solutions, a FinTech company at a critical growth stage. Omar Hassan, 
                the founder, had built the company to $2M ARR but was facing challenges with scaling operations, 
                unit economics, and preparing for Series A funding.
              </p>
            </div>

            <div className="reflection-item">
              <h3>The Process</h3>
              <p>
                Over the course of the selection process, you facilitated {completedSORs.length} Selection of Review 
                meetings, coordinated with multiple mentors, and ensured all documentation was properly logged. 
                You sent {emails.length} email(s), scheduled {meetings.length} meeting(s), and captured {notes.length} note(s) 
                throughout the journey.
              </p>
            </div>

            <div className="reflection-item">
              <h3>What Went Smoothly</h3>
              <p>
                The initial outreach and scheduling process flowed well. Maria Rodriguez was responsive and available, 
                making it easy to coordinate the first SOR meeting. The meeting itself was productive, with Omar 
                demonstrating strong vision and the mentor providing valuable strategic guidance.
              </p>
            </div>

            <div className="reflection-item">
              <h3>Challenges Encountered</h3>
              <p>
                As the process progressed, coordinating multiple stakeholders and ensuring all documentation was 
                complete required careful attention. Some meetings required follow-up to capture all action items, 
                and synthesizing panel discussions demanded active listening and clear communication.
              </p>
            </div>

            <div className="reflection-item">
              <h3>Founder Readiness</h3>
              <p>
                Omar came well-prepared to each meeting, with clear articulation of his challenges and openness to 
                feedback. His engagement with mentors was genuine, and he demonstrated the ability to translate 
                strategic advice into actionable plans. The founder showed strong potential for growth with the right 
                support system.
              </p>
            </div>

            <div className="reflection-item">
              <h3>Outcomes</h3>
              <p>
                Through the selection process, TechFlow Solutions gained valuable insights on scaling operations, 
                improving unit economics, and preparing for fundraising. Strategic introductions were made, and the 
                company is now better positioned for their next growth phase. The journey through Endeavor's 
                selection process provided both the founder and the organization with a clear path forward.
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '4rem',
            padding: '3rem',
            background: 'var(--endeavor-gray-light)',
            borderRadius: '4px',
            textAlign: 'center',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Thank You</h2>
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              This simulation represents the real work of Endeavor Associates around the world. 
              Every interaction, every meeting, and every connection matters in supporting high-impact entrepreneurs 
              who are building the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

