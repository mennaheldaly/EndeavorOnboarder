import { useState } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'

interface ChampionSelectionProps {
  onComplete: () => void
}

export function ChampionSelection({ onComplete }: ChampionSelectionProps) {
  const { setChampionPanelistId, championPanelistId, setChampion } = useAppState()
  const [selectedChampion, setSelectedChampion] = useState<string | null>(championPanelistId)

  // All 6 panelists
  const allPanelists = [
    { id: 'sarah-nguyen', name: 'Sarah Nguyen', role: 'FinTech CEO, Mexico', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces' },
    { id: 'karim-el-masry', name: 'Karim El-Masry', role: 'Venture Capital Partner', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces' },
    { id: 'lina-abou-raya', name: 'Lina Abou-Raya', role: 'Private Equity Investor', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces' },
    { id: 'james-whitmore', name: 'James Whitmore', role: 'PropTech CTO', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces' },
    { id: 'maria-santos', name: 'Maria Santos', role: 'Serial Tech Founder', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces' },
    { id: 'david-chen', name: 'David Chen', role: 'Enterprise SaaS Founder', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=faces' },
  ]

  const handleConfirm = () => {
    if (!selectedChampion) {
      alert('Please select a Champion')
      return
    }
    setChampionPanelistId(selectedChampion)
    setChampion(selectedChampion) // Keep for backward compatibility
    onComplete()
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1>Champion Selection</h1>
        </div>

        <div style={{
          padding: 'var(--spacing-lg)',
          background: 'var(--endeavor-gray-light)',
          borderRadius: '4px',
          marginBottom: 'var(--spacing-xl)',
          maxWidth: '800px',
          margin: '0 auto var(--spacing-xl)'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--endeavor-gray-dark)',
            margin: 0,
            textAlign: 'center'
          }}>
            Select a Champion panelist to conduct a 15–30 minute follow-up with the founders.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {allPanelists.map((panelist) => (
            <div
              key={panelist.id}
              className={`person-card ${selectedChampion === panelist.id ? 'selected' : ''}`}
              style={{
                cursor: 'pointer',
                border: selectedChampion === panelist.id ? '3px solid var(--endeavor-teal)' : '2px solid var(--endeavor-gray)',
                transition: 'var(--transition-smooth)',
              }}
              onClick={() => setSelectedChampion(panelist.id)}
            >
              <img src={panelist.photo} alt={panelist.name} className="circular-photo" style={{ width: '120px', height: '120px' }} />
              <h3 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{panelist.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--endeavor-gray-dark)' }}>{panelist.role}</p>
              {selectedChampion === panelist.id && (
                <p style={{ marginTop: '1rem', color: 'var(--endeavor-teal)', fontWeight: 600 }}>Selected as Champion</p>
              )}
            </div>
          ))}
        </div>

        <div className="cta-section">
          <button 
            className="primary" 
            onClick={handleConfirm}
            disabled={!selectedChampion}
            style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
          >
            Confirm Champion
          </button>
        </div>
      </div>
    </div>
  )
}

