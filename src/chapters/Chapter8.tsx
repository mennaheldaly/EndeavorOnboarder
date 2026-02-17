import { useState } from 'react'
import './Chapter.css'

interface Chapter8Props {
  onComplete: () => void
}

export function Chapter8({ onComplete }: Chapter8Props) {
  const [selectedFounder, setSelectedFounder] = useState<string | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
  const [introductions, setIntroductions] = useState<Array<{ founder: string; mentor: string; outcome: string }>>([])
  const [canComplete, setCanComplete] = useState(false)

  const founders = [
    { id: 'Omar', name: 'Omar Hassan', company: 'TechFlow Solutions', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces' },
  ]

  const mentors = [
    { id: 'investor1', name: 'Alex Rivera', role: 'Series A Investor', focus: 'FinTech, Latin America', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces' },
    { id: 'investor2', name: 'Sophie Chen', role: 'Strategic Partner', focus: 'B2B SaaS, Operations', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces' },
    { id: 'investor3', name: 'Marcus Johnson', role: 'Growth Advisor', focus: 'Scaling, Team Building', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces' },
    { id: 'investor4', name: 'Elena Vasquez', role: 'Industry Expert', focus: 'Financial Services, Partnerships', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=faces' },
  ]

  const handleFounderClick = (founderId: string) => {
    setSelectedFounder(founderId)
    setSelectedMentor(null)
  }

  const handleMentorClick = (mentorId: string) => {
    if (!selectedFounder) return
    setSelectedMentor(mentorId)

    // Determine outcome based on mentor
    const outcomes = ['Good fit', 'Neutral', 'Missed opportunity']
    const outcome = mentorId === 'investor1' || mentorId === 'investor4' 
      ? 'Good fit' 
      : mentorId === 'investor2' 
      ? 'Neutral' 
      : 'Missed opportunity'

    const introduction = {
      founder: founders.find(f => f.id === selectedFounder)?.name || '',
      mentor: mentors.find(m => m.id === mentorId)?.name || '',
      outcome,
    }

    const newIntroductions = [...introductions, introduction]
    setIntroductions(newIntroductions)
    setSelectedFounder(null)
    setSelectedMentor(null)

    // Allow completion after 2+ introductions
    if (newIntroductions.length >= 2) {
      setCanComplete(true)
    }
  }

  const getOutcomeClass = (outcome: string) => {
    if (outcome === 'Good fit') return 'good-fit'
    if (outcome === 'Neutral') return 'neutral'
    return 'missed'
  }

  return (
    <div className="chapter section-large">
      <div className="container">
        <h1>International Selection Panel - Founder Support</h1>
        <p style={{ marginBottom: '3rem', maxWidth: '700px', fontSize: '1.25rem' }}>
          Make strategic introductions between founders and mentors/investors. Click on a founder, then select a mentor to introduce them.
        </p>

        <div className="isp-interface">
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Founders</h2>
            <div className="people-grid">
              {founders.map((founder) => (
                <div
                  key={founder.id}
                  className={`person-card ${selectedFounder === founder.id ? 'selected' : ''}`}
                  onClick={() => handleFounderClick(founder.id)}
                >
                  <img src={founder.photo} alt={founder.name} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{founder.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>
                    {founder.company}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedFounder && (
            <div style={{
              padding: '1rem',
              background: 'var(--endeavor-yellow)',
              marginBottom: '2rem',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              <p style={{ fontWeight: 600 }}>
                Selected: {founders.find(f => f.id === selectedFounder)?.name}. Now choose a mentor to introduce.
              </p>
            </div>
          )}

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Mentors & Investors</h2>
            <div className="people-grid">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className={`person-card ${selectedMentor === mentor.id ? 'selected' : ''}`}
                  onClick={() => handleMentorClick(mentor.id)}
                  style={{
                    opacity: selectedFounder ? 1 : 0.6,
                    cursor: selectedFounder ? 'pointer' : 'not-allowed',
                  }}
                >
                  <img src={mentor.photo} alt={mentor.name} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{mentor.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)', marginBottom: '0.5rem' }}>
                    {mentor.role}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--endeavor-gray-dark)' }}>
                    {mentor.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {introductions.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Introductions Made</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {introductions.map((intro, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      background: 'var(--endeavor-gray-light)',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 600 }}>
                        {intro.founder} ↔ {intro.mentor}
                      </p>
                    </div>
                    <span className={`outcome-badge ${getOutcomeClass(intro.outcome)}`}>
                      {intro.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cta-section">
            <button
              className="primary"
              onClick={onComplete}
              disabled={!canComplete}
            >
              ➡️ Complete Journey
            </button>
            {!canComplete && (
              <p style={{ marginTop: '1rem', color: 'var(--endeavor-gray-dark)', fontSize: '0.875rem' }}>
                Make at least 2 introductions to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

