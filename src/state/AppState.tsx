import { createContext, useContext, useState, ReactNode } from 'react'

export type AppType = 'overview' | 'inbox' | 'calendar' | 'salesforce'
export type Stage = 'FOR' | 'SOR' | 'LSP' | 'ISP'

interface AppStateContextType {
  currentApp: AppType
  setCurrentApp: (app: AppType) => void
  currentStage: Stage
  setCurrentStage: (stage: Stage) => void
  emails: Email[]
  meetings: Meeting[]
  notes: Note[]
  logs: Log[]
  assessments: Assessment[]
  currentSOR: number
  completedSORs: number[]
  lspPanels: LSPPanel[]
  currentLSPPanel: number
  deliberationsComplete: boolean
  deliberationsResult: 'unanimous-yes' | 'comeback' | null
  selectedChampion: string | null
  lspPros: string[]
  lspCons: string[]
  championFollowupScheduled: boolean
  foundersLeft: boolean
  outcomeEmailSent: boolean
  ispReady: boolean
  ispType: 'virtual' | 'in-person' | null
  addEmail: (email: Email) => void
  addMeeting: (meeting: Meeting) => void
  addNote: (note: Note) => void
  addLog: (log: Log) => void
  addAssessment: (assessment: Assessment) => void
  startSOR: (sorNumber: number) => void
  completeSOR: (sorNumber: number) => void
  startLSP: () => void
  completeLSPPanel: (panelNumber: number) => void
  completeDeliberations: (result: 'unanimous-yes' | 'comeback') => void
  setChampion: (championName: string) => void
  updateLSPPros: (pros: string[]) => void
  updateLSPCons: (cons: string[]) => void
  updateChampionFollowupScheduled: (scheduled: boolean) => void
  setISPReady: (ready: boolean) => void
  setISPType: (type: 'virtual' | 'in-person') => void
  updateLSPPanelNotes: (panelNumber: number, notes: string) => void
  deliberationsNotes: string
  updateDeliberationsNotes: (notes: string) => void
  // LSP Voting State
  voteRound1Completed: boolean
  voteRound1Result: { yes: number; no: number } | null
  postRound1DiscussionCompleted: boolean
  voteRound2Completed: boolean
  voteRound2Result: { yes: number; no: number } | null
  passedLSP: boolean
  // Champion Selection
  championPanelistId: string | null
  // Email States
  congratsEmailSent: boolean
  prosConsDrafted: boolean
  championEmailSent: boolean
  championAvailabilityReceived: boolean
  championAvailabilitySlots: string[]
  founderConfirmedChampionSlot: boolean
  confirmedChampionSlot: string | null
  followupScheduled: boolean
  followupLoggedInSalesforce: boolean
  globalReviewShown: boolean
  ispSignedUp: boolean
  profileEditorPairingShown: boolean
  globalReviewWithTeamShown: boolean
  ispIntroductionShown: boolean
  // Functions
  setVoteRound1Completed: (completed: boolean, result: { yes: number; no: number }) => void
  setPostRound1DiscussionCompleted: (completed: boolean) => void
  setVoteRound2Completed: (completed: boolean, result: { yes: number; no: number }) => void
  setPassedLSP: (passed: boolean) => void
  setChampionPanelistId: (id: string | null) => void
  setCongratsEmailSent: (sent: boolean) => void
  setProsConsDrafted: (drafted: boolean) => void
  setChampionEmailSent: (sent: boolean) => void
  setChampionAvailabilityReceived: (received: boolean, slots: string[]) => void
  setFounderConfirmedChampionSlot: (confirmed: boolean, slot: string) => void
  setFollowupScheduled: (scheduled: boolean) => void
  setFollowupLoggedInSalesforce: (logged: boolean) => void
  setOutcomeEmailSent: (sent: boolean) => void
  setGlobalReviewShown: (shown: boolean) => void
  setISPSignedUp: (signedUp: boolean) => void
  setProfileEditorPairingShown: (shown: boolean) => void
  setGlobalReviewWithTeamShown: (shown: boolean) => void
  setISPIntroductionShown: (shown: boolean) => void
  setFoundersLeft: (left: boolean) => void
}

export interface Email {
  id: string
  threadId?: string
  from: string
  to: string
  cc?: string[]
  subject: string
  body: string
  timestamp: string
  sent: boolean
  read: boolean
  type?: 'sent' | 'received'
}

