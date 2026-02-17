import { useState } from 'react'
import { useAppState } from '../state/AppState'
import './Apps.css'

interface LSPProsConsProps {
  onComplete: () => void
}

export function LSPProsCons({ onComplete }: LSPProsConsProps) {
  const { notes, updateLSPPros, updateLSPCons } = useAppState()
  const [pros, setPros] = useState<string[]>([''])
  const [cons, setCons] = useState<string[]>([''])

  // Get LSP notes (panels + deliberations)
  const panel1Notes = notes.find(n => n.meetingId === 'lsp-panel-1')
  const panel2Notes = notes.find(n => n.meetingId === 'lsp-panel-2')
  const panel3Notes = notes.find(n => n.meetingId === 'lsp-panel-3')
  const deliberationsNotes = notes.find(n => n.meetingId === 'lsp-deliberations')

  const handleAddPro = () => {
    setPros([...pros, ''])
  }

  const handleAddCon = () => {
    setCons([...cons, ''])
  }

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros]
    newPros[index] = value
    setPros(newPros)
  }

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons]
    newCons[index] = value
    setCons(newCons)
  }

  const handleEmailChampion = () => {
    const validPros = pros.filter(p => p.trim())
    const validCons = cons.filter(c => c.trim())
    
    if (validPros.length === 0 || validCons.length === 0) {
      alert('Please add at least one item to both Pros and Cons')
      return
    }

    updateLSPPros(validPros)
    updateLSPCons(validCons)
    onComplete()
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 style={{ marginBottom: '1rem' }}>LSP Notes Summary</h1>
        
        <div style={{
          padding: '2rem',
          background: 'var(--endeavor-gray-light)',
          borderRadius: '4px',
          marginBottom: '2rem',
          maxWidth: '900px',
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Synthesize LSP Notes</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {panel1Notes && (
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Panel #1 Notes</h3>
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--endeavor-white)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                }}>
                  {panel1Notes.content}
                </div>
              </div>
            )}
            
            {panel2Notes && (
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Panel #2 Notes</h3>
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--endeavor-white)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                }}>
                  {panel2Notes.content}
                </div>
              </div>
            )}
            
            {panel3Notes && (
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Panel #3 Notes</h3>
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--endeavor-white)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                }}>
                  {panel3Notes.content}
                </div>
              </div>
            )}
            
            {deliberationsNotes && (
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Deliberations Notes</h3>
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--endeavor-white)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  maxHeight: '100px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                }}>
                  {deliberationsNotes.content}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', maxWidth: '1000px' }}>
          {/* Pros */}
          <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--endeavor-teal)' }}>Pros</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pros.map((pro, index) => (
                <input
                  key={index}
                  type="text"
                  value={pro}
                  onChange={(e) => handleProChange(index, e.target.value)}
                  placeholder={`Pro ${index + 1}`}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--endeavor-gray)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                  }}
                />
              ))}
              <button 
                onClick={handleAddPro}
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: '1px dashed var(--endeavor-gray)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: 'var(--endeavor-gray-dark)',
                }}
              >
                + Add Pro
              </button>
            </div>
          </div>

          {/* Cons */}
          <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--endeavor-yellow)' }}>Cons / Areas to Watch</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cons.map((con, index) => (
                <input
                  key={index}
                  type="text"
                  value={con}
                  onChange={(e) => handleConChange(index, e.target.value)}
                  placeholder={`Con ${index + 1}`}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--endeavor-gray)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                  }}
                />
              ))}
              <button 
                onClick={handleAddCon}
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: '1px dashed var(--endeavor-gray)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: 'var(--endeavor-gray-dark)',
                }}
              >
                + Add Con
              </button>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <button 
            className="primary" 
            onClick={handleEmailChampion}
            style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
          >
            Email Champion
          </button>
        </div>
      </div>
    </div>
  )
}

