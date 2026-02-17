import { useAppState } from '../state/AppState'
import { JourneyInfoStep } from '../components/JourneyInfoStep'
import './Apps.css'

interface GlobalReviewWithTeamProps {
  onNext: () => void
}

export function GlobalReviewWithTeam({ onNext }: GlobalReviewWithTeamProps) {
  const { setGlobalReviewWithTeamShown } = useAppState()

  const handleNext = () => {
    setGlobalReviewWithTeamShown(true)
    onNext()
  }

  return (
    <JourneyInfoStep
      title="Endeavor Global Review"
      stepIndex={4}
      totalSteps={5}
      summary="You will participate in a Global Review call with Linda, your Profile Editor, and Evan from Endeavor's global team."
      bullets={[
        "This session is designed to address any remaining questions",
        "Clarify key aspects of the business",
        "Ensure the profile fully reflects the company's trajectory, strengths, and readiness",
        "Final step before advancing to the International Selection Panel"
      ]}
      icon="call"
      onNext={handleNext}
    />
  )
}
