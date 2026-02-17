import { ReactNode, useRef, useEffect } from 'react'

interface PanelWorkspaceLayoutProps {
  title: string
  subtitle?: string
  leftColumn: ReactNode
  centerColumn: {
    title: string
    infoLine?: string
    content: ReactNode
    actionButton?: ReactNode
  }
  rightColumn: {
    title: string
    content: ReactNode
  }
  transcriptScrollDeps?: any[] // Dependencies that should trigger auto-scroll
}

export function PanelWorkspaceLayout({
  title,
  subtitle,
  leftColumn,
  centerColumn,
  rightColumn,
  transcriptScrollDeps = []
}: PanelWorkspaceLayoutProps) {
  const transcriptScrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll transcript to bottom when new content appears
  useEffect(() => {
    const el = transcriptScrollRef.current
    if (!el) return

    // Only auto-scroll if user is already near bottom (within 100px)
    // This prevents overriding manual scrolling
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100

    if (isNearBottom) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, transcriptScrollDeps)

  return (
    <div className="app-container" style={{ 
      height: 'calc(100vh - 60px)', // Subtract header height
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="app-content" style={{ 
        padding: '1rem 1.5rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Compact Header */}
        <div style={{ 
          marginBottom: '1rem',
          flexShrink: 0
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            marginBottom: subtitle ? '0.25rem' : 0,
            color: '#111827'
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ 
              fontSize: '0.8125rem', 
              color: '#6b7280',
              margin: 0
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Fixed-Height 3-Column Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '22% 38% 35%',
          gap: '1rem',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* LEFT: Panelists (Fixed Height) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRight: '1px solid #e5e7eb',
            paddingRight: '1rem'
          }}>
            {leftColumn}
          </div>

          {/* CENTER: Transcript (Fixed Height with Internal Scroll) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              flexShrink: 0
            }}>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827'
                }}>
                  {centerColumn.title}
                </h3>
                {centerColumn.infoLine && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '4px',
                    marginTop: '0.375rem',
                    marginBottom: 0
                  }}>
                    {centerColumn.infoLine}
                  </p>
                )}
              </div>
              {centerColumn.actionButton && (
                <div>
                  {centerColumn.actionButton}
                </div>
              )}
            </div>

            {/* Scrollable Transcript Content */}
            <div 
              ref={transcriptScrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                minHeight: 0
              }}
            >
              {centerColumn.content}
            </div>
          </div>

          {/* RIGHT: Notes Panel (Fixed Height with Internal Scroll) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
            borderLeft: '1px solid #e5e7eb',
            paddingLeft: '1rem'
          }}>
            <h3 style={{ 
              marginBottom: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              flexShrink: 0
            }}>
              {rightColumn.title}
            </h3>
            {rightColumn.content}
          </div>
        </div>
      </div>
    </div>
  )
}
