import { useState } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'
import './ISP.css'

interface ISPProps {
  onComplete: () => void
}

export function ISP({ onComplete }: ISPProps) {
  const { setISPType } = useAppState()
  const [selectedType, setSelectedType] = useState<'virtual' | 'in-person' | null>(null)

  const handleSelectType = (type: 'virtual' | 'in-person') => {
    setSelectedType(type)
    setISPType(type)
  }

  const handleContinue = () => {
    if (selectedType) {
      onComplete()
    }
  }

  return (
    <div className="app-container">
      <div className="isp-selection-screen">
        {/* Stage Header */}
        <div className="isp-header">
          <div className="isp-header-top">
            <span className="isp-stage">Stage: ISP Setup</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="isp-content">
          <div className="isp-intro">
            <h1 className="isp-title">Sign Up for ISP</h1>
            <p className="isp-subtitle">
              Choose the ISP format that works best for the founders.
            </p>
          </div>

          {/* Selection Cards */}
          <div className="isp-cards-grid">
            {/* Virtual ISP Card */}
            <button
              type="button"
              className={`isp-option-card ${selectedType === 'virtual' ? 'selected' : ''}`}
              onClick={() => {
                console.log('ISP option selected:', 'virtual')
                handleSelectType('virtual')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  console.log('ISP option selected:', 'virtual')
                  handleSelectType('virtual')
                }
              }}
            >
              {selectedType === 'virtual' && (
                <div className="isp-check-icon">✓</div>
              )}
              <div className="isp-card-header">
                <div className="isp-icon-badge">💻</div>
                <h2 className="isp-card-title">Virtual ISP</h2>
              </div>
              <p className="isp-card-summary">
                Remote panel format with video conferencing. Flexible scheduling, no costs.
              </p>
              <ul className="isp-card-bullets">
                <li>Conduct panel sessions from anywhere</li>
                <li>No travel expenses or logistics</li>
                <li>Easier to schedule across time zones</li>
              </ul>
              <div className="isp-card-chips">
                <span className="isp-chip">Flexible scheduling</span>
                <span className="isp-chip">No travel</span>
                <span className="isp-chip">Zoom/Meet</span>
              </div>
            </button>

            {/* In-Person ISP Card */}
            <button
              type="button"
              className={`isp-option-card ${selectedType === 'in-person' ? 'selected' : ''}`}
              onClick={() => {
                console.log('ISP option selected:', 'in-person')
                handleSelectType('in-person')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  console.log('ISP option selected:', 'in-person')
                  handleSelectType('in-person')
                }
              }}
            >
              {selectedType === 'in-person' && (
                <div className="isp-check-icon">✓</div>
              )}
              <div className="isp-card-header">
                <div className="isp-icon-badge">🌍</div>
                <h2 className="isp-card-title">In-Person ISP</h2>
              </div>
              <p className="isp-card-summary">
                Traditional panel format with in-person attendance. Enhanced networking opportunities.
              </p>
              <ul className="isp-card-bullets">
                <li>Face-to-face interaction with panelists</li>
                <li>Enhanced networking and relationship building</li>
                <li>Immersive experience at Endeavor events</li>
              </ul>
              <div className="isp-card-chips">
                <span className="isp-chip">Networking</span>
                <span className="isp-chip">Travel required</span>
                <span className="isp-chip">Event day</span>
              </div>
            </button>
          </div>

          {/* Navigation Footer */}
          <div className="isp-footer">
            <button
              type="button"
              className="isp-button secondary"
              onClick={() => {
                // Back navigation - could go to previous step if needed
                // For now, just a placeholder
              }}
            >
              Back
            </button>
            <button
              type="button"
              className="isp-button primary"
              onClick={handleContinue}
              disabled={!selectedType}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

