import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import { Banner } from '../components/Banner'
import { SORGuide } from '../components/SORGuide'
import { AssessmentFollowupModal } from '../components/AssessmentFollowupModal'
import './Apps.css'

export function Salesforce() {
  const { 
    meetings, 
    logs, 
    addLog, 
    currentSOR,
    assessments,
    addAssessment,
    completeSOR,
    setCurrentApp,
    completedSORs,
    notes,
    followupScheduled,
    setFollowupLoggedInSalesforce,
  } = useAppState()
  
  const [activeTab, setActiveTab] = useState<'details' | 'related' | 'contacts'>('details')
  const [logData, setLogData] = useState({
    meetingType: 'SOR',
    date: '',
    attendees: '',
    notes: '',
  })
  const [showLogForm, setShowLogForm] = useState(false)
  const [showFollowupModal, setShowFollowupModal] = useState(false)

  // Find current meeting - either SOR meeting or champion follow-up
  const currentSORMeeting = meetings.find(m => m.sorNumber === currentSOR && m.confirmed)
  const championFollowupMeeting = meetings.find(m => m.type === 'LSP' && m.title.includes('Champion'))
  const currentMeeting = currentSORMeeting || championFollowupMeeting
  const currentLog = currentMeeting ? logs.find(l => l.meetingId === currentMeeting.id) : null

  // Auto-show log form for champion follow-up if scheduled but not logged
  useEffect(() => {
    if (followupScheduled && championFollowupMeeting && !currentLog && !showLogForm) {
      setShowLogForm(true)
      setLogData({
        meetingType: 'Champion Follow-up',
        date: championFollowupMeeting.date ? `${championFollowupMeeting.date} ${championFollowupMeeting.time}` : '',
        attendees: championFollowupMeeting.attendees.join(', '),
        notes: '',
      })
    }
  }, [followupScheduled, championFollowupMeeting, currentLog, showLogForm])
  // Find meeting notes for the current meeting
  const meetingNotes = currentMeeting ? notes.find(n => n.meetingId === currentMeeting.id) : null
  // Find assessment for current SOR, or if no current SOR, find the most recent completed assessment
  const currentAssessment = currentSOR > 0 
    ? assessments.find(a => a.sorNumber === currentSOR)
    : assessments
        .filter(a => a.status === 'completed')
        .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))[0] || null

  const getBannerMessage = () => {
    if (currentLog && currentAssessment?.status === 'pending') {
      return 'Follow up with Account Manager for mentor assessment.'
    }
    return null
  }

  const bannerMessage = getBannerMessage()

  const handleSaveLog = () => {
    // Use logData if filled, otherwise use auto-filled values from currentMeeting
    const date = logData.date || (currentMeeting ? `${currentMeeting.date} ${currentMeeting.time}` : '')
    const attendees = logData.attendees || (currentMeeting ? currentMeeting.attendees.join(', ') : '')
    const notes = logData.notes || ''
    
    if (!date || !attendees) {
      alert('Please fill in date and attendees')
      return
    }

    if (!currentMeeting) {
      alert('No meeting found to log')
      return
    }

    const isChampionFollowup = currentMeeting.type === 'LSP' && currentMeeting.title.includes('Champion')
    const meetingType = isChampionFollowup ? 'Champion Follow-up' : logData.meetingType

    const log = {
      id: Date.now().toString(),
      meetingId: currentMeeting.id,
      meetingType: meetingType,
      date: date,
      attendees: attendees.split(',').map(s => s.trim()),
      notes: notes,
      saved: true,
    }

    addLog(log)
    setShowLogForm(false)
    setLogData({ meetingType: 'SOR', date: '', attendees: '', notes: '' })
    
    // If champion follow-up, mark as logged
    if (isChampionFollowup) {
      setFollowupLoggedInSalesforce(true)
    }
    
    // Mark SOR as complete if assessment is also complete
    if (currentAssessment?.status === 'completed' && !isChampionFollowup) {
      completeSOR(currentSOR)
    }
  }

  const handleRequestAssessment = () => {
    setShowFollowupModal(true)
  }

  const handleComposeFollowup = () => {
    setShowFollowupModal(false)
    // Set flag to pre-fill email in Inbox
    localStorage.setItem('assessmentFollowup', JSON.stringify({
      sorNumber: currentSOR,
      timestamp: Date.now(),
    }))
    // Switch to Inbox
    setCurrentApp('inbox')
  }

  const contacts = [
    {
      name: 'Omar Hassan',
      role: 'Founder & CEO, TechFlow Solutions',
      email: 'Omar.mendoza@techflow.com',
      phone: '+52 55 1234 5678',
      company: 'TechFlow Solutions',
      type: 'Founder',
    },
    {
      name: 'Maria Rodriguez',
      role: 'Mentor - FinTech Scaling Expert',
      email: 'maria.rodriguez@endeavor.org',
      phone: '+1 212 555 0100',
      company: 'Endeavor Entrepreneur',
      type: 'Mentor',
    },
    {
      name: 'Daniel Kim',
      role: 'Account Manager',
      email: 'daniel.kim@endeavor.org',
      phone: '+1 212 555 0101',
      company: 'Endeavor',
      type: 'Account Manager',
    },
  ]

  return (
    <div className="app-container">
      {bannerMessage && <Banner message={bannerMessage} />}
      {currentSOR > 0 && <SORGuide />}
      {showFollowupModal && (
        <AssessmentFollowupModal
          onClose={() => setShowFollowupModal(false)}
          onCompose={handleComposeFollowup}
          sorNumber={currentSOR}
        />
      )}
      <div className="salesforce-app">
        <div className="salesforce-tabs">
          <button
            className={`salesforce-tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`salesforce-tab ${activeTab === 'related' ? 'active' : ''}`}
            onClick={() => setActiveTab('related')}
          >
            Related
          </button>
          <button
            className={`salesforce-tab ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </button>
        </div>

        <div className="salesforce-content">
          {activeTab === 'contacts' && (
            <div>
              <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Contact Information</h2>
              <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--endeavor-gray-dark)' }}>
                All contact details for founders, mentors, and account managers are available here.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'var(--endeavor-gray-light)',
                      borderRadius: '4px',
                      border: '1px solid var(--endeavor-gray)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--endeavor-white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: '2px solid var(--endeavor-teal)',
                      }}>
                        👤
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{contact.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)', marginBottom: '0.25rem' }}>
                          {contact.role}
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--endeavor-gray-dark)', fontStyle: 'italic' }}>
                          {contact.company}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: contact.type === 'Founder' ? 'var(--endeavor-teal)' : 
                                    contact.type === 'Mentor' ? 'var(--endeavor-yellow)' : 'var(--endeavor-gray)',
                        color: contact.type === 'Founder' ? 'var(--endeavor-white)' : 'var(--endeavor-black)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}>
                        {contact.type}
                      </div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-sm)', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--endeavor-gray)' }}>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <strong>Email:</strong> <a href={`mailto:${contact.email}`} style={{ color: 'var(--endeavor-teal)' }}>{contact.email}</a>
                      </p>
                      <p style={{ fontSize: '0.875rem' }}>
                        <strong>Phone:</strong> {contact.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="salesforce-form">
              <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Log Meeting</h2>
              
              {currentLog ? (
                <div>
                  <div style={{ 
                    padding: 'var(--spacing-md)', 
                    background: 'var(--endeavor-gray-light)', 
                    borderRadius: '4px',
                    marginBottom: 'var(--spacing-md)'
                  }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Meeting Logged</p>
                    <p><strong>Type:</strong> {currentLog.meetingType}</p>
                    <p><strong>Date:</strong> {currentLog.date}</p>
                    <p><strong>Attendees:</strong> {currentLog.attendees.join(', ')}</p>
                    <p><strong>Notes:</strong> {currentLog.notes}</p>
                  </div>
                  <button onClick={() => setShowLogForm(true)}>Edit Log</button>
                </div>
              ) : (
                <div>
                  {showLogForm ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                      <div>
                        <div className="salesforce-field required">
                          <label>Meeting Type</label>
                          <select
                            value={logData.meetingType}
                            onChange={(e) => setLogData({ ...logData, meetingType: e.target.value })}
                          >
                            <option value="SOR">SOR (Second Opinion Review)</option>
                            <option value="LSP">LSP (Local Selection Panel)</option>
                            <option value="Champion Follow-up">Champion Follow-up</option>
                            <option value="ISP">ISP (International Selection Panel)</option>
                          </select>
                        </div>

                        <div className="salesforce-field required">
                          <label>Date</label>
                          <input
                            type="text"
                            value={logData.date || (currentMeeting ? `${currentMeeting.date} ${currentMeeting.time}` : '')}
                            onChange={(e) => setLogData({ ...logData, date: e.target.value })}
                          />
                        </div>

                        <div className="salesforce-field required">
                          <label>Attendees</label>
                          <input
                            type="text"
                            value={logData.attendees || (currentMeeting ? currentMeeting.attendees.join(', ') : '')}
                            onChange={(e) => setLogData({ ...logData, attendees: e.target.value })}
                            placeholder="Name 1, Name 2, Name 3"
                          />
                        </div>

                        <div className="salesforce-field">
                          <label>Notes</label>
                          <textarea
                            value={logData.notes}
                            onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
                            placeholder="Summarize key discussion points, insights, and outcomes..."
                            style={{ minHeight: '200px' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                          <button onClick={() => setShowLogForm(false)}>Cancel</button>
                          <button className="primary" onClick={handleSaveLog}>
                            Save
                          </button>
                        </div>
                      </div>

                      {meetingNotes && (
                        <div style={{
                          padding: 'var(--spacing-md)',
                          background: 'var(--endeavor-gray-light)',
                          borderRadius: '4px',
                          border: '1px solid var(--endeavor-gray)',
                          height: 'fit-content',
                          position: 'sticky',
                          top: 'var(--spacing-md)',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                            <h3 style={{ fontSize: '1rem', margin: 0 }}>Meeting Notes</h3>
                            <button
                              onClick={() => {
                                setLogData({ ...logData, notes: meetingNotes.content })
                              }}
                              style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                background: 'var(--endeavor-teal)',
                                color: 'var(--endeavor-white)',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Copy to Notes
                            </button>
                          </div>
                          <div style={{
                            padding: 'var(--spacing-sm)',
                            background: 'var(--endeavor-white)',
                            borderRadius: '4px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            color: 'var(--endeavor-gray-dark)',
                          }}>
                            {meetingNotes.content}
                          </div>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--endeavor-gray-dark)', 
                            marginTop: 'var(--spacing-sm)',
                            fontStyle: 'italic'
                          }}>
                            Notes taken during the meeting. Click "Copy to Notes" to paste into the Notes field.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      className="primary" 
                      onClick={() => {
                        // Pre-fill form data when opening
                        if (currentMeeting) {
                          setLogData({
                            meetingType: 'SOR',
                            date: `${currentMeeting.date} ${currentMeeting.time}`,
                            attendees: currentMeeting.attendees.join(', '),
                            notes: meetingNotes?.content || '',
                          })
                        }
                        setShowLogForm(true)
                      }}
                    >
                      Log Meeting
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'related' && (
            <div style={{ minHeight: '200px' }}>
              <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Assessments</h2>
              
              {(() => {
                try {
                  // If we have a completed assessment, show it even if currentSOR is 0
                  if (currentAssessment && currentAssessment.status === 'completed') {
                    // Show the completed assessment
                  } else if (currentSOR === 0 && !currentAssessment) {
                    return (
                      <p style={{ color: 'var(--endeavor-gray-dark)' }}>
                        No SOR in progress. Start an SOR from the Case Overview to view assessments.
                      </p>
                    )
                  }
                  
                  if (!currentAssessment) {
                    return (
                      <p style={{ color: 'var(--endeavor-gray-dark)' }}>
                        {currentSOR > 0 
                          ? `No assessment available for SOR #${currentSOR}. Assessment will be created when the SOR starts.`
                          : 'No assessment available.'}
                      </p>
                    )
                  }

                  return (
                    <div className="assessment-section">
                      <div className={`assessment-status ${currentAssessment.status || 'pending'}`}>
                        <span>{currentAssessment.status === 'pending' ? '⏳' : '✓'}</span>
                        <span><strong>Status:</strong> {currentAssessment.status === 'pending' ? 'Pending' : 'Completed'}</span>
                      </div>

                      {currentAssessment.status === 'pending' && (
                        <div>
                          <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>
                            Mentor assessment not yet completed.
                          </p>
                          <button 
                            style={{ marginTop: 'var(--spacing-sm)' }}
                            onClick={handleRequestAssessment}
                          >
                            Follow up with Account Manager
                          </button>
                        </div>
                      )}

                      {currentAssessment.status === 'completed' && currentAssessment.ratings && (
                        <div style={{ marginTop: 'var(--spacing-md)' }}>
                          <p><strong>Readiness:</strong> {currentAssessment.ratings.readiness || 0}/10</p>
                          <p><strong>Potential:</strong> {currentAssessment.ratings.potential || 0}/10</p>
                          <p><strong>Fit:</strong> {currentAssessment.ratings.fit || 0}/10</p>
                          {currentAssessment.feedback && (
                            <div style={{ marginTop: 'var(--spacing-sm)' }}>
                              <p><strong>Feedback:</strong></p>
                              <p>{currentAssessment.feedback}</p>
                            </div>
                          )}
                          
                          {/* Show Continue button as soon as ratings appear */}
                          <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-md)', borderTop: '2px solid var(--endeavor-teal)' }}>
                            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>
                              Assessment completed. Ready to proceed to LSP.
                            </p>
                            <button 
                              className="primary" 
                              onClick={() => {
                                // Trigger SOR transition
                                window.dispatchEvent(new CustomEvent('sor-transition'))
                                setCurrentApp('overview')
                              }}
                              style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                } catch (error) {
                  console.error('Error rendering assessment:', error)
                  return (
                    <p style={{ color: 'var(--endeavor-gray-dark)' }}>
                      Error loading assessment. Please try again.
                    </p>
                  )
                }
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
