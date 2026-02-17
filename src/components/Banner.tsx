import './AppSwitcher.css'

interface BannerProps {
  message: string | { message: string; action?: string; onAction?: () => void }
  type?: 'info' | 'success' | 'warning'
  onDismiss?: () => void
}

export function Banner({ message, type = 'warning', onDismiss }: BannerProps) {
  if (!message) return null

  const messageText = typeof message === 'string' ? message : message.message
  const actionText = typeof message === 'object' ? message.action : undefined
  const onAction = typeof message === 'object' ? message.onAction : undefined

  return (
    <div className={`app-banner ${type}`}>
      <span>{messageText}</span>
      {onAction && actionText && (
        <button
          onClick={onAction}
          className="primary"
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {actionText}
        </button>
      )}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            marginLeft: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: '1.25rem',
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

