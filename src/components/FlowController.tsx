import { useState, useEffect } from 'react'
import { useAppState } from '../state/AppState'
import { CaseOverview } from '../apps/CaseOverview'
import { Inbox } from '../apps/Inbox'
import { Calendar } from '../apps/Calendar'
import { Salesforce } from '../apps/Salesforce'
import { SORTransition } from '../apps/SORTransition'
import { LSPOverview } from '../apps/LSPOverview'
import { LSP } from '../apps/LSP'
import { Deliberations } from '../apps/Deliberations'
import { ChampionSelection } from '../apps/ChampionSelection'
import { PostLSPCommunication } from '../apps/PostLSPCommunication'
import { LSPProsCons } from '../apps/LSPProsCons'
import { LSPComplete } from '../apps/LSPComplete'
import { FoundersLeave } from '../apps/FoundersLeave'
import { FoundersLeaveTransition } from '../apps/FoundersLeaveTransition'
import { ISP } from '../apps/ISP'
import { GlobalReviewSession } from '../apps/GlobalReviewSession'
import { ISPSignup } from '../apps/ISPSignup'
import { ProfileEditorPairing } from '../apps/ProfileEditorPairing'
import { GlobalReviewWithTeam } from '../apps/GlobalReviewWithTeam'
import { ISPIntroduction } from '../apps/ISPIntroduction'
import { PostLSPNextSteps } from '../apps/PostLSPNextSteps'
import { SynthesizeNotes } from '../apps/SynthesizeNotes'
import { OnboardingComplete } from '../apps/OnboardingComplete'
import { Report } from '../apps/Report'

