import { useEffect } from 'react'
import { useAppState, AppType } from '../state/AppState'
import './AppSwitcher.css'

export function AppSwitcher() {
  const { currentApp, setCurrentApp } = useAppState()

  const apps: Array<{ id: AppType; name: string; icon: string }> = [
    { id: 'overview', name: 'Case Overview', icon: '📋' },
    { id: 'inbox', name: 'Inbox', icon: '✉️' },
    { id: 'calendar', name: 'Calendar', icon: '📅' },
    { id: 'salesforce', name: 'Salesforce', icon: '💼' },
  ]

  const handleTabClick = (appId: AppType) => {
    console.log('[AppSwitcher] Tab clicked:', appId, 'Current app:', currentApp)
    setCurrentApp(appId)
  }

  useEffect(() => {
    console.log('[AppSwitcher] Active tab changed to:', currentApp)
  }, [currentApp])

  return (
    <div className="app-switcher">
      <div className="app-switcher-container">
        {apps.map((app) => (
          <button
            key={app.id}
            className={`app-tab ${currentApp === app.id ? 'active' : ''}`}
            onClick={() => handleTabClick(app.id)}
          >
            <span className="app-icon">{app.icon}</span>
            <span className="app-name">{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

