import './JourneyInfoStep.css'

interface JourneyInfoStepProps {
  title: string
  stepIndex: number
  totalSteps: number
  summary: string
  bullets: string[]
  actions?: string[]
  icon: 'calendar' | 'globe' | 'doc' | 'call' | 'panel'
  onNext: () => void
  onBack?: () => void
}

const iconMap = {
  calendar: '📅',
  globe: '🌐',
  doc: '📄',
  call: '📞',
  panel: '👥'
}

const stepLabels = [
  'Champion Follow-Up',
  'Global Review Session',
  'Profile Editor Pairing',
  'Global Review Call',
  'ISP'
]

export function JourneyInfoStep({
  title,
  stepIndex,
  totalSteps,
  summary,
  bullets,
  actions,
  icon,
  onNext,
  onBack
}: JourneyInfoStepProps) {
  return (
    <div className="app-container">
      <div className="journey-info-step">
        {/* Journey Step Header */}
        <div className="journey-header">
          <div className="journey-header-top">
            <span className="journey-stage">Stage: Post-LSP → ISP</span>
            <span className="journey-step-indicator">Step {stepIndex} of {totalSteps}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="journey-progress-container">
            {stepLabels.map((label, index) => {
              const stepNum = index + 1
              const isActive = stepNum === stepIndex
              const isCompleted = stepNum < stepIndex
              const showLine = index < totalSteps - 1
              
              return (
                <div
                  key={stepNum}
                  className={`journey-progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  style={{ width: `${100 / totalSteps}%` }}
                >
                  {showLine && (
                    <div className={`journey-progress-line ${isCompleted ? 'completed' : ''}`} />
                  )}
                  <div className="journey-progress-dot" />
                  <span className="journey-progress-label">{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="journey-content-card">
          <div className="journey-card-header">
            <div className="journey-icon-badge">
              {iconMap[icon]}
            </div>
            <h2 className="journey-title">{title}</h2>
          </div>

          <div className="journey-card-body">
            {/* Summary */}
            <p className="journey-summary">{summary}</p>

            {/* Bullet Points */}
            <ul className="journey-bullets">
              {bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>

            {/* Actions (optional) */}
            {actions && actions.length > 0 && (
              <div className="journey-actions">
                <h3 className="journey-actions-title">What you do:</h3>
                <ul className="journey-actions-list">
                  {actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="journey-footer">
            {onBack && (
              <button
                className="journey-button secondary"
                onClick={onBack}
              >
                Back
              </button>
            )}
            <button
              className="journey-button primary"
              onClick={onNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
