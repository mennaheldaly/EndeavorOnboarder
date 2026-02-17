import { AppSwitcher } from './components/AppSwitcher'
import { FlowController } from './components/FlowController'
import { StageIndicator } from './components/StageIndicator'
import './App.css'

function App() {
  return (
    <div className="App">
      <AppSwitcher />
      <StageIndicator />
      <div style={{ paddingTop: '130px' }}> {/* Space for AppSwitcher (~57px) + StageIndicator (~73px) */}
        <FlowController />
      </div>
    </div>
  )
}

export default App
