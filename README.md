# Endeavor Interactive Onboarding Simulator

A web-based interactive product that simulates running a real company through the Endeavor selection process. This experience is designed to feel like an extension of Endeavor's website, with a focus on narrative storytelling rather than traditional training tools.

## Features

- **8 Interactive Chapters**: Complete journey from company assignment through final reflection
- **Endeavor Design System**: Matches Endeavor.org's visual language (large typography, white space, circular photos, teal/black/yellow accents)
- **Realistic Interactions**: Email composition, calendar scheduling, meeting notes, Salesforce logging
- **State Management**: Tracks progress through the entire selection process
- **Smooth Transitions**: Scroll-based narrative with inline interactions

## Chapters

1. **Company Assignment** - Introduction to TechFlow Solutions
2. **Email Interaction** - Initiate first SOR via email
3. **Calendar Scheduling** - Schedule meeting with mentor
4. **SOR Meeting** - Simulated video call with note-taking
5. **Salesforce Logging** - Log meeting details
6. **Progression Timeline** - Visual journey through SORs 1-5
7. **LSP Observation** - Local Selection Panel synthesis
8. **ISP Founder Support** - Strategic introductions
9. **Final Reflection** - Narrative summary of the journey

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Design Principles

- **Large Editorial Typography**: Serif headings, spacious layouts
- **White Space**: Generous padding and margins
- **Circular Photo Masks**: All profile images use circular masks
- **Brand Colors**: Teal (#00A3A1), Black (#000000), Yellow (#FFC72C)
- **Minimal UI Chrome**: Clean, story-focused interface
- **Scroll-Based Narrative**: Pages feel like stories, not tools

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS** - Custom design system (no external UI libraries)

## Project Structure

```
src/
  ├── chapters/          # Individual chapter components
  ├── state/             # State management (AppState)
  ├── App.tsx           # Main app component
  ├── main.tsx          # Entry point
  └── index.css         # Global styles and design system
```

## State Management

The app uses React Context for state management, tracking:
- Current chapter
- Emails sent
- Meetings scheduled
- Notes taken
- Logs completed
- Completed SORs

## Notes

- All interactions are simulated (no real API integrations)
- Photos use Unsplash placeholders
- The experience is designed to be linear but allows for natural progression
- Mistakes are allowed - consequences appear naturally in the narrative

## License

This is a prototype/simulation tool for Endeavor onboarding purposes.

