import { useAppState } from '../state/AppState'
import { JourneyInfoStep } from '../components/JourneyInfoStep'
import './Apps.css'

interface ProfileEditorPairingProps {
  onNext: () => void
}

export function ProfileEditorPairing({ onNext }: ProfileEditorPairingProps) {
  const { setProfileEditorPairingShown } = useAppState()

  const handleNext = () => {
    setProfileEditorPairingShown(true)
    onNext()
  }

  return (
    <JourneyInfoStep
      title="Profile Editor Pairing"
      stepIndex={3}
      totalSteps={5}
      summary="You will be paired with a global Profile Editor who will work closely with you to refine your company profile."
      bullets={[
        "Includes direct feedback and edits on the profile document",
        "Calls with the founders to ensure clarity and accuracy",
        "Ensures the story, metrics, and positioning are clear, accurate, and compelling",
        "Preparation is ahead of the International Selection Panel"
      ]}
      icon="doc"
      onNext={handleNext}
    />
  )
}
