import { useState, useEffect, useMemo } from 'react'
import { useAppState } from '../state/AppState'
import './SORGuide.css'

type SORState = 'NEED_MENTOR_AVAILABILITY' | 'NEED_FOUNDER_CONFIRMATION' | 'READY_TO_SCHEDULE' | 'SCHEDULED' | 'MEETING_IN_PROGRESS' | 'MEETING_COMPLETE' | 'MEETING_LOGGED' | 'ASSESSMENT_PENDING' | 'COMPLETE'

interface SORGuideState {
  state: SORState
  hasMentorAvailability: boolean
  founderConfirmation: {
    confirmed: boolean
    selectedSlot?: string
  }
  meetingScheduled: boolean
  meetingStarted: boolean
  meetingEnded: boolean
  meetingLogged: boolean
  assessmentComplete: boolean
}

export function SORGuide() {
  const { currentSOR, emails, meetings, logs, assessments, setCurrentApp } = useAppState()
  const [dismissedSORs, setDismissedSORs] = useState<number[]>([])

  // Reset dismissed state when SOR changes
  useEffect(() => {
    // This ensures the guide shows for each new SOR
  }, [currentSOR])

  if (!currentSOR || currentSOR === 0 || dismissedSORs.includes(currentSOR)) {
    return null
  }

  // Derive SOR state from workflow data
  const deriveSorState = (): SORGuideState => {
    // Check for Account Manager email/reply
    const amEmail = emails.find(e => 
      e.threadId === 'sor-coordination' && 
      e.type === 'sent'
    )
    
    const amReply = emails.find(e => 
      e.threadId === 'sor-coordination' && 
      (e.from.includes('Daniel') || e.from.includes('Account Manager')) &&
      e.type === 'received'
    )
    
    const hasMentorAvailability = !!amReply

    // Check for founder email/reply (checking for both Omar and Omar for compatibility)
    const founderEmail = emails.find(e => 
      e.threadId === 'sor-scheduling' && 
      e.type === 'sent'
    )
    
    const founderReply = emails.find(e => 
      e.threadId === 'sor-scheduling' && 
      (e.from.includes('Omar') || e.from.includes('Omar')) &&
      e.type === 'received'
    )

    // Extract selected slot from founder reply
    let selectedSlot: string | undefined
    if (founderReply) {
      // Try to extract time slot from email body
      const timeMatch = founderReply.body.match(/(\w+\s+\d+:\d+[–-]\d+:\d+\s+(AM|PM)\s+ET?)/i) ||
                       founderReply.body.match(/(\w+\s+\d+:\d+[–-]\d+:\d+\s+ET?)/i)
      if (timeMatch) {
        selectedSlot = timeMatch[1]
      }
    }

    const founderConfirmation = {
      confirmed: !!founderReply,
      selectedSlot
    }

    // Check meeting status
    const currentMeeting = meetings.find(m => m.sorNumber === currentSOR && m.confirmed)
    const meetingScheduled = !!currentMeeting
    const meetingStarted = currentMeeting?.started === true
    const meetingEnded = currentMeeting?.ended === true
    
    const meetingLogged = !!logs.find(l => {
      const meeting = meetings.find(m => m.id === l.meetingId && m.sorNumber === currentSOR)
      return meeting !== undefined
    })
    
    const assessmentComplete = !!assessments.find(a => a.sorNumber === currentSOR && a.status === 'completed')

    // Derive state
    let state: SORState
    if (assessmentComplete) {
      state = 'COMPLETE'
    } else if (meetingLogged) {
      state = 'ASSESSMENT_PENDING'
    } else if (meetingEnded && !meetingLogged) {
      state = 'MEETING_COMPLETE'
    } else if (meetingStarted && !meetingEnded) {
      state = 'MEETING_IN_PROGRESS'
    } else if (meetingScheduled && !meetingEnded) {
      state = 'SCHEDULED'
    } else if (founderConfirmation.confirmed && !meetingScheduled) {
      state = 'READY_TO_SCHEDULE'
    } else if (hasMentorAvailability && !founderConfirmation.confirmed) {
      state = 'NEED_FOUNDER_CONFIRMATION'
    } else {
      state = 'NEED_MENTOR_AVAILABILITY'
    }

    return {
      state,
      hasMentorAvailability,
      founderConfirmation,
      meetingScheduled,
      meetingStarted,
      meetingEnded,
      meetingLogged,
      assessmentComplete
    }
  }

  const sorState = useMemo(() => deriveSorState(), [emails, meetings, logs, assessments, currentSOR])

  // Debug logging
  useEffect(() => {
    console.log('[SORGuide] State derived:', {
      sorNumber: currentSOR,
      state: sorState.state,
      hasMentorAvailability: sorState.hasMentorAvailability,
      founderConfirmed: sorState.founderConfirmation.confirmed,
      meetingScheduled: sorState.meetingScheduled
    })
  }, [sorState, currentSOR])

  // Don't show guide if SOR is complete
  if (sorState.state === 'COMPLETE') {
    return null
  }

  // Get guide content based on state
  const getGuideContent = () => {
    switch (sorState.state) {
      case 'NEED_MENTOR_AVAILABILITY':
        return {
          title: `SOR #${currentSOR} Guide`,
          message: 'Waiting on Account Manager to provide mentor availability.',
          action: 'Follow up with Account Manager if needed.',
          cta: 'Email Account Manager',
          ctaAction: () => {
            setCurrentApp('inbox')
            // Trigger compose to AM
            setTimeout(() => {
              const composeButton = document.querySelector('[data-compose-type="am"]') as HTMLElement
              if (composeButton) composeButton.click()
            }, 100)
          },
          progress: { current: 1, total: 3, steps: [
            { label: 'Mentor availability received', completed: false },
            { label: 'Founder confirmed time', completed: false },
            { label: 'Meeting scheduled', completed: false }
          ]}
        }

      case 'NEED_FOUNDER_CONFIRMATION':
        return {
          title: `SOR #${currentSOR} Guide`,
          message: 'Account Manager has provided mentor availability. Now confirm the time with the founder.',
          action: 'Click "Compose" to email Omar Hassan (Founder) with the available time slots.',
          cta: 'Compose email to Founder',
          ctaAction: () => {
            setCurrentApp('inbox')
            // Trigger compose to founder
            setTimeout(() => {
              const composeButton = document.querySelector('[data-compose-type="founder"]') as HTMLElement
              if (composeButton) composeButton.click()
            }, 100)
          },
          progress: { current: 2, total: 3, steps: [
            { label: 'Mentor availability received', completed: true },
            { label: 'Founder confirmed time', completed: false },
            { label: 'Meeting scheduled', completed: false }
          ]}
        }

      case 'READY_TO_SCHEDULE':
        return {
          title: `SOR #${currentSOR} Guide`,
          message: 'Founder has confirmed a time slot that works best. Now schedule the meeting.',
          action: 'Go to Calendar and schedule the meeting with Omar Hassan + the mentor.',
          cta: 'Open Calendar',
          ctaAction: () => {
            setCurrentApp('calendar')
          },
          progress: { current: 3, total: 3, steps: [
            { label: 'Mentor availability received', completed: true },
            { label: 'Founder confirmed time', completed: true },
            { label: 'Meeting scheduled', completed: false }
          ]}
        }

      case 'SCHEDULED':
        return {
          title: `SOR #${currentSOR} Guide`,
          message: 'Meeting is scheduled. Join the meeting and take important notes.',
          action: 'Switch to Calendar app and click on the meeting to join',
          cta: 'View Calendar Event',
          ctaAction: () => {
            setCurrentApp('calendar')
          },
          progress: { current: 3, total: 3, steps: [
            { label: 'Mentor availability received', completed: true },
            { label: 'Founder confirmed time', completed: true },
            { label: 'Meeting scheduled', completed: true }
          ]}
        }

      case 'MEETING_IN_PROGRESS':
        return {
          title: `SOR #${currentSOR} Guide`,
          message: 'You are currently in the meeting. Take important notes.',
          action: 'Click "End Meeting" in the Calendar app when finished',
          cta: null,
          ctaAction: null,
          progress: null
        }

      case 'MEETING_COMPLETE':
        return {
          title: `SOR #${currentSOR} Guide`,
          message: 'Meeting is complete. Now log it in Salesforce.',
          action: 'Switch to Salesforce app to log the meeting details',
          cta: 'Open Salesforce',
          ctaAction: () => {
            setCurrentApp('salesforce')
          },
          progress: null
        }

      case 'MEETING_LOGGED':
      case 'ASSESSMENT_PENDING':
        return {
          title: `SOR #${currentSOR} Guide`,
          message: 'Meeting is logged. Check "Related" tab for assessment. If not completed within a few days, follow up with Account Manager.',
          action: 'Switch to Salesforce app and check the Related tab',
          cta: 'Open Salesforce',
          ctaAction: () => {
            setCurrentApp('salesforce')
          },
          progress: null
        }

      default:
        return {
          title: `SOR #${currentSOR} Guide`,
          message: `Start SOR #${currentSOR} by emailing the Account Manager to coordinate mentor availability.`,
          action: 'Click "Compose" to email Daniel Kim (Account Manager)',
          cta: 'Email Account Manager',
          ctaAction: () => {
            setCurrentApp('inbox')
          },
          progress: { current: 1, total: 3, steps: [
            { label: 'Mentor availability received', completed: false },
            { label: 'Founder confirmed time', completed: false },
            { label: 'Meeting scheduled', completed: false }
          ]}
        }
    }
  }

  const guideContent = getGuideContent()

  return (
    <div className="sor-guide-bubble">
      <div className="sor-guide-content">
        <div className="sor-guide-header">
          <span className="sor-guide-icon">💡</span>
          <span className="sor-guide-title">{guideContent.title}</span>
          <button 
            className="sor-guide-dismiss"
            onClick={() => setDismissedSORs([...dismissedSORs, currentSOR])}
            aria-label="Dismiss guide"
          >
            ×
          </button>
        </div>
        <div className="sor-guide-message">
          <p>{guideContent.message}</p>
          {guideContent.action && (
            <p className="sor-guide-action">
              <strong>Next:</strong> {guideContent.action}
            </p>
          )}
          
          {/* Progress Indicator */}
          {guideContent.progress && (
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginBottom: '8px',
                fontWeight: 500
              }}>
                Step {guideContent.progress.current} of {guideContent.progress.total}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {guideContent.progress.steps.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.75rem',
                    color: step.completed ? '#10b981' : '#9ca3af'
                  }}>
                    <span style={{ fontSize: '0.875rem' }}>
                      {step.completed ? '✓' : '○'}
                    </span>
                    <span style={{
                      textDecoration: step.completed ? 'line-through' : 'none',
                      opacity: step.completed ? 0.7 : 1
                    }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          {guideContent.cta && guideContent.ctaAction && (
            <button
              className="primary"
              onClick={guideContent.ctaAction}
              style={{
                marginTop: '12px',
                padding: '6px 12px',
                fontSize: '0.8125rem',
                fontWeight: 500
              }}
            >
              {guideContent.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
