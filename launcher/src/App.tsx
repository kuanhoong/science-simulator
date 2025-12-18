

function App() {
  const simulators = [
    {
      id: 'sim1',
      title: 'Solar Hand Control',
      description: 'Interact with the solar system using hand gestures via webcam. A magical 3D experience.',
      port: 3001,
      color: '#f59e0b', // Amber
      type: 'Webcam',
    },
    {
      id: 'sim2',
      title: 'Particle Playground',
      description: 'Control particle physics with your voice. Sing, shout, and watch the chaos unfold.',
      port: 3002,
      color: '#ec4899', // Pink
      type: 'Microphone',
    },
    {
      id: 'sim3',
      title: 'React City 3D',
      description: 'Explore a procedurally generated city. Navigate through the neon streets of the future.',
      port: 3003,
      color: '#3b82f6', // Blue
      type: 'Keyboard/Mouse',
    }
  ]

  const launchSimulator = (port: number) => {
    window.open(`http://localhost:${port}`, '_blank')
  }

  return (
    <div className="container">
      <header>
        <h1>Science Simulator Hub</h1>
        <p className="subtitle">Launch and explore interactive 3D learning experiences.</p>
      </header>

      <div className="grid">
        {simulators.map((sim) => (
          <div
            key={sim.id}
            className="card"
            style={{ '--accent-color': sim.color } as any}
          >
            <span className="badge">{sim.type}</span>
            <h2>{sim.title}</h2>
            <p className="card-desc">{sim.description}</p>
            <button
              className="launch-btn"
              onClick={() => launchSimulator(sim.port)}
            >
              Launch Simulator
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
