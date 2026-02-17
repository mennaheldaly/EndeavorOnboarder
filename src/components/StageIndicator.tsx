import { useAppState } from '../state/AppState'
import './StageIndicator.css'

export function StageIndicator() {
  const { currentStage } = useAppState()

  const stages: Array<{ id: 'FOR' | 'SOR' | 'LSP' | 'ISP'; label: string }> = [
    { id: 'FOR', label: 'FOR' },
    { id: 'SOR', label: 'SOR' },
    { id: 'LSP', label: 'LSP' },
    { id: 'ISP', label: 'ISP' }
  ]

  return (
    <div className="stage-indicator">
      <div className="stage-indicator-container">
        {stages.map((stage, index) => (
          <div key={stage.id} className="stage-indicator-item">
            <div
              className={`stage-indicator-step ${
                currentStage === stage.id ? 'active' : ''
              } ${index < stages.findIndex(s => s.id === currentStage) ? 'completed' : ''}`}
            >
              <span className="stage-indicator-label">{stage.label}</span>
            </div>
            {index < stages.length - 1 && (
              <div
                className={`stage-indicator-connector ${
                  index < stages.findIndex(s => s.id === currentStage) ? 'completed' : ''
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
