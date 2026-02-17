import { useState } from 'react'
import { useAppState } from '../state/AppState'
import './Chapter.css'

interface Chapter5Props {
  onComplete: () => void
}

export function Chapter5({ onComplete }: Chapter5Props) {
  const { addLog, meetings, notes, completeSOR } = useAppState()
  const [formData, setFormData] = useState({
    meetingType: 'SOR',
    attendees: 'Maria Rodriguez, Omar Hassan',
    notes: '',
    nextSteps: '',
  })
  const [saved, setSaved] = useState(false)

  const meeting = meetings[meetings.length - 1]
  const meetingNotes = notes.filter(n => n.meetingId === meeting?.id)

  const handleSave = () => {
    if (!formData.notes.trim() || !formData.nextSteps.trim()) {
      alert('Please fill in all required fields')
      return
    }

    const log = {
      id: Date.now().toString(),
      meetingId: meeting?.id || '1',
      meetingType: formData.meetingType,
      attendees: formData.attendees.split(',').map(s => s.trim()),
      notes: formData.notes + (formData.nextSteps ? `\n\nNext Steps: ${formData.nextSteps}` : ''),
      date: new Date().toISOString(),
      saved: true,
    }

    addLog(log)
    completeSOR(1)
    setSaved(true)

    setTimeout(() => {
      onComplete()
    }, 2000)
  }

  if (saved) {
    return (
      <div className="chapter section-large">
        <div className="container">
          <h1>SOR 1 Complete</h1>
          <p style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>
            Meeting logged successfully. The first Selection of Review is now complete.
          </p>
          <div style={{ 
            padding: '2rem', 
            background: 'var(--endeavor-gray-light)', 
            borderRadius: '4px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</p>
            <p><strong>Meeting Type:</strong> {formData.meetingType}</p>
            <p><strong>Attendees:</strong> {formData.attendees}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chapter section-large">
      <div className="container">
        <h1>Log Meeting</h1>
        <p style={{ marginBottom: '2rem', maxWidth: '700px' }}>
          Complete the Salesforce entry for the SOR meeting. All fields marked with * are required.
        </p>

        <div className="salesforce-form">
          <div className="form-field required">
            <label>Meeting Type</label>
            <select
              value={formData.meetingType}
              onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
            >
              <option value="SOR">SOR (Selection of Review)</option>
              <option value="LSP">LSP (Local Selection Panel)</option>
              <option value="ISP">ISP (International Selection Panel)</option>
            </select>
          </div>

          <div className="form-field required">
            <label>Attendees</label>
            <input
              type="text"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              placeholder="Name 1, Name 2, Name 3"
            />
          </div>

          <div className="form-field required">
            <label>Meeting Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Summarize key discussion points, insights, and outcomes from the meeting..."
            />
            {meetingNotes.length > 0 && (
              <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)', marginTop: '0.5rem' }}>
                You took {meetingNotes.length} note(s) during the meeting. Reference them as needed.
              </p>
            )}
          </div>

          <div className="form-field required">
            <label>Next Steps</label>
            <textarea
              value={formData.nextSteps}
              onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
              placeholder="List action items, follow-ups, or commitments made during the meeting..."
            />
          </div>

          <div className="form-actions">
            <button className="primary" onClick={handleSave}>
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

