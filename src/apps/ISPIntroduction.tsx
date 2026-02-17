import { useAppState } from '../state/AppState'
import { JourneyInfoStep } from '../components/JourneyInfoStep'
import './Apps.css'

interface ISPIntroductionProps {
  onNext: () => void
}

export function ISPIntroduction({ onNext }: ISPIntroductionProps) {
  const { setISPIntroductionShown } = useAppState()

  const handleNext = () => {
    setISPIntroductionShown(true)
    onNext()
  }

  return (
    <JourneyInfoStep
      title="International Selection Panel (ISP)"
      stepIndex={5}
      totalSteps={5}
      summary="The International Selection Panel is the final step in the Endeavor selection process."
      bullets={[
        "Follows a similar format to the Local Selection Panel but is conducted with global Endeavor mentors and board members",
        "During this panel, founders participate in a series of one-on-one interviews",
        "If the founders receive unanimous \"yes\" votes, they are selected as Endeavor Entrepreneurs",
        "This is a lifelong affiliation—any future ventures they launch are automatically eligible to be supported by Endeavor"
      ]}
      icon="panel"
      onNext={handleNext}
    />
  )
}
