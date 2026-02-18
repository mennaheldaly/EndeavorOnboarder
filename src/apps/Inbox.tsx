import { useState, useEffect } from 'react'
import { useAppState, Email } from '../state/AppState'
import { Banner } from '../components/Banner'
import { SORGuide } from '../components/SORGuide'
import './Apps.css'

export function Inbox() {
  const { 
    emails, 
    addEmail, 
    currentSOR, 
    completedSORs,
    meetings,
    assessments,
    logs,
    addAssessment,
    selectedChampion,
    lspPros,
    lspCons,
    updateChampionFollowupScheduled,
    outcomeEmailSent,
    deliberationsComplete,
    setCurrentApp,
    setOutcomeEmailSent,
    passedLSP,
    championPanelistId,
    congratsEmailSent,
    setCongratsEmailSent,
    prosConsDrafted,
    championEmailSent,
    setChampionEmailSent,
    championAvailabilityReceived,
    championAvailabilitySlots,
    founderConfirmedChampionSlot,
    confirmedChampionSlot,
    setChampionAvailabilityReceived,
    setFounderConfirmedChampionSlot,
    currentApp,
    setFollowupLoggedInSalesforce,
    setCurrentStage,
  } = useAppState()
  
  console.log('[Inbox] Rendered with currentApp:', currentApp, 'congratsEmailSent:', congratsEmailSent, 'prosConsDrafted:', prosConsDrafted)
  
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)
  const [composeType, setComposeType] = useState<'am' | 'founder' | 'assessment-followup' | 'champion' | 'outcome' | 'champion-availability' | 'congrats' | 'champion-email' | 'forward-availability' | null>(null)
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: '',
  })
  const [isSending, setIsSending] = useState(false)

  // Check for assessment followup flag
  useEffect(() => {
    const followupData = localStorage.getItem('assessmentFollowup')
    if (followupData) {
      try {
        const data = JSON.parse(followupData)
        // Check if it's recent (within last minute)
        if (Date.now() - data.timestamp < 60000) {
          setComposeType('assessment-followup')
          setComposeData({
            to: 'Daniel Kim — Account Manager',
            subject: `SOR #${data.sorNumber} - Mentor Assessment Follow-up`,
            body: `Hi Daniel,

I wanted to follow up on the mentor assessment for SOR #${data.sorNumber} with TechFlow Solutions. The meeting has been logged in Salesforce, but the mentor assessment is still showing as pending.

Could you please confirm if the mentor has completed their assessment? Once it's available, I'll update the record in Salesforce.

Thanks,
[Your Name]`
          })
          setComposing(true)
          // Clear the flag
          localStorage.removeItem('assessmentFollowup')
        }
      } catch (e) {
        // Invalid data, clear it
        localStorage.removeItem('assessmentFollowup')
      }
    }
  }, [])

  // Check for champion email flag (after pros/cons)
  useEffect(() => {
    const championEmailFlag = localStorage.getItem('championEmail')
    if (championEmailFlag && selectedChampion && lspPros.length > 0) {
      try {
        const data = JSON.parse(championEmailFlag)
        if (Date.now() - data.timestamp < 60000) {
          const prosText = lspPros.map((pro, i) => `${i + 1}. ${pro}`).join('\n')
          const consText = lspCons.map((con, i) => `${i + 1}. ${con}`).join('\n')
          
          setComposeType('champion')
          setComposeData({
            to: `${selectedChampion} — Champion`,
            subject: 'LSP Follow-Up — TechFlow Solutions',
            body: `Hi ${selectedChampion},

Thank you again for your participation in the Local Selection Panels.

Below is a high-level summary of key strengths and considerations raised during the panels to support your follow-up conversation with the founders:

Pros

${prosText}

Cons / Areas to Watch

${consText}

Would you be available for a 15–30 minute follow-up call with the company over the coming days? Happy to align calendars once I have your availability.

Best,
[Your Name]`
          })
          setComposing(true)
          localStorage.removeItem('championEmail')
        }
      } catch (e) {
        localStorage.removeItem('championEmail')
      }
    }
  }, [selectedChampion, lspPros, lspCons])

  // Check for composeCongratsEmail flag (from Post-LSP Next Steps)
  useEffect(() => {
    const composeCongratsFlag = localStorage.getItem('composeCongratsEmail')
    if (composeCongratsFlag && !composing) {
      try {
        const data = JSON.parse(composeCongratsFlag)
        if (Date.now() - data.timestamp < 60000) {
          setComposeType('congrats')
          setComposeData({
            to: 'Omar Hassan — Founder, TechFlow Solutions',
            subject: 'LSP Outcome — Next Steps',
            body: `Hi Omar,

Great seeing you today, and huge congratulations on successfully passing your Local Selection Panel! It's a milestone in your Endeavor journey and more importantly, a strong testament to the strength of TechFlow Solutions and the team and vision behind it. The panel was very impressed by both the scale of what you've built and the ambition you have for what comes next.

We're very excited to keep supporting you as you move forward to the next stages of the selection process and continue growing your impact in the region and beyond.

Well done again, very well deserved!!

Best,
[Your Name]`
          })
          setComposing(true)
          localStorage.removeItem('composeCongratsEmail')
        }
      } catch (e) {
        localStorage.removeItem('composeCongratsEmail')
      }
    }
  }, [composing])

  // Legacy check (keep for backward compatibility, but won't auto-open)
  // useEffect(() => {
  //   if (passedLSP && championPanelistId && !congratsEmailSent && !composing) {
  //     // Auto-opening removed - user must click button in Post-LSP Next Steps
  //   }
  // }, [passedLSP, championPanelistId, congratsEmailSent, composing])

  // Check for composeChampionEmail flag (from Post-LSP Next Steps)
  useEffect(() => {
    const composeChampionFlag = localStorage.getItem('composeChampionEmail')
    if (composeChampionFlag && !composing && prosConsDrafted) {
      try {
        const data = JSON.parse(composeChampionFlag)
        if (Date.now() - data.timestamp < 60000) {
          const championName = championPanelistId === 'sarah-nguyen' ? 'Sarah Nguyen' :
                              championPanelistId === 'karim-el-masry' ? 'Karim El-Masry' :
                              championPanelistId === 'lina-abou-raya' ? 'Lina Abou-Raya' :
                              championPanelistId === 'james-whitmore' ? 'James Whitmore' :
                              championPanelistId === 'maria-santos' ? 'Maria Santos' :
                              championPanelistId === 'david-chen' ? 'David Chen' : 'Champion'
          
          // Get synthesized pros/cons from state
          const strengthsText = lspPros.length > 0 ? lspPros.filter(p => p.trim()).join(', ') : 'None specified'
          const challengesText = lspCons.length > 0 ? lspCons.filter(c => c.trim()).join(', ') : 'None specified'
          
          setComposeType('champion-email')
          setComposeData({
            to: `${championName} — Champion`,
            subject: 'LSP Follow-up — TechFlow Solutions',
            body: `Hi ${championName},

Thank you so much for joining us as a panelist in the Local Selection Panel. We really appreciate your time and insights and are especially grateful that you've agreed to lead the feedback session.

Below is a summary of key themes from the deliberations to support your follow-up conversation with the founders:

Strengths: ${strengthsText}

Challenges / Areas to Watch: ${challengesText}

Would you be available for a 15–30 minute follow-up call with the company over the coming days? Please share 2–3 time slots that work for you, and I'll coordinate with the founders to schedule.

Best,
[Your Name]`
          })
          setComposing(true)
          localStorage.removeItem('composeChampionEmail')
        }
      } catch (e) {
        localStorage.removeItem('composeChampionEmail')
      }
    }
  }, [composing, prosConsDrafted, championPanelistId, lspPros, lspCons])

  // Check if forward availability email should be shown (after champion replies with availability)
  useEffect(() => {
    // Check if email was already sent to prevent duplicate compose windows
    const emailAlreadySent = emails.some(e => 
      e.threadId === 'champion-availability' && 
      e.subject === 'Champion Follow-Up Availability' &&
      e.type === 'sent'
    )
    
    if (championAvailabilityReceived && !founderConfirmedChampionSlot && !composing && championAvailabilitySlots.length > 0 && !emailAlreadySent) {
      setComposeType('forward-availability')
      setComposeData({
        to: 'Omar Hassan — Founder, TechFlow Solutions',
        subject: 'Champion Follow-Up Availability',
        body: `Hi Omar,

The Champion has shared their availability for the follow-up meeting:

${championAvailabilitySlots.map(slot => `• ${slot}`).join('\n')}

Which time works best for you? Once you confirm, I'll finalize the calendar invite.

Best,
[Your Name]`
      })
      setComposing(true)
    }
  }, [championAvailabilityReceived, founderConfirmedChampionSlot, composing, championAvailabilitySlots, emails])

  // Check for schedule champion meeting flag
  useEffect(() => {
    const scheduleFlag = localStorage.getItem('scheduleChampionMeeting')
    if (scheduleFlag) {
      try {
        const data = JSON.parse(scheduleFlag)
        if (Date.now() - data.timestamp < 60000) {
          setCurrentApp('calendar')
          localStorage.removeItem('scheduleChampionMeeting')
        }
      } catch (e) {
        localStorage.removeItem('scheduleChampionMeeting')
      }
    }
  }, [])

  // Get banner message
  // Only show banners for exceptional states (errors/blockers), not normal progression
  const getBannerMessage = () => {
    // Removed all LSP/post-LSP banners - these are now handled by Post-LSP Next Steps screen
    // Removed SOR progression banners - these are handled by the SOR Guide component

    return null
  }

  const bannerMessage = getBannerMessage()

  // Group emails by thread
  const threads = emails.reduce((acc, email) => {
    const threadId = email.threadId || email.id
    if (!acc[threadId]) {
      acc[threadId] = []
    }
    acc[threadId].push(email)
    return acc
  }, {} as Record<string, Email[]>)

  const selectedEmails = selectedThread ? threads[selectedThread] || [] : []

  const handleCompose = (type: 'am' | 'founder') => {
    setComposeType(type)
    setComposing(true)
    
    if (type === 'am') {
      setComposeData({
        to: 'Daniel Kim — Account Manager',
        subject: `SOR Coordination — TechFlow Solutions × Maria Rodriguez`,
        body: `Hi Daniel,

I hope you're doing well.

We'd like to coordinate a Second Opinion Review for TechFlow Solutions with Maria Rodriguez, focused on operational scaling and execution as the company prepares for the next stage of its Endeavor journey. For context, TechFlow Solutions is an AI-powered financial planning platform for SMBs across Latin America, currently at $7M ARR with strong product-market fit in Mexico and expanding rapidly as it prepares for multi-market growth toward $20M+ ARR.

Could you please share Maria's availability over the coming weeks? I'll align calendars accordingly.

Best,
[Your Name]`
      })
    } else {
      const amReply = emails.find(e => 
        e.from.includes('Daniel') && 
        e.subject.includes('SOR Coordination')
      )
      setComposeData({
        to: 'Omar Hassan — Founder, TechFlow Solutions',
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
    }
  }

  const handleSend = () => {
    // Prevent multiple rapid clicks
    if (isSending) {
      return
    }
    
    if (!composeData.to || !composeData.subject) {
      alert('Please fill in recipient and subject')
      return
    }

    // Check if trying to email Maria directly
    if (composeData.to.toLowerCase().includes('maria rodriguez')) {
      alert('Mentor coordination is handled via the Account Manager.')
      return
    }
    
    setIsSending(true)

    const email: Email = {
      id: Date.now().toString(),
      threadId: composeType === 'am' 
        ? 'sor-coordination' 
        : composeType === 'assessment-followup'
        ? 'assessment-followup'
        : composeType === 'champion'
        ? 'champion-followup'
        : composeType === 'outcome'
        ? 'lsp-outcome'
        : composeType === 'champion-availability'
        ? 'champion-availability'
        : composeType === 'congrats'
        ? 'lsp-outcome'
        : composeType === 'champion-email'
        ? 'champion-followup'
        : composeType === 'forward-availability'
        ? 'champion-availability'
        : 'sor-scheduling',
      from: '[Your Name]',
      to: composeData.to,
      subject: composeData.subject,
      body: composeData.body,
      timestamp: new Date().toISOString(),
      sent: true,
      read: true,
      type: 'sent',
    }

    addEmail(email)
    
    // If this is a forward-availability email, set founderConfirmedChampionSlot immediately
    // to prevent the useEffect from reopening the compose window
    if (composeType === 'forward-availability') {
      const selectedSlot = championAvailabilitySlots[0] // Default to first slot
      setFounderConfirmedChampionSlot(true, selectedSlot)
    }
    
    setComposing(false)
    setComposeData({ to: '', subject: '', body: '' })
    setSelectedThread(email.threadId || email.id)
    setIsSending(false)

    // If this is an outcome email, mark as sent
    if (composeType === 'outcome') {
      setOutcomeEmailSent(true)
    }

    // If this is a congrats email, mark as sent and dispatch event
    if (composeType === 'congrats') {
      setCongratsEmailSent(true)
      
      // Update step state for Post-LSP workflow
      const caseId = 'techflow-solutions' // In production, this would come from route/context
      const STORAGE_KEY = `postLspSteps_${caseId}`
      const saved = localStorage.getItem(STORAGE_KEY)
      let steps = saved ? JSON.parse(saved) : {
        founderEmailSent: false,
        notesSynthesized: false,
        championEmailSent: false
      }
      steps.founderEmailSent = true
      localStorage.setItem(STORAGE_KEY, JSON.stringify(steps))
      console.log('[PostLSP] Step 1 complete: founder email sent', { caseId, emailType: 'FOUNDER_THANK_YOU', steps })
      
      // Dispatch event for Post-LSP Next Steps
      window.dispatchEvent(new CustomEvent('post-lsp-step1-complete'))
      // Return to Post-LSP Next Steps screen if flag is set
      const returnToPostLSP = localStorage.getItem('returnToPostLSPNextSteps') === 'true'
      console.log('[Email] sent, navigating back', { 
        returnTo: returnToPostLSP ? 'post-lsp-next-steps' : null,
        emailType: 'congrats'
      })
      if (returnToPostLSP) {
        setTimeout(() => {
          localStorage.removeItem('returnToPostLSPNextSteps')
          setCurrentApp('overview')
        }, 500)
      }
    }

    // If this is a champion email, mark as sent and dispatch event
    if (composeType === 'champion-email') {
      setChampionEmailSent(true)
      // Dispatch event for Post-LSP Next Steps
      window.dispatchEvent(new CustomEvent('post-lsp-step3-complete'))
      
      // Check if this is a Post-LSP champion email (should redirect to ISP landing)
      const composeChampionFlag = localStorage.getItem('composeChampionEmail')
      let shouldRedirectToISP = false
      let emailType = null
      
      if (composeChampionFlag) {
        try {
          const data = JSON.parse(composeChampionFlag)
          emailType = data.emailType
          shouldRedirectToISP = data.nextRoute === 'isp-landing' || data.emailType === 'CHAMPION_FOLLOWUP'
        } catch (e) {
          // If flag is invalid, check if returnToPostLSPNextSteps is NOT set
          // (champion email from Post-LSP should NOT have returnToPostLSPNextSteps)
          shouldRedirectToISP = localStorage.getItem('returnToPostLSPNextSteps') !== 'true'
        }
        localStorage.removeItem('composeChampionEmail')
      }
      
      console.log('[ChampionEmail] sent -> redirect decision', { 
        emailType,
        shouldRedirectToISP,
        returnToPostLSP: localStorage.getItem('returnToPostLSPNextSteps')
      })
      
      if (shouldRedirectToISP) {
        // Redirect to ISP landing page (Global Review Session)
        // Set followupLoggedInSalesforce to trigger ISP flow
        console.log('[ChampionEmail] sent -> redirect to ISP landing', { 
          caseId: 'techflow-solutions',
          ispUrl: 'isp-landing (GlobalReviewSession)'
        })
        setTimeout(() => {
          setFollowupLoggedInSalesforce(true)
          setCurrentStage('ISP') // Update timeline to highlight ISP
          // Navigate to overview - FlowController will show GlobalReviewSession
          setCurrentApp('overview')
        }, 500)
      } else {
        // Legacy behavior: return to Post-LSP Next Steps if explicitly requested
        const returnToPostLSP = localStorage.getItem('returnToPostLSPNextSteps') === 'true'
        console.log('[Email] sent, navigating back', { 
          returnTo: returnToPostLSP ? 'post-lsp-next-steps' : null,
          emailType: 'champion-email'
        })
        if (returnToPostLSP) {
          setTimeout(() => {
            localStorage.removeItem('returnToPostLSPNextSteps')
            setCurrentApp('overview')
          }, 500)
        }
      }
    }

    // If this is an assessment followup, simulate completion after reply
    if (composeType === 'assessment-followup') {
      setTimeout(() => {
        const assessment = assessments.find(a => a.sorNumber === currentSOR)
        if (assessment) {
          // Simulate assessment completion after follow-up
          setTimeout(() => {
            addAssessment({
              ...assessment,
              status: 'completed',
              mentorName: 'Maria Rodriguez',
              ratings: {
                readiness: 8,
                potential: 9,
                fit: 8,
              },
              feedback: 'Strong candidate with clear growth path. Founder demonstrates strong vision and execution capability. Recommend proceeding to LSP.',
              completedAt: new Date().toISOString(),
            })
          }, 2000)
        }
      }, 2000)
    }

    // Generate reply after a delay
    setTimeout(() => {
      if (composeType === 'am') {
        const reply: Email = {
          id: (Date.now() + 1).toString(),
          threadId: 'sor-coordination',
          from: 'Daniel Kim <daniel.kim@endeavor.org>',
          to: '[Your Name]',
          subject: `Re: ${composeData.subject}`,
          body: `Hi [Your Name],

Confirmed — I spoke with Maria. She can do any of the following slots (all times ET):

Thu 1:00–1:45 PM

Thu 3:00–3:45 PM

Fri 12:30–1:15 PM

Once you confirm the founder's preference, I'll lock it in on Maria's side.

Best,
Daniel`,
          timestamp: new Date().toISOString(),
          sent: false,
          read: false,
          type: 'received',
        }
        addEmail(reply)
      } else if (composeType === 'assessment-followup') {
        const reply: Email = {
          id: (Date.now() + 1).toString(),
          threadId: 'assessment-followup',
          from: 'Daniel Kim <daniel.kim@endeavor.org>',
          to: '[Your Name]',
          subject: `Re: ${composeData.subject}`,
          body: `Hi [Your Name],

Thanks for following up. The mentor has completed their assessment. I've shared the feedback with the mentor and it should be available in Salesforce shortly.

Best,
Daniel`,
          timestamp: new Date().toISOString(),
          sent: false,
          read: false,
          type: 'received',
        }
        addEmail(reply)
      } else if (composeType === 'champion') {
        const reply: Email = {
          id: (Date.now() + 1).toString(),
          threadId: 'champion-followup',
          from: `${selectedChampion} <champion@endeavor.org>`,
          to: '[Your Name]',
          subject: `Re: ${composeData.subject}`,
          body: `Hi [Your Name],

Thanks for the summary. I'm available next week:

Mon 2:00–3:00 PM ET
Wed 10:00–11:00 AM ET
Thu 3:00–4:00 PM ET

Let me know which works best and I'll confirm with the founders.

Best,
${selectedChampion}`,
          timestamp: new Date().toISOString(),
          sent: false,
          read: false,
          type: 'received',
        }
        addEmail(reply)
      } else if (composeType === 'champion-email') {
        // Simulate champion reply with availability
        const championName = championPanelistId === 'sarah-nguyen' ? 'Sarah Nguyen' :
                            championPanelistId === 'karim-el-masry' ? 'Karim El-Masry' :
                            championPanelistId === 'lina-abou-raya' ? 'Lina Abou-Raya' :
                            championPanelistId === 'james-whitmore' ? 'James Whitmore' : 'Champion'
        
        const slots = ['Mon 2:00–3:00 PM ET', 'Wed 10:00–11:00 AM ET', 'Thu 3:00–4:00 PM ET']
        setChampionAvailabilityReceived(true, slots)
        
        const reply: Email = {
          id: (Date.now() + 1).toString(),
          threadId: 'champion-followup',
          from: `${championName} <${championName.toLowerCase().replace(' ', '.')}@example.com>`,
          to: '[Your Name]',
          subject: `Re: ${composeData.subject}`,
          body: `Hi [Your Name],

Thanks for the summary. I'm happy to do a follow-up call.

Here are a few times that work for me (ET):

${slots.join('\n')}

Let me know which works best for the founders.

Best,
${championName}`,
          timestamp: new Date().toISOString(),
          sent: false,
          read: false,
          type: 'received',
        }
        addEmail(reply)
      } else if (composeType === 'forward-availability') {
        // Simulate founder reply with slot selection
        // Note: founderConfirmedChampionSlot is already set above when sending the email
        const selectedSlot = championAvailabilitySlots[0] // Default to first slot
        
        const reply: Email = {
          id: (Date.now() + 1).toString(),
          threadId: 'champion-availability',
          from: 'Omar Hassan <omar.hassan@techflow.com>',
          to: '[Your Name]',
          subject: `Re: ${composeData.subject}`,
          body: `Hi [Your Name],

Thanks for coordinating. ${selectedSlot} works best for me.

Best,
Omar`,
          timestamp: new Date().toISOString(),
          sent: false,
          read: false,
          type: 'received',
        }
        addEmail(reply)
      } else if (composeType === 'congrats') {
        // No reply needed for congrats email
      } else if (composeType === 'founder' || !composeType) {
        // Default: founder reply for SOR scheduling
        const reply: Email = {
          id: (Date.now() + 1).toString(),
          threadId: 'sor-scheduling',
          from: 'Omar Hassan <omar.hassan@techflow.com>',
          to: '[Your Name]',
          subject: `Re: ${composeData.subject}`,
          body: `Hi [Your Name],

Thanks — Thu 3:00–3:45 PM ET works for me.

Best,
Omar`,
          timestamp: new Date().toISOString(),
          sent: false,
          read: false,
          type: 'received',
        }
        addEmail(reply)
      }
    }, 2000)
  }

  if (composing) {
    // Show guidance banner for congrats email
    const showCongratsBanner = composeType === 'congrats'
    
    return (
      <div className="app-container">
        {bannerMessage && <Banner message={bannerMessage} />}
        {showCongratsBanner && (
          <Banner message="Do not attribute feedback or votes to specific panelists." />
        )}
        <div className="app-content">
          <div className="email-composer">
            <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Compose Email</h2>
              <button onClick={() => {
                setComposing(false)
                setComposeData({ to: '', subject: '', body: '' })
              }}>
                Cancel
              </button>
            </div>

            <div className="composer-field">
              <label>To</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={composeData.to}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.toLowerCase().includes('maria rodriguez')) {
                      // Show disabled state
                    }
                    setComposeData({ ...composeData, to: value })
                  }}
                />
                {composeType === 'am' && (
                  <div className="mentor-hint">
                    <span className="mentor-hint-disabled">Maria Rodriguez</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', cursor: 'help' }} title="Mentor coordination is handled via the Account Manager.">
                      ⓘ Mentor coordination is handled via the Account Manager.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="composer-field">
              <label>Subject</label>
              <input
                type="text"
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              />
            </div>

            <div className="composer-field">
              <label>Body</label>
              <textarea
                value={composeData.body}
                onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
              />
            </div>

            <div className="composer-actions">
              <button className="primary" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      {bannerMessage && <Banner message={bannerMessage} />}
      {/* Only show SOR Guide in SOR context, not LSP/post-LSP context */}
      {currentSOR > 0 && !passedLSP && <SORGuide />}
      <div className="inbox-app">
        <div className="inbox-sidebar">
          <div className="inbox-header">
            <h2>Inbox</h2>
            <button className="compose-button" onClick={() => {
              // Show compose options
              const hasAMEmail = emails.some(e => e.threadId === 'sor-coordination')
              if (!hasAMEmail) {
                handleCompose('am')
              } else {
                const hasFounderEmail = emails.some(e => e.threadId === 'sor-scheduling')
                if (!hasFounderEmail) {
                  handleCompose('founder')
                } else {
                  // General compose
                  setComposing(true)
                  setComposeType(null)
                  setComposeData({ to: '', subject: '', body: '' })
                }
              }
            }}>
              Compose
            </button>
          </div>

          <div>
            {Object.entries(threads).map(([threadId, threadEmails]) => {
              const latestEmail = threadEmails[threadEmails.length - 1]
              const isUnread = threadEmails.some(e => !e.read && e.type === 'received')
              const isSelected = selectedThread === threadId

              return (
                <div
                  key={threadId}
                  className={`email-thread-item ${isUnread ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedThread(threadId)}
                >
                  <div className="email-thread-from">{latestEmail.from}</div>
                  <div className="email-thread-subject">{latestEmail.subject}</div>
                  <div className="email-preview">
                    {latestEmail.body.substring(0, 60)}...
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="email-viewer">
          {selectedEmails.length > 0 ? (
            <div>
              {selectedEmails.map((email, index) => (
                <div key={email.id} style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div className="email-viewer-header">
                    <div className="email-viewer-subject">{email.subject}</div>
                    <div className="email-viewer-meta">
                      <span><strong>From:</strong> {email.from}</span>
                      <span><strong>To:</strong> {email.to}</span>
                      <span>{new Date(email.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="email-viewer-body">{email.body}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--endeavor-gray-dark)' }}>
              <p>Select an email thread to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

