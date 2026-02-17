import { useState } from 'react'
import { useAppState, Meeting } from '../state/AppState'
import { Banner } from '../components/Banner'
import { SORGuide } from '../components/SORGuide'
import { JourneyInfoStep } from '../components/JourneyInfoStep'
import './Apps.css'

interface CalendarProps {
  onMeetingEnd?: (meetingId: string, notes: string) => void
}

export function Calendar({ onMeetingEnd }: CalendarProps) {
  const { 
    meetings, 
    addMeeting, 
    currentSOR, 
    emails, 
    addNote, 
    setCurrentApp, 
    selectedChampion, 
    updateChampionFollowupScheduled,
    founderConfirmedChampionSlot,
    confirmedChampionSlot,
    championPanelistId,
    setFollowupScheduled,
    setFollowupLoggedInSalesforce
  } = useAppState()
  const [showEventForm, setShowEventForm] = useState(false)
  const [meetingNotes, setMeetingNotes] = useState('')
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    timezone: 'ET',
    attendees: [] as string[],
    agenda: '',
    meetingLink: '',
  })
  const [joiningMeeting, setJoiningMeeting] = useState<string | null>(null)
  const [showTranscript, setShowTranscript] = useState(true)

  // Get confirmed time from founder email (check for both Omar and Omar for backward compatibility)
  const founderReply = emails.find(e => 
    (e.from.includes('Omar') || e.from.includes('Omar')) && 
    (e.subject.includes('SOR Scheduling') || e.threadId === 'sor-scheduling') &&
    e.type === 'received'
  )

  const getBannerMessage = () => {
    // Check for founder confirmed champion slot - ready to schedule (LSP flow, not SOR)
    if (founderConfirmedChampionSlot && confirmedChampionSlot && !meetings.find(m => m.type === 'LSP' && m.title.includes('Champion'))) {
      return 'Founder has confirmed time. Schedule the champion follow-up meeting.'
    }

    // Check for champion follow-up email reply (LSP flow, not SOR)
    const championReply = emails.find(e => 
      e.threadId === 'champion-followup' && 
      e.type === 'received'
    )
    if (championReply && !meetings.find(m => m.type === 'LSP' && m.title.includes('Champion'))) {
      return 'Champion has shared availability. Forward to founder to confirm time.'
    }

    // Removed SOR progression banner:
    // - "SOR meeting scheduled. Join when ready." (normal state)
    // This is handled by the SOR Guide component which provides better context.

    return null
  }

  const bannerMessage = getBannerMessage()

  const handleCreateEvent = () => {
    // Check for champion follow-up with confirmed slot
    if (founderConfirmedChampionSlot && confirmedChampionSlot && championPanelistId) {
      const championName = championPanelistId === 'sarah-nguyen' ? 'Sarah Nguyen' :
                          championPanelistId === 'karim-el-masry' ? 'Karim El-Masry' :
                          championPanelistId === 'lina-abou-raya' ? 'Lina Abou-Raya' :
                          championPanelistId === 'james-whitmore' ? 'James Whitmore' : 'Champion'
      
      // Parse the confirmed slot (e.g., "Mon 2:00–3:00 PM ET")
      const slotMatch = confirmedChampionSlot.match(/(Mon|Tue|Wed|Thu|Fri)\s+(\d+:\d+[–-]\d+:\d+\s+(AM|PM))\s+ET/)
      if (slotMatch) {
        setEventData({
          title: `LSP Champion Follow-up — TechFlow Solutions`,
          date: slotMatch[1],
          time: slotMatch[2],
          timezone: 'ET',
          attendees: ['Omar Hassan (Founder)', championName + ' (Champion)', '[Your Name]'],
          agenda: 'High-level feedback, strengths, risks, and readiness for next steps',
          meetingLink: '',
        })
      } else {
        setEventData({
          title: `LSP Champion Follow-up — TechFlow Solutions`,
          date: '',
          time: confirmedChampionSlot,
          timezone: 'ET',
          attendees: ['Omar Hassan (Founder)', championName + ' (Champion)', '[Your Name]'],
          agenda: 'High-level feedback, strengths, risks, and readiness for next steps',
          meetingLink: '',
        })
      }
      setShowEventForm(true)
      return
    }

    // Check for champion follow-up from email reply
    const championReply = emails.find(e => 
      e.threadId === 'champion-followup' && 
      e.type === 'received'
    )
    
    if (championReply && selectedChampion) {
      // Pre-fill champion follow-up meeting
      const timeMatch = championReply.body.match(/(Mon|Tue|Wed|Thu|Fri)\s+(\d+:\d+[–-]\d+:\d+\s+(AM|PM))\s+ET/)
      if (timeMatch) {
        setEventData({
          title: `TechFlow Solutions — Champion Follow-Up — ${selectedChampion}`,
          date: timeMatch[1],
          time: timeMatch[2],
          timezone: 'ET',
          attendees: ['Omar Hassan (Founder)', selectedChampion + ' (Champion)', '[Your Name]'],
          agenda: '15–30 minute follow-up discussion based on LSP panel feedback.',
          meetingLink: '',
        })
      } else {
        setEventData({
          title: `TechFlow Solutions — Champion Follow-Up — ${selectedChampion}`,
          date: '',
          time: '',
          timezone: 'ET',
          attendees: ['Omar Hassan (Founder)', selectedChampion + ' (Champion)', '[Your Name]'],
          agenda: '15–30 minute follow-up discussion based on LSP panel feedback.',
          meetingLink: '',
        })
      }
      setShowEventForm(true)
      return
    }

    // Pre-fill from founder reply for SOR
    if (founderReply) {
      // Try multiple regex patterns to match different time formats
      // Pattern 1: "Thu 3:00–3:45 PM ET" or "Thu 3:00-3:45 PM ET"
      // Pattern 2: "3:00–3:45 PM ET" (no day)
      const patterns = [
        /(Mon|Tue|Wed|Thu|Fri)\s+(\d{1,2}:\d{2}[–-]\d{1,2}:\d{2}\s+(AM|PM))\s+ET/i,
        /(\d{1,2}:\d{2}[–-]\d{1,2}:\d{2}\s+(AM|PM))\s+ET/i,
      ]
      
      let timeMatch = null
      let matchedPattern = null
      for (const pattern of patterns) {
        timeMatch = founderReply.body.match(pattern)
        if (timeMatch) {
          matchedPattern = pattern
          break
        }
      }
      
      if (timeMatch) {
        let day = ''
        let time = ''
        
        if (matchedPattern === patterns[0]) {
          // First pattern matched - has day
          day = timeMatch[1]
          time = timeMatch[2]
        } else {
          // Second pattern matched - no day, extract time
          day = 'Thu' // Default day
          time = timeMatch[1]
        }
        
        setEventData({
          title: `TechFlow Solutions — SOR #${currentSOR} — Maria Rodriguez`,
          date: day,
          time: time,
          timezone: 'ET',
          attendees: ['Omar Hassan (Founder)', 'Maria Rodriguez (Mentor)', 'Daniel Kim (Account Manager)', '[Your Name]'],
          agenda: 'SOR discussion on scaling operations, priorities, risks, and next steps.',
          meetingLink: '',
        })
      } else {
        // If no match, still pre-fill with basic info
        setEventData({
          title: `TechFlow Solutions — SOR #${currentSOR} — Maria Rodriguez`,
          date: '',
          time: '',
          timezone: 'ET',
          attendees: ['Omar Hassan (Founder)', 'Maria Rodriguez (Mentor)', 'Daniel Kim (Account Manager)', '[Your Name]'],
          agenda: 'SOR discussion on scaling operations, priorities, risks, and next steps.',
          meetingLink: '',
        })
      }
      setShowEventForm(true)
      return
    }
    
    // If no specific email found, show empty form
    setShowEventForm(true)
  }

  const handleSendInvite = () => {
    if (!eventData.title || !eventData.date || !eventData.time) {
      alert('Please fill in all required fields')
      return
    }

    // Check for champion meeting (case-insensitive)
    const isChampionMeeting = eventData.title.toLowerCase().includes('champion')
    
    console.log('[Calendar] handleSendInvite:', {
      title: eventData.title,
      isChampionMeeting
    })
    
    const meeting: Meeting = {
      id: Date.now().toString(),
      type: isChampionMeeting ? 'LSP' : 'SOR',
      sorNumber: isChampionMeeting ? undefined : currentSOR,
      title: eventData.title,
      attendees: eventData.attendees,
      date: eventData.date,
      time: eventData.time,
      timezone: eventData.timezone,
      agenda: eventData.agenda,
      meetingLink: eventData.meetingLink,
      confirmed: true,
    }
    
    if (isChampionMeeting) {
      updateChampionFollowupScheduled(true)
      setFollowupScheduled(true)
    }

    addMeeting(meeting)
    setShowEventForm(false)
    setEventData({
      title: '',
      date: '',
      time: '',
      timezone: 'ET',
      attendees: [],
      agenda: '',
      meetingLink: '',
    })
  }

  const handleJoinMeeting = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId)
    if (meeting) {
      console.log('[Calendar] handleJoinMeeting called:', {
        meetingId,
        meetingTitle: meeting.title,
        meetingType: meeting.type,
        includesChampion: meeting.title.includes('Champion'),
        includesChampionFollowup: meeting.title.includes('Champion Follow-up') || meeting.title.includes('Champion Follow-Up')
      })
      
      // Check if this is a champion follow-up meeting (case-insensitive)
      const isChampionMeeting = meeting.title.toLowerCase().includes('champion')
      const isLSPType = meeting.type === 'LSP'
      
      console.log('[Calendar] Champion meeting check:', {
        isChampionMeeting,
        isLSPType,
        shouldShowInfoScreen: isChampionMeeting && isLSPType
      })
      
      if (isChampionMeeting && isLSPType) {
        console.log('[Calendar] Showing champion follow-up info screen')
        setJoiningMeeting(meetingId)
        // Mark meeting as started
        addMeeting({ ...meeting, started: true })
        return
      }
      // For regular meetings, show the meeting view
      console.log('[Calendar] Showing regular meeting view')
      setJoiningMeeting(meetingId)
      addMeeting({ ...meeting, started: true })
    }
  }

  const handleEndMeeting = (meetingId: string) => {
    // Get the latest meeting from state
    const latestMeeting = meetings.find(m => m.id === meetingId)
    if (latestMeeting) {
      // Save notes
      if (meetingNotes.trim()) {
        addNote({
          id: Date.now().toString(),
          meetingId: latestMeeting.id,
          content: meetingNotes,
          timestamp: new Date().toISOString(),
        })
      }
      // Update the meeting to mark it as ended
      addMeeting({ ...latestMeeting, ended: true })
    }
    // Meeting ended - user can now log in Salesforce
    setJoiningMeeting(null)
    setMeetingNotes('')
    if (onMeetingEnd) {
      onMeetingEnd(meetingId, meetingNotes)
    }
  }

  const currentMeeting = joiningMeeting ? meetings.find(m => m.id === joiningMeeting) : null

  // SOR Meeting Transcript Content
  const sorTranscript = currentMeeting?.type === 'SOR' ? [
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Thanks everyone. I'll keep this brief.

TechFlow Solutions is a B2B FinTech platform helping mid-sized merchants manage cross-border payments more efficiently.

We saw strong growth in 2022 as we expanded into three new markets, but growth slowed last year as we paused expansion to stabilize operations and improve unit economics.

Today we serve over 1,200 merchants, are profitable at the contribution margin level, and are preparing for our next phase of scaling.`
    },
    {
      speaker: 'Mentor',
      name: 'Maria Rodriguez',
      text: `Thanks, Omar. I noticed revenue dipped in 2023. Can you walk me through what specifically drove that decline?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Absolutely. The dip was largely intentional. We exited two underperforming markets where CAC had increased significantly, and we restructured part of the sales team. Short term, that reduced top-line growth, but margins improved materially.`
    },
    {
      speaker: 'Mentor',
      name: 'Maria Rodriguez',
      text: `How confident are you that the current operating model can scale without another restructuring?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `We've spent the last nine months standardizing processes and hiring senior operators in finance and ops. While we expect some strain as volumes increase, we don't foresee another major reset.`
    },
    {
      speaker: 'Mentor',
      name: 'Maria Rodriguez',
      text: `What would you say is the single biggest risk over the next 12 months?`
    },
    {
      speaker: 'Founder',
      name: 'Omar Hassan',
      text: `Execution speed. Demand is there, but ensuring the team scales without breaking internal systems is our biggest challenge.`
    }
  ] : []

  if (joiningMeeting && currentMeeting) {
    const isSORMeeting = currentMeeting.type === 'SOR'
    // Check for champion follow-up (case-insensitive)
    const isChampionFollowup = currentMeeting.type === 'LSP' && currentMeeting.title.toLowerCase().includes('champion')
    
    console.log('[Calendar] Rendering meeting view:', {
      joiningMeeting,
      currentMeetingTitle: currentMeeting.title,
      currentMeetingType: currentMeeting.type,
      isSORMeeting,
      isChampionFollowup
    })
    
    // Show informational screen for champion follow-up meetings
    if (isChampionFollowup) {
      console.log('[Calendar] Rendering champion follow-up info screen')
      return (
        <JourneyInfoStep
          title="Champion Follow-Up Meeting"
          stepIndex={1}
          totalSteps={5}
          summary="Following the Local Selection Panel, your Endeavor Champion will meet with you to share and recap the panel's feedback, including strengths highlighted and key areas for further development."
          bullets={[
            "Timeline to the International Selection Panel can range from a few months to up to a year, based on the company's readiness",
            "During this period, you will work closely with a global Profile Editor to refine your company profile and strengthen positioning where needed",
            "Ensure the business is fully prepared before advancing to the ISP",
            "Once ready, Endeavor will nominate your company and secure a spot at an upcoming International Selection Panel"
          ]}
          icon="calendar"
          onNext={() => {
            setJoiningMeeting(null)
            // Mark meeting as ended
            const meeting = meetings.find(m => m.id === joiningMeeting)
            if (meeting) {
              addMeeting({ ...meeting, ended: true })
            }
            // Trigger ISP flow by setting followupLoggedInSalesforce
            setFollowupLoggedInSalesforce(true)
          }}
        />
      )
    }
    
    return (
      <div className="app-container">
        <div className="meeting-view">
          <div className="video-panel">
            <div className="video-participant">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces" 
                alt={isSORMeeting ? "Maria Rodriguez" : "Participant"}
              />
              <p style={{ fontWeight: 600 }}>{isSORMeeting ? "Maria Rodriguez" : "Participant"}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>{isSORMeeting ? "Mentor" : "Attendee"}</p>
            </div>
            
            <div style={{ fontSize: '2rem', color: 'var(--endeavor-gray-dark)', margin: '1rem 0' }}>+</div>
            
            <div className="video-participant">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces" 
                alt="Omar Hassan"
              />
              <p style={{ fontWeight: 600 }}>Omar Hassan</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>Founder</p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button className="primary" onClick={() => handleEndMeeting(joiningMeeting)}>
                End Meeting
              </button>
            </div>
          </div>

          <div className="notes-panel">
            {isSORMeeting && sorTranscript.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  <h3 style={{ margin: 0 }}>Meeting Transcript</h3>
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'transparent',
                      border: '1px solid var(--endeavor-gray)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    {showTranscript ? 'Hide' : 'Show'} Transcript
                  </button>
                </div>
                
                {showTranscript && (
                  <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    padding: 'var(--spacing-md)',
                    background: 'var(--endeavor-gray-light)',
                    borderRadius: '4px',
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                  }}>
                    {sorTranscript.map((entry, index) => (
                      <div key={index} style={{ marginBottom: 'var(--spacing-md)' }}>
                        <p style={{ 
                          fontWeight: 600, 
                          color: entry.speaker === 'Founder' ? 'var(--endeavor-teal)' : 'var(--endeavor-black)',
                          marginBottom: '0.25rem'
                        }}>
                          {entry.name} ({entry.speaker}):
                        </p>
                        <p style={{ 
                          color: 'var(--endeavor-gray-dark)',
                          whiteSpace: 'pre-wrap',
                          margin: 0
                        }}>
                          {entry.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <h3>Meeting Notes</h3>
            <textarea
              className="notes-textarea"
              placeholder="Type your notes here as the meeting progresses..."
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              style={{ minHeight: '300px' }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      {bannerMessage && <Banner message={bannerMessage} />}
      {currentSOR > 0 && <SORGuide />}
      <div className="calendar-app">
        <div className="calendar-header">
          <h1>Calendar</h1>
          <button className="primary" onClick={handleCreateEvent}>
            Create Event
          </button>
        </div>

        {showEventForm && (
          <div className="event-form">
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>New Event</h2>
            
            <div className="composer-field">
              <label>Title</label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <div className="composer-field">
                <label>Date</label>
                <input
                  type="text"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                />
              </div>
              <div className="composer-field">
                <label>Time</label>
                <input
                  type="text"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                />
              </div>
              <div className="composer-field">
                <label>Timezone</label>
                <input
                  type="text"
                  value={eventData.timezone}
                  onChange={(e) => setEventData({ ...eventData, timezone: e.target.value })}
                />
              </div>
            </div>

            <div className="composer-field">
              <label>Attendees</label>
              <div style={{
                padding: 'var(--spacing-sm)',
                background: 'var(--endeavor-gray-light)',
                borderRadius: '4px',
                minHeight: '80px',
              }}>
                {eventData.attendees.map((attendee, index) => (
                  <div key={index} style={{ padding: '0.5rem', fontSize: '0.875rem' }}>
                    {attendee}
                  </div>
                ))}
              </div>
            </div>

            <div className="composer-field">
              <label>Agenda</label>
              <textarea
                value={eventData.agenda}
                onChange={(e) => setEventData({ ...eventData, agenda: e.target.value })}
                style={{ minHeight: '100px' }}
              />
            </div>

            <div className="composer-field">
              <label>Meeting Link</label>
              <input
                type="text"
                value={eventData.meetingLink}
                onChange={(e) => setEventData({ ...eventData, meetingLink: e.target.value })}
                placeholder="Zoom / Teams link"
              />
            </div>

            <div className="composer-actions">
              <button onClick={() => setShowEventForm(false)}>Cancel</button>
              <button className="primary" onClick={handleSendInvite}>
                Send Invite
              </button>
            </div>
          </div>
        )}

        <div className="calendar-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="calendar-day">
              <div className="calendar-day-header">{day}</div>
              {meetings
                .filter(m => m.date.includes(day))
                .map((meeting) => (
                  <div
                    key={meeting.id}
                    className="calendar-event"
                    onClick={() => {
                      if (meeting.confirmed && !meeting.started) {
                        handleJoinMeeting(meeting.id)
                      }
                    }}
                  >
                    {meeting.title}
                    <br />
                    {meeting.time}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

