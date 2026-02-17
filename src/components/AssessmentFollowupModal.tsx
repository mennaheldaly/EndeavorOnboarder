import './AssessmentFollowupModal.css'

interface AssessmentFollowupModalProps {
  onClose: () => void
  onCompose: () => void
  sorNumber: number
}

export function AssessmentFollowupModal({ onClose, onCompose, sorNumber }: AssessmentFollowupModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Follow Up with Account Manager</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>
            Email the Account Manager to follow up on the mentor assessment for SOR #{sorNumber}.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--endeavor-gray-dark)' }}>
            The assessment is still pending. Once the Account Manager confirms the mentor has completed 
            their assessment, it will be marked as complete in Salesforce.
          </p>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={onCompose}>
            Compose Email
          </button>
        </div>
      </div>
    </div>
  )
}

