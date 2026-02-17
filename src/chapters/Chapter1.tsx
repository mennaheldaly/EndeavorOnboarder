import './Chapter.css'

interface Chapter1Props {
  onComplete: () => void
}

export function Chapter1({ onComplete }: Chapter1Props) {
  return (
    <div className="chapter section-large">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="company-header">
              <h1>TechFlow Solutions</h1>
              <div className="company-meta">
                <span className="badge">FinTech</span>
                <span className="badge">Mexico</span>
              </div>
            </div>
            
            <div className="founder-photo-container">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces" 
                alt="Founder" 
                className="circular-photo"
              />
              <p className="founder-name">Omar Hassan, Founder & CEO</p>
            </div>
          </div>
        </div>

        {/* Company Story Section */}
        <div className="story-section">
          <h2>Company Story</h2>
          
          <div className="story-content">
            <h3>What They Do</h3>
            <p>
              TechFlow Solutions provides AI-powered financial planning tools for small and medium-sized businesses 
              across Latin America. Their platform helps business owners forecast cash flow, optimize expenses, and 
              make data-driven financial decisions without requiring a finance background.
            </p>

            <h3>Why They Applied to Endeavor</h3>
            <p>
              Omar has built TechFlow to $2M ARR with a team of 15, but growth has plateaued. He recognizes that 
              scaling requires strategic guidance, access to mentors who've navigated similar challenges, and connections 
              to potential investors. He applied to Endeavor seeking the structured support system that could help him 
              break through to the next level.
            </p>

            <h3>Where They Are in Their Journey</h3>
            <p>
              TechFlow is at a critical inflection point. They've proven product-market fit in Mexico and have early 
              traction in Colombia. However, they're facing challenges with unit economics, need to expand their 
              leadership team, and are preparing for a Series A round in the next 12 months. Omar is eager but 
              acknowledges he needs guidance on scaling operations and building strategic partnerships.
            </p>
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="sidebar-card">
          <div className="card-content">
            <h3>Your Role</h3>
            <p>
              As an Endeavor Associate, you'll guide TechFlow through the selection process. Your responsibilities 
              include coordinating SOR (Selection of Review) meetings, facilitating connections between Omar and 
              mentors, and ensuring all documentation and processes are completed smoothly.
            </p>

            <h3>What Happens Next</h3>
            <p>
              You'll initiate the first SOR by reaching out to a mentor who can provide strategic guidance on 
              TechFlow's growth challenges. This will involve setting up an email introduction, scheduling a meeting, 
              and facilitating a productive conversation.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <button className="primary" onClick={onComplete}>
            ➡️ Initiate First SOR
          </button>
        </div>
      </div>
    </div>
  )
}