export interface Meeting {
  id: string
  type: 'SOR' | 'LSP' | 'ISP'
  sorNumber?: number
  title: string
  attendees: string[]
  date: string
  time: string
  timezone: string
  agenda?: string
  meetingLink?: string
  confirmed: boolean
  started?: boolean
  ended?: boolean
}

export interface Note {
  id: string
  meetingId: string
  content: string
  timestamp: string
}

export interface Log {
  id: string
  meetingId: string
  meetingType: string
  date: string
  attendees: string[]
  notes: string
  saved: boolean
}

export interface Assessment {
  id: string
  sorNumber: number
  mentorName: string
  status: 'pending' | 'completed'
  ratings?: {
    readiness: number // out of 10
    potential: number // out of 10
    fit: number // out of 10
  }
  feedback?: string
  completedAt?: string
}

export interface LSPPanel {
  id: number
  panelists: Array<{
    name: string
    role: string
    photo: string
  }>
  notes: string // Panel notes as a single string
  themes: string[]
  completed: boolean
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  // Always initialize to FOR on hard refresh (don't persist stage across refreshes)
  const [currentStage, setCurrentStageState] = useState<Stage>(() => {
    if (typeof window !== 'undefined') {
      // Clear any saved stage to ensure we always start at FOR on refresh
      const saved = localStorage.getItem('endeavor_currentStage')
      if (saved) {
        console.log('[AppState] Clearing saved stage on initialization (hard refresh behavior)', { saved })
        localStorage.removeItem('endeavor_currentStage')
      }
    }
    console.log('[AppState] Initializing stage to FOR (hard refresh always resets to FOR)')
    return 'FOR' // Always start at FOR on refresh
  })

  const setCurrentStage = (stage: Stage) => {
    setCurrentStageState(stage)
    // Don't persist stage to localStorage - always reset to FOR on refresh
    // This allows progression during the session but resets on hard refresh
    console.log('[AppState] Stage updated (session only, not persisted)', { stage })
  }

