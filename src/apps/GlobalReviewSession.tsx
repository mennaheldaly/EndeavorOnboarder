import { useAppState } from '../state/AppState'
import { JourneyInfoStep } from '../components/JourneyInfoStep'
import './Apps.css'

interface GlobalReviewSessionProps {
  onNext: () => void
}

export function GlobalReviewSession({ onNext }: GlobalReviewSessionProps) {
  const { setGlobalReviewShown } = useAppState()

  const handleNext = () => {
    setGlobalReviewShown(true)
    onNext()
  }

  return (
    <JourneyInfoStep
      title="Global Review Session"
      stepIndex={2}
      totalSteps={5}
      summary="Following the Local Selection Panel, you will participate in a Global Review Session with an experienced Endeavor Entrepreneur or global mentor."
      bullets={[
        "Similar to previous mentor meetings, you are expected to proactively reach out, schedule the session, and prepare accordingly",
        "The format is similar to a Strategic Operator Review (SOR): you will present your company and answer in-depth questions about your business, strategy, and growth plans",
        "The session concludes with dedicated feedback, where the mentor shares specific guidance on how to strengthen your pitch, refine your messaging, and respond effectively to questions",
        "This preparation is specifically for the International Selection Panel"
      ]}
      actions={[
        "Proactively reach out to the mentor",
        "Schedule the session"
      ]}
      icon="globe"
      onNext={handleNext}
    />
  )
}
