import { useState } from 'react'
import { useAppState } from '../state/AppState'
import './Chapter.css'

interface Chapter2Props {
  onComplete: () => void
}

type FlowStep = 'context' | 'email_am' | 'am_reply' | 'email_founder' | 'founder_reply' | 'calendar' | 'calendar_confirmed'

export function Chapter2({ onComplete }: Chapter2Props) {
  const { addEmail, addMeeting } = useAppState()
  const [currentStep, setCurrentStep] = useState<FlowStep>('context')
  const [emailToAM, setEmailToAM] = useState({
    subject: 'SOR Coordination — TechFlow Solutions × Maria Rodriguez',
    body: `Hi Daniel,

I hope you're doing well.

We'd like to coordinate a Second Opinion Review for TechFlow Solutions with Maria Rodriguez, focused on operational scaling and execution as the company prepares for the next stage of its Endeavor journey.

Could you please share Maria's availability over the coming weeks? I'll align calendars accordingly.

Best,
[Your Name]`
  })

  const [emailToFounder, setEmailToFounder] = useState({
    subject: 'SOR Scheduling — Maria Rodriguez Availability',
    body: `Hi Omar,

Quick update — Maria Rodriguez's available slots for the SOR (all times ET) are:

Thu 1:00–1:45 PM

Thu 3:00–3:45 PM

Fri 12:30–1:15 PM

Which one works best for you? Once you confirm, I'll finalize the calendar invite.

Best,
[Your Name]`
  })

  const [calendarData, setCalendarData] = useState({
    title: 'TechFlow Solutions — SOR #1 — Maria Rodriguez',
    date: 'Thu',
    time: '3:00–3:45 PM ET',
    attendees: ['Omar Hassan (Founder)', 'Maria Rodriguez (Mentor)', 'Daniel Kim (Account Manager)', '[Your Name]'],
    agenda: 'SOR discussion on scaling operations, priorities, risks, and next steps.',
    meetingLink: 'Zoom / Teams link'
  })

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')

  const handleSendToAM = () => {
    if (!emailToAM.subject.trim()) {
      alert('Please enter a subject')
      return
    }
    
    const email = {
      id: Date.now().toString(),
      to: 'daniel.kim@endeavor.org',
      cc: [],
      subject: emailToAM.subject,
      body: emailToAM.body,
      sent: true,
    }
    addEmail(email)
    setCurrentStep('am_reply')
    
    setTimeout(() => {
      // Auto-advance after showing reply
    }, 2000)
  }

  const handleConfirmWithFounder = () => {
    setCurrentStep('email_founder')
  }

  const handleSendToFounder = () => {
    if (!emailToFounder.subject.trim()) {
      alert('Please enter a subject')
      return
    }
    
    const email = {
      id: (Date.now() + 1).toString(),
      to: 'Omar.mendoza@techflow.com',
      cc: [],
      subject: emailToFounder.subject,
      body: emailToFounder.body,
      sent: true,
    }
    addEmail(email)
    setCurrentStep('founder_reply')
    
    setTimeout(() => {
      // Auto-advance after showing reply
    }, 2000)
  }

  const handleScheduleCalendar = () => {
    if (!calendarData.title.trim()) {
      alert('Please enter a meeting title')
      return
    }
    
    const meeting = {
      id: Date.now().toString(),
      type: 'SOR' as const,
      sorNumber: 1,
      attendees: calendarData.attendees,
      date: 'Thu',
      time: '3:00–3:45 PM',
      timezone: 'ET',
      agenda: calendarData.agenda,
      confirmed: true,
    }
    
    addMeeting(meeting)
    setCurrentStep('calendar_confirmed')
    
    setTimeout(() => {
      onComplete()
    }, 3000)
  }

  // Context/Header Section
  if (currentStep === 'context') {
    return (
      <div className="chapter section-large">
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--endeavor-gray-dark)', marginBottom: '1rem' }}>
              Initiate First SOR
            </h2>
            <h1 style={{ marginBottom: '1rem' }}>Coordinate SOR with Maria Rodriguez</h1>
            <p style={{ fontSize: '1.25rem', maxWidth: '800px', marginBottom: '3rem', color: 'var(--endeavor-gray-dark)' }}>
              Coordinate a Second Opinion Review for TechFlow Solutions with Maria Rodriguez (Endeavor mentor, FinTech scaling). 
              Mentor coordination is handled through the Account Manager.
            </p>
          </div>

          {/* Company Header */}
          <div className="hero-section" style={{ marginBottom: '3rem' }}>
            <div className="hero-content">
              <div className="company-header">
                <h2>TechFlow Solutions</h2>
                <div className="company-meta">
                  <span className="badge">FinTech</span>
                  <span className="badge">Mexico</span>
                </div>
              </div>
              
              <div className="founder-photo-container">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces" 
                  alt="Omar Hassan" 
                  className="circular-photo"
                />
                <div>
                  <p className="founder-name">Omar Hassan</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)', margin: 0 }}>
                    Founder & CEO. Built TechFlow to $2M ARR, now scaling operations across Latin America.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', maxWidth: '700px' }}>
                <p>
                  TechFlow Solutions provides AI-powered financial planning tools for SMBs across Latin America. 
                  The company is at a critical growth stage, preparing for Series A funding and expanding operations.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div className="sidebar-card" style={{ position: 'static', maxWidth: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" 
                  alt="Maria Rodriguez" 
                  className="circular-photo"
                  style={{ width: '80px', height: '80px' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Mentor</h3>
                  <p style={{ fontWeight: 600, margin: 0 }}>Maria Rodriguez</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)', margin: 0 }}>
                    FinTech scaling expert
                  </p>
                </div>
              </div>
            </div>

            <div className="sidebar-card" style={{ position: 'static', maxWidth: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" 
                  alt="Daniel Kim" 
                  className="circular-photo"
                  style={{ width: '80px', height: '80px' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Account Manager</h3>
                  <p style={{ fontWeight: 600, margin: 0 }}>Daniel Kim</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)', margin: 0 }}>
                    Coordinates mentor availability
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <button className="primary" onClick={() => setCurrentStep('email_am')}>
              ➡️ Email Account Manager
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step A: Email to Account Manager
  if (currentStep === 'email_am') {
    return (
      <div className="chapter section-large">
        <div className="container">
          <h1>Email Account Manager</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '700px' }}>
            Reach out to Daniel Kim to coordinate Maria Rodriguez's availability. Note: Mentor coordination is handled through the Account Manager.
          </p>

          <div className="email-interface">
            <div className="email-header">
              <span style={{ fontWeight: 600 }}>New Email</span>
            </div>
            
            <div className="email-form">
              <div className="email-field">
                <label>To</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value="Daniel Kim — Account Manager"
                    readOnly
                    style={{ 
                      backgroundColor: 'var(--endeavor-white)',
                      border: '1px solid var(--endeavor-gray)',
                      padding: 'var(--spacing-sm)',
                      width: '100%',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    color: 'var(--endeavor-gray-dark)',
                    fontStyle: 'italic',
                  }}>
                    Mentor for this SOR:
                  </div>
                </div>
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--endeavor-gray-light)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ color: 'var(--endeavor-gray-dark)', textDecoration: 'line-through' }}>
                    Maria Rodriguez
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--endeavor-gray-dark)',
                    marginLeft: 'auto',
                    cursor: 'help',
                  }} title="Mentor coordination is handled via the Account Manager.">
                    ⓘ Mentor coordination is handled via the Account Manager.
                  </span>
                </div>
              </div>

              <div className="email-field">
                <label>Subject</label>
                <input 
                  type="text" 
                  value={emailToAM.subject}
                  onChange={(e) => setEmailToAM({ ...emailToAM, subject: e.target.value })}
                />
              </div>

              <div className="email-field">
                <label>Body</label>
                <textarea 
                  value={emailToAM.body}
                  onChange={(e) => setEmailToAM({ ...emailToAM, body: e.target.value })}
                />
              </div>

              <div className="email-actions">
                <button onClick={handleSendToAM} className="primary">
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step B: AM Reply
  if (currentStep === 'am_reply') {
    return (
      <div className="chapter section-large">
        <div className="container">
          <h1>Email Sent</h1>
          <p style={{ marginBottom: '2rem' }}>Your email has been delivered to Daniel Kim.</p>
          
          <div className="inbox-view">
            <div className="email-item" style={{ borderLeft: '3px solid var(--endeavor-teal)' }}>
              <div className="email-item-header">
                <span className="email-item-from">You → Daniel Kim</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>Just now</span>
              </div>
              <div className="email-item-subject">{emailToAM.subject}</div>
              <div className="email-item-preview" style={{ whiteSpace: 'pre-wrap' }}>
                {emailToAM.body}
              </div>
            </div>

            <div className="email-item" style={{ 
              marginTop: '1rem',
              borderLeft: '3px solid var(--endeavor-black)',
              animation: 'fadeIn 0.5s ease-in',
            }}>
              <div className="email-item-header">
                <span className="email-item-from">Daniel Kim &lt;daniel.kim@endeavor.org&gt;</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>2 hours ago</span>
              </div>
              <div className="email-item-subject">Re: {emailToAM.subject}</div>
              <div className="email-item-preview" style={{ whiteSpace: 'pre-wrap' }}>
                Hi [Your Name],

                Confirmed — I spoke with Maria. She can do any of the following slots (all times ET):

                Thu 1:00–1:45 PM

                Thu 3:00–3:45 PM

                Fri 12:30–1:15 PM

                Once you confirm the founder's preference, I'll lock it in on Maria's side.

                Best,
                Daniel
              </div>
            </div>
          </div>

          <div className="cta-section" style={{ marginTop: '3rem' }}>
            <button className="primary" onClick={handleConfirmWithFounder}>
              ➡️ Confirm time with Founder
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step C: Email to Founder
  if (currentStep === 'email_founder') {
    return (
      <div className="chapter section-large">
        <div className="container">
          <h1>Email Founder</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '700px' }}>
            Share Maria's availability with Omar and confirm his preferred time slot.
          </p>

          <div className="email-interface">
            <div className="email-header">
              <span style={{ fontWeight: 600 }}>New Email</span>
            </div>
            
            <div className="email-form">
              <div className="email-field">
                <label>To</label>
                <input 
                  type="text" 
                  value="Omar Hassan — Founder, TechFlow Solutions"
                  onChange={(e) => {
                    // Allow editing but keep it realistic
                  }}
                />
              </div>

              <div className="email-field">
                <label>Subject</label>
                <input 
                  type="text" 
                  value={emailToFounder.subject}
                  onChange={(e) => setEmailToFounder({ ...emailToFounder, subject: e.target.value })}
                />
              </div>

              <div className="email-field">
                <label>Body</label>
                <textarea 
                  value={emailToFounder.body}
                  onChange={(e) => setEmailToFounder({ ...emailToFounder, body: e.target.value })}
                />
              </div>

              <div className="email-actions">
                <button onClick={handleSendToFounder} className="primary">
                  Send to Founder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step D: Founder Reply
  if (currentStep === 'founder_reply') {
    return (
      <div className="chapter section-large">
        <div className="container">
          <h1>Email Sent</h1>
          <p style={{ marginBottom: '2rem' }}>Your email has been delivered to Omar Hassan.</p>
          
          <div className="inbox-view">
            <div className="email-item" style={{ borderLeft: '3px solid var(--endeavor-teal)' }}>
              <div className="email-item-header">
                <span className="email-item-from">You → Omar Hassan</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>Just now</span>
              </div>
              <div className="email-item-subject">{emailToFounder.subject}</div>
              <div className="email-item-preview" style={{ whiteSpace: 'pre-wrap' }}>
                {emailToFounder.body}
              </div>
            </div>

            <div className="email-item" style={{ 
              marginTop: '1rem',
              borderLeft: '3px solid var(--endeavor-black)',
              animation: 'fadeIn 0.5s ease-in',
            }}>
              <div className="email-item-header">
                <span className="email-item-from">Omar Hassan &lt;Omar.mendoza@techflow.com&gt;</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>1 hour ago</span>
              </div>
              <div className="email-item-subject">Re: {emailToFounder.subject}</div>
              <div className="email-item-preview" style={{ whiteSpace: 'pre-wrap' }}>
                Hi [Your Name],

                Thanks — Thu 3:00–3:45 PM ET works for me.

                Best,
                Omar
              </div>
            </div>
          </div>

          <div className="cta-section" style={{ marginTop: '3rem' }}>
            <button className="primary" onClick={() => {
              setSelectedTimeSlot('Thu 3:00–3:45 PM ET')
              setCurrentStep('calendar')
            }}>
              ➡️ Schedule in Calendar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step E: Calendar Scheduling
  if (currentStep === 'calendar') {
    return (
      <div className="chapter section-large">
        <div className="container">
          <h1>Schedule Meeting</h1>
          <p style={{ marginBottom: '2rem', maxWidth: '700px' }}>
            Create the calendar invite with the confirmed time slot and all attendees.
          </p>

          <div className="calendar-interface">
            <div style={{
              background: 'var(--endeavor-white)',
              border: '1px solid var(--endeavor-gray)',
              borderRadius: '4px',
              padding: 'var(--spacing-md)',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              <div className="form-field" style={{ marginBottom: 'var(--spacing-md)' }}>
                <label>Meeting Title</label>
                <input
                  type="text"
                  value={calendarData.title}
                  onChange={(e) => setCalendarData({ ...calendarData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <div className="form-field">
                  <label>Date</label>
                  <input
                    type="text"
                    value={calendarData.date}
                    onChange={(e) => setCalendarData({ ...calendarData, date: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Time</label>
                  <input
                    type="text"
                    value={calendarData.time}
                    onChange={(e) => setCalendarData({ ...calendarData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: 'var(--spacing-md)' }}>
                <label>Attendees</label>
                <div style={{
                  padding: 'var(--spacing-sm)',
                  background: 'var(--endeavor-gray-light)',
                  borderRadius: '4px',
                  minHeight: '100px',
                }}>
                  {calendarData.attendees.map((attendee, index) => (
                    <div key={index} style={{
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{ fontSize: '0.875rem' }}>{attendee}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: 'var(--spacing-md)' }}>
                <label>Agenda</label>
                <textarea
                  value={calendarData.agenda}
                  onChange={(e) => setCalendarData({ ...calendarData, agenda: e.target.value })}
                  style={{ minHeight: '100px' }}
                />
              </div>

              <div className="form-field" style={{ marginBottom: 'var(--spacing-md)' }}>
                <label>Meeting Link</label>
                <input
                  type="text"
                  value={calendarData.meetingLink}
                  onChange={(e) => setCalendarData({ ...calendarData, meetingLink: e.target.value })}
                  placeholder="Zoom / Teams link"
                />
              </div>

              <div className="email-actions">
                <button onClick={handleScheduleCalendar} className="primary">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calendar Confirmed
  if (currentStep === 'calendar_confirmed') {
    return (
      <div className="chapter section-large">
        <div className="container">
          <h1>Invite Sent</h1>
          <div style={{
            padding: '2rem',
            background: 'var(--endeavor-gray-light)',
            borderRadius: '4px',
            maxWidth: '600px',
            margin: '2rem auto',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--endeavor-teal)' }}>✓</p>
            <p style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>
              Invite sent to attendees
            </p>
            <p style={{ color: 'var(--endeavor-gray-dark)' }}>
              {calendarData.title}
            </p>
            <p style={{ color: 'var(--endeavor-gray-dark)' }}>
              {calendarData.date} {calendarData.time}
            </p>
          </div>

          <div className="sidebar-card" style={{
            maxWidth: '600px',
            margin: '3rem auto',
            position: 'static',
          }}>
            <div className="card-content">
              <h3>Next Step</h3>
              <p>
                Prepare for the SOR meeting. Review the company materials and be ready to facilitate a productive conversation 
                between Omar and Maria.
              </p>
            </div>
          </div>

          <div className="cta-section">
            <button className="primary" onClick={onComplete}>
              ➡️ Continue to Meeting
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