  const [currentApp, setCurrentApp] = useState<AppType>('overview')
  const [emails, setEmails] = useState<Email[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [currentSOR, setCurrentSOR] = useState(0)
  const [completedSORs, setCompletedSORs] = useState<number[]>([])
  const [lspPanels, setLSPPanels] = useState<LSPPanel[]>([
    { 
      id: 1, 
      panelists: [
        { name: 'Sarah Nguyen', role: 'FinTech CEO, Mexico', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces' },
        { name: 'Karim El-Masry', role: 'Venture Capital Partner', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=faces' },
      ], 
      notes: '', 
      themes: [], 
      completed: false 
    },
    { 
      id: 2, 
      panelists: [
        { name: 'Lina Abou-Raya', role: 'Private Equity Investor', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces' },
        { name: 'James Whitmore', role: 'PropTech CTO', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces' },
      ], 
      notes: '', 
      themes: [], 
      completed: false 
    },
    { 
      id: 3, 
      panelists: [
        { name: 'Maria Santos', role: 'Serial Tech Founder', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces' },
        { name: 'David Chen', role: 'Enterprise SaaS Founder', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=faces' },
      ], 
      notes: '', 
      themes: [], 
      completed: false 
    },
  ])
  const [currentLSPPanel, setCurrentLSPPanel] = useState(0) // Start at 0, set to 1 when LSP begins
  const [deliberationsComplete, setDeliberationsComplete] = useState(false)
  const [deliberationsResult, setDeliberationsResult] = useState<'unanimous-yes' | 'comeback' | null>(null)
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null)
  const [lspPros, setLSPPros] = useState<string[]>([])
  const [lspCons, setLSPCons] = useState<string[]>([])
  const [championFollowupScheduled, setChampionFollowupScheduled] = useState(false)
  const [foundersLeft, setFoundersLeft] = useState(false)
  const [outcomeEmailSent, setOutcomeEmailSent] = useState(false)
  const [ispReady, setISPReady] = useState(false)
  const [ispType, setISPType] = useState<'virtual' | 'in-person' | null>(null)
  const [deliberationsNotes, setDeliberationsNotes] = useState('')
  // LSP Voting State
  const [voteRound1Completed, setVoteRound1CompletedState] = useState(false)
  const [voteRound1Result, setVoteRound1ResultState] = useState<{ yes: number; no: number } | null>(null)
  const [postRound1DiscussionCompleted, setPostRound1DiscussionCompletedState] = useState(false)
  const [voteRound2Completed, setVoteRound2CompletedState] = useState(false)
  const [voteRound2Result, setVoteRound2ResultState] = useState<{ yes: number; no: number } | null>(null)
  const [passedLSP, setPassedLSPState] = useState(false)
  // Champion Selection
  const [championPanelistId, setChampionPanelistIdState] = useState<string | null>(null)
  // Email States
  const [congratsEmailSent, setCongratsEmailSentState] = useState(false)
  const [prosConsDrafted, setProsConsDraftedState] = useState(false)
  const [championEmailSent, setChampionEmailSentState] = useState(false)
  const [championAvailabilityReceived, setChampionAvailabilityReceivedState] = useState(false)
  const [championAvailabilitySlots, setChampionAvailabilitySlotsState] = useState<string[]>([])
  const [founderConfirmedChampionSlot, setFounderConfirmedChampionSlotState] = useState(false)
  const [confirmedChampionSlot, setConfirmedChampionSlotState] = useState<string | null>(null)
  const [followupScheduled, setFollowupScheduledState] = useState(false)
  const [followupLoggedInSalesforce, setFollowupLoggedInSalesforceState] = useState(false)
  const [globalReviewShown, setGlobalReviewShownState] = useState(false)
  const [ispSignedUp, setISPSignedUpState] = useState(false)
  const [profileEditorPairingShown, setProfileEditorPairingShownState] = useState(false)
  const [globalReviewWithTeamShown, setGlobalReviewWithTeamShownState] = useState(false)
  const [ispIntroductionShown, setISPIntroductionShownState] = useState(false)

  const addEmail = (email: Email) => {
    setEmails([...emails, email])
  }

  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => {
      const existing = prev.find(m => m.id === meeting.id)
      if (existing) {
        return prev.map(m => m.id === meeting.id ? meeting : m)
      }
      return [...prev, meeting]
    })
  }

  const addNote = (note: Note) => {
    setNotes([...notes, note])
  }

  const addLog = (log: Log) => {
    setLogs([...logs, log])
  }

  const addAssessment = (assessment: Assessment) => {
    setAssessments(prev => {
      const existing = prev.find(a => a.id === assessment.id)
      if (existing) {
        return prev.map(a => a.id === assessment.id ? assessment : a)
      }
      return [...prev, assessment]
    })
  }

  const startSOR = (sorNumber: number) => {
    setCurrentSOR(sorNumber)
    // Create initial assessment as pending
    const assessment: Assessment = {
      id: `sor-${sorNumber}`,
      sorNumber,
      mentorName: '',
      status: 'pending',
    }
    addAssessment(assessment)
  }

  const completeSOR = (sorNumber: number) => {
    if (!completedSORs.includes(sorNumber)) {
      setCompletedSORs([...completedSORs, sorNumber])
    }
  }

  const startLSP = () => {
    setCurrentLSPPanel(1)
  }

  const completeLSPPanel = (panelNumber: number) => {
    setLSPPanels(prev => prev.map(panel => 
      panel.id === panelNumber ? { ...panel, completed: true } : panel
    ))
    if (panelNumber < lspPanels.length) {
      setCurrentLSPPanel(panelNumber + 1)
    }
  }

  const completeDeliberations = (result: 'unanimous-yes' | 'comeback') => {
    setDeliberationsComplete(true)
    setDeliberationsResult(result)
  }

  const setChampion = (championName: string) => {
    setSelectedChampion(championName)
  }

  const updateLSPPros = (pros: string[]) => {
    setLSPPros(pros)
  }

  const updateLSPCons = (cons: string[]) => {
    setLSPCons(cons)
  }

  const updateChampionFollowupScheduled = (scheduled: boolean) => {
    setChampionFollowupScheduled(scheduled)
  }

  const updateLSPPanelNotes = (panelNumber: number, notes: string) => {
    setLSPPanels(prev => prev.map(panel => 
      panel.id === panelNumber ? { ...panel, notes } : panel
    ))
  }

  const updateDeliberationsNotes = (notes: string) => {
    setDeliberationsNotes(notes)
  }

  const setVoteRound1Completed = (completed: boolean, result: { yes: number; no: number }) => {
    setVoteRound1CompletedState(completed)
    setVoteRound1ResultState(result)
  }

  const setPostRound1DiscussionCompleted = (completed: boolean) => {
    setPostRound1DiscussionCompletedState(completed)
  }

  const setVoteRound2Completed = (completed: boolean, result: { yes: number; no: number }) => {
    setVoteRound2CompletedState(completed)
    setVoteRound2ResultState(result)
  }

  const setPassedLSP = (passed: boolean) => {
    setPassedLSPState(passed)
  }

  const setChampionPanelistId = (id: string | null) => {
    setChampionPanelistIdState(id)
  }

  const setCongratsEmailSent = (sent: boolean) => {
    setCongratsEmailSentState(sent)
  }

  const setProsConsDrafted = (drafted: boolean) => {
    setProsConsDraftedState(drafted)
  }

  const setChampionEmailSent = (sent: boolean) => {
    setChampionEmailSentState(sent)
  }

  const setChampionAvailabilityReceived = (received: boolean, slots: string[]) => {
    setChampionAvailabilityReceivedState(received)
    setChampionAvailabilitySlotsState(slots)
  }

  const setFounderConfirmedChampionSlot = (confirmed: boolean, slot: string) => {
    setFounderConfirmedChampionSlotState(confirmed)
    setConfirmedChampionSlotState(slot)
  }

  const setFollowupScheduled = (scheduled: boolean) => {
    setFollowupScheduledState(scheduled)
  }

  const setFollowupLoggedInSalesforce = (logged: boolean) => {
    setFollowupLoggedInSalesforceState(logged)
  }

  const setGlobalReviewShown = (shown: boolean) => {
    setGlobalReviewShownState(shown)
  }

  const setISPSignedUp = (signedUp: boolean) => {
    setISPSignedUpState(signedUp)
  }

  const setProfileEditorPairingShown = (shown: boolean) => {
    setProfileEditorPairingShownState(shown)
  }

  const setGlobalReviewWithTeamShown = (shown: boolean) => {
    setGlobalReviewWithTeamShownState(shown)
  }

  const setISPIntroductionShown = (shown: boolean) => {
    setISPIntroductionShownState(shown)
  }

  return (
    <AppStateContext.Provider
      value={{
        currentApp,
        setCurrentApp,
        currentStage,
        setCurrentStage,
        emails,
        meetings,
        notes,
        logs,
        assessments,
        currentSOR,
        completedSORs,
        lspPanels,
        currentLSPPanel,
        deliberationsComplete,
        deliberationsResult,
        selectedChampion,
        lspPros,
        lspCons,
        championFollowupScheduled,
        foundersLeft,
        outcomeEmailSent,
        ispReady,
        ispType,
        addEmail,
        addMeeting,
        addNote,
        addLog,
        addAssessment,
        startSOR,
        completeSOR,
        startLSP,
        completeLSPPanel,
        completeDeliberations,
        setChampion,
        updateLSPPros: setLSPPros,
        updateLSPCons: setLSPCons,
        updateChampionFollowupScheduled: setChampionFollowupScheduled,
        setFoundersLeft,
        setOutcomeEmailSent,
        setISPReady,
        setISPType,
        updateLSPPanelNotes,
        deliberationsNotes,
        updateDeliberationsNotes,
        voteRound1Completed,
        voteRound1Result,
        postRound1DiscussionCompleted,
        voteRound2Completed,
        voteRound2Result,
        passedLSP,
        championPanelistId,
        congratsEmailSent,
        prosConsDrafted,
        championEmailSent,
        championAvailabilityReceived,
        championAvailabilitySlots,
        founderConfirmedChampionSlot,
        confirmedChampionSlot,
        followupScheduled,
        followupLoggedInSalesforce,
        globalReviewShown,
        ispSignedUp,
        profileEditorPairingShown,
        globalReviewWithTeamShown,
        ispIntroductionShown,
        setVoteRound1Completed,
        setPostRound1DiscussionCompleted,
        setVoteRound2Completed,
        setPassedLSP,
        setChampionPanelistId,
        setCongratsEmailSent,
        setProsConsDrafted,
        setChampionEmailSent,
        setChampionAvailabilityReceived,
        setFounderConfirmedChampionSlot,
        setFollowupScheduled,
        setFollowupLoggedInSalesforce,
        setGlobalReviewShown,
        setISPSignedUp,
        setProfileEditorPairingShown,
        setGlobalReviewWithTeamShown,
        setISPIntroductionShown,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