export function FlowController() {
  const { 
    currentApp, 
    currentStage,
    setCurrentStage,
    completedSORs, 
    currentLSPPanel,
    lspPanels,
    deliberationsComplete,
    deliberationsResult,
    selectedChampion,
    lspPros,
    lspCons,
    championFollowupScheduled,
    foundersLeft,
    outcomeEmailSent,
    congratsEmailSent,
    prosConsDrafted,
    championEmailSent,
    ispReady,
    ispType,
    followupLoggedInSalesforce,
    globalReviewShown,
    ispSignedUp,
    profileEditorPairingShown,
    globalReviewWithTeamShown,
    ispIntroductionShown,
    startLSP,
    completeDeliberations,
    updateChampionFollowupScheduled,
    setCurrentApp,
  } = useAppState()
  
  console.log('[FlowController] State:', {
    currentApp,
    congratsEmailSent,
    prosConsDrafted,
    outcomeEmailSent,
    selectedChampion,
    lspProsLength: lspPros.length
  })

  const [showSORTransition, setShowSORTransition] = useState(false)
  const [showLSPOverview, setShowLSPOverview] = useState(false)
  const [showPostLSPComm, setShowPostLSPComm] = useState(false)
  const [showProsCons, setShowProsCons] = useState(false)
  const [showPostLSPNextSteps, setShowPostLSPNextSteps] = useState(false)
  const [showSynthesizeNotes, setShowSynthesizeNotes] = useState(false)

  // Determine if we should show Post-LSP Next Steps
  // Show if champion is selected and not all steps are complete
  const shouldShowPostLSPNextSteps = deliberationsResult === 'unanimous-yes' && selectedChampion && 
    (!congratsEmailSent || !prosConsDrafted || !championEmailSent)

  // Auto-show Post-LSP Next Steps when champion is selected
  useEffect(() => {
    if (deliberationsResult === 'unanimous-yes' && selectedChampion && shouldShowPostLSPNextSteps) {
      setShowPostLSPNextSteps(true)
    }
  }, [deliberationsResult, selectedChampion, shouldShowPostLSPNextSteps])

  // Listen for SOR transition event
  useEffect(() => {
    const handleSORTransition = () => {
      setShowSORTransition(true)
    }
    window.addEventListener('sor-transition', handleSORTransition)
    return () => window.removeEventListener('sor-transition', handleSORTransition)
  }, [])

  // Listen for navigate to synthesize event
  useEffect(() => {
    const handleNavigateToSynthesize = () => {
      console.log('[FlowController] navigate-to-synthesize event received')
      const flag = localStorage.getItem('showSynthesizeNotes') === 'true'
      console.log('[FlowController] Flag check:', flag)
      if (flag) {
        console.log('[FlowController] Setting showSynthesizeNotes to true')
        setShowSynthesizeNotes(true)
      }
    }
    window.addEventListener('navigate-to-synthesize', handleNavigateToSynthesize)
    return () => window.removeEventListener('navigate-to-synthesize', handleNavigateToSynthesize)
  }, [])

  // Check for synthesize flag when currentApp changes (catches navigation from Post-LSP)
  useEffect(() => {
    const synthesizeFlag = localStorage.getItem('showSynthesizeNotes') === 'true'
    if (synthesizeFlag) {
      console.log('[FlowController] Found showSynthesizeNotes flag on currentApp change, setting state', { currentApp })
      setShowSynthesizeNotes(true)
      // Don't remove flag here - let the render logic handle it to avoid race conditions
    }
  }, [currentApp])

  // Debug logging for stage and routing
  useEffect(() => {
    console.log('[FlowController] Stage and routing state', {
      currentApp,
      currentStage,
      shouldShowPostLSPNextSteps,
      completedSORs: completedSORs.length,
      savedStage: typeof window !== 'undefined' ? localStorage.getItem('endeavor_currentStage') : null
    })
  }, [currentApp, currentStage, shouldShowPostLSPNextSteps, completedSORs.length])

  // Check if all 5 SORs are complete
  const allSORsComplete = completedSORs.length >= 5
  const lspStarted = currentLSPPanel > 0 // LSP has started when currentLSPPanel is set
  const allLSPPanelsComplete = lspPanels.every(p => p.completed)

  // Show SOR transition screen
  if (showSORTransition && !showLSPOverview) {
    return (
      <SORTransition 
        onContinue={() => {
          setShowSORTransition(false)
          setShowLSPOverview(true)
          setCurrentStage('LSP') // Update timeline to highlight LSP
        }}
      />
    )
  }

  // Show LSP Overview
  if (showLSPOverview && !lspStarted) {
    return (
      <LSPOverview 
        onBegin={() => {
          setShowLSPOverview(false)
          startLSP()
        }}
      />
    )
  }

  // Show LSP Panels
  if (lspStarted && !allLSPPanelsComplete) {
    const nextPanel = lspPanels.find(p => !p.completed)
    if (nextPanel) {
      return (
        <LSP 
          panelNumber={nextPanel.id} 
          onComplete={() => {
            // Panel completion is handled by completeLSPPanel
            // FlowController will automatically show next panel or next step
            // Do not redirect to overview - stay in LSP flow
          }}
        />
      )
    }
  }

  // Show "Tell Founders They May Leave" transition after all panels complete
  if (allLSPPanelsComplete && !foundersLeft && !deliberationsComplete) {
    return (
      <FoundersLeaveTransition 
        onBeginDeliberations={() => {
          // After clicking "Begin Deliberations", FlowController will automatically show Deliberations
          // because foundersLeft will be set to true by FoundersLeaveTransition
        }}
      />
    )
  }

  // Show Deliberations after founders leave
  if (allLSPPanelsComplete && foundersLeft && !deliberationsComplete) {
    return <Deliberations onComplete={completeDeliberations} />
  }

  // Show Comeback outcome
  if (deliberationsResult === 'comeback') {
    return (
      <div className="app-container">
        <div className="app-content" style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Comeback Case</h1>
          <div style={{
            padding: '3rem',
            background: 'var(--endeavor-yellow)',
            borderRadius: '4px',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
              The company will need to address concerns raised during the Local Selection Panels before proceeding further.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show Champion Selection after unanimous yes
  if (deliberationsResult === 'unanimous-yes' && !selectedChampion) {
    return <ChampionSelection onComplete={() => {
      // After champion selected, show Post-LSP Next Steps screen
      setShowPostLSPNextSteps(true)
    }} />
  }

  // Show Synthesize Notes screen if flag is set
  // Check localStorage directly to catch immediate navigation (before state updates)
  // This allows rendering even if state hasn't updated yet
  // IMPORTANT: Check this BEFORE Post-LSP Next Steps to prevent it from overriding
  const synthesizeFlagCheck = typeof window !== 'undefined' && localStorage.getItem('showSynthesizeNotes') === 'true'
  
  if (showSynthesizeNotes || synthesizeFlagCheck) {
    console.log('[FlowController] Rendering SynthesizeNotes (BEFORE Post-LSP check)', { 
      showSynthesizeNotes, 
      synthesizeFlag: synthesizeFlagCheck,
      currentApp 
    })
    // Update state if flag exists but state hasn't updated yet
    // DON'T remove flag here - keep it until synthesis is complete
    // This prevents Post-LSP Next Steps from showing when we toggle back to overview
    if (synthesizeFlagCheck && !showSynthesizeNotes) {
      // Schedule state update for next render cycle
      setTimeout(() => setShowSynthesizeNotes(true), 0)
    }
    return <SynthesizeNotes onComplete={() => {
      setShowSynthesizeNotes(false)
      // Remove flag when synthesis is complete
      localStorage.removeItem('showSynthesizeNotes')
      // Return navigation is handled inside SynthesizeNotes component
    }} />
  }

  // Show Post-LSP Next Steps screen
  // ONLY show when on 'overview' tab AND champion selected AND not all steps complete
  // This ensures it doesn't cover other tabs (Inbox, Calendar, Salesforce)
  // NOTE: This check comes AFTER Synthesize Notes to prevent it from overriding
  if (shouldShowPostLSPNextSteps && currentApp === 'overview') {
    console.log('[FlowController] Rendering PostLSPNextSteps (overview tab, steps incomplete)')
    return <PostLSPNextSteps 
      onStep1Complete={() => {
        // Step 1 complete - stay on next steps screen (state will update)
      }}
      onStep2Complete={() => {
        // Step 2 complete - stay on next steps screen (state will update)
      }}
      onStep3Complete={() => {
        // Step 3 complete - all steps done, continue to normal flow
        // The shouldShowPostLSPNextSteps will become false, so we'll exit this screen
      }}
    />
  }

  // Show Outcome Email (after champion selected, before pros/cons)
  // NOTE: This is now handled by congratsEmailSent flag, so we skip this redirect
  // The congrats email is sent, and now we want to show synthesis screen, not redirect to inbox
  // if (deliberationsResult === 'unanimous-yes' && selectedChampion && !outcomeEmailSent && lspPros.length === 0) {
  //   // This will be handled by Inbox component detecting the flag
  //   if (currentApp !== 'inbox') {
  //     setCurrentApp('inbox')
  //   }
  // }

  // Show Pros & Cons composition (after outcome email sent)
  // NOTE: This is now handled by the synthesis screen in CaseOverview, so we skip this
  // if (deliberationsResult === 'unanimous-yes' && selectedChampion && outcomeEmailSent && !showProsCons && lspPros.length === 0) {
  //   return <LSPProsCons onComplete={() => {
  //     setShowProsCons(true)
  //     // Set flag to open champion email in Inbox
  //     localStorage.setItem('championEmail', JSON.stringify({ timestamp: Date.now() }))
  //     setCurrentApp('inbox')
  //   }} />
  // }
  
  // Prevent redirect to inbox if we should show synthesis screen
  // If congrats email is sent but synthesis not drafted, and we're on overview, stay on overview
  if (congratsEmailSent && !prosConsDrafted && currentApp === 'overview') {
    console.log('[FlowController] Synthesis screen should be shown, staying on overview')
    // Continue to normal app switching - CaseOverview will handle showing synthesis screen
  }

  // NEW FLOW SEQUENCE:
  // 1. Global Review Session (first - after follow-up logged)
  if (followupLoggedInSalesforce && !globalReviewShown) {
    // Update stage to ISP when entering ISP flow
    if (currentStage !== 'ISP') {
      setCurrentStage('ISP')
    }
    return <GlobalReviewSession onNext={() => {}} />
  }

  // 2. ISP Type Selection (after Global Review Session)
  if (globalReviewShown && !ispType) {
    return <ISP onComplete={() => {}} />
  }

  // 3. Profile Editor Pairing (after ISP type selected)
  if (ispType && !profileEditorPairingShown) {
    return <ProfileEditorPairing onNext={() => {}} />
  }

  // 4. Global Review With Team (after Profile Editor Pairing)
  if (profileEditorPairingShown && !globalReviewWithTeamShown) {
    return <GlobalReviewWithTeam onNext={() => {}} />
  }

  // 5. ISP Introduction (after Global Review With Team)
  if (globalReviewWithTeamShown && !ispIntroductionShown) {
    return <ISPIntroduction onNext={() => {}} />
  }

  // Check if all 5 ISP steps are complete
  const allISPStepsComplete = followupLoggedInSalesforce && 
    globalReviewShown && 
    ispType !== null && 
    profileEditorPairingShown && 
    globalReviewWithTeamShown && 
    ispIntroductionShown

  // Clear showReport flag on hard refresh to ensure we always start at FOR
  // If we're at FOR stage, we should never show the report (hard refresh behavior)
  useEffect(() => {
    if (typeof window !== 'undefined' && currentStage === 'FOR') {
      const showReportFlag = localStorage.getItem('showReport')
      if (showReportFlag === 'true') {
        // If we're at FOR stage (hard refresh), clear the report flag
        console.log('[FlowController] Hard refresh detected (FOR stage) - clearing showReport flag')
        localStorage.removeItem('showReport')
      }
    }
  }, [currentStage])

  // Show Report page if flag is set (but only if not at FOR stage)
  // On hard refresh, currentStage will be 'FOR', so this check will prevent showing the report
  if (currentStage === 'FOR') {
    // Never show report when at FOR stage (hard refresh always starts at FOR)
    // Continue to normal app flow
  } else {
    const showReport = typeof window !== 'undefined' && localStorage.getItem('showReport') === 'true'
    if (showReport) {
      return <Report />
    }
  }

  // Show Onboarding Complete page if all ISP steps are done
  if (allISPStepsComplete) {
    return <OnboardingComplete />
  }

  // 6. ISP Panels (same process as LSP - TODO: implement ISP panels)
  // For now, after ISP introduction, continue to normal flow
  // if (ispIntroductionShown) {
  //   return <ISPPanels ... />
  // }

  // Show Synthesize Notes screen if flag is set
  // Check localStorage directly to catch immediate navigation (before state updates)
  // This allows rendering even if state hasn't updated yet
  const synthesizeFlag = typeof window !== 'undefined' && localStorage.getItem('showSynthesizeNotes') === 'true'
  
  if (showSynthesizeNotes || synthesizeFlag) {
    console.log('[FlowController] Rendering SynthesizeNotes', { 
      showSynthesizeNotes, 
      synthesizeFlag,
      currentApp 
    })
    // Remove flag after checking to prevent re-triggering
    if (synthesizeFlag) {
      localStorage.removeItem('showSynthesizeNotes')
      // Update state for consistency (will trigger on next render)
      if (!showSynthesizeNotes) {
        // Schedule state update for next render cycle
        setTimeout(() => setShowSynthesizeNotes(true), 0)
      }
    }
    return <SynthesizeNotes onComplete={() => {
      setShowSynthesizeNotes(false)
      // Return navigation is handled inside SynthesizeNotes component
    }} />
  }

  // Normal app switching
  console.log('[FlowController] Rendering with currentApp:', currentApp, {
    shouldShowPostLSPNextSteps,
    deliberationsResult,
    selectedChampion: !!selectedChampion,
    congratsEmailSent,
    prosConsDrafted,
    championEmailSent,
    showSynthesizeNotes
  })

  switch (currentApp) {
    case 'overview':
      // Always show CaseOverview - FOR content is now embedded in it
      // If Post-LSP Next Steps should show, it was already rendered above
      // Otherwise, show normal CaseOverview
      if (!shouldShowPostLSPNextSteps) {
        console.log('[FlowController] Rendering CaseOverview', { 
          currentStage,
          route: 'overview',
          willShowFOR: currentStage === 'FOR'
        })
        return <CaseOverview />
      }
      // If we reach here, PostLSPNextSteps should have been rendered above
      // This is a fallback (shouldn't happen)
      console.log('[FlowController] Fallback: Rendering CaseOverview (PostLSP should have rendered)')
      return <CaseOverview />
    case 'inbox':
      console.log('[FlowController] Rendering Inbox')
      return <Inbox />
    case 'calendar':
      console.log('[FlowController] Rendering Calendar')
      return <Calendar />
    case 'salesforce':
      console.log('[FlowController] Rendering Salesforce')
      return <Salesforce />
    default:
      console.log('[FlowController] Rendering default CaseOverview')
      return <CaseOverview />
  }
}

