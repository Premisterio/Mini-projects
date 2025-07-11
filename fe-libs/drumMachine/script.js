const { useState, useEffect } = React;

// Audio samples data from FreeCodeCamp
const audioSamples = [
  {
    key: 'Q',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
    description: 'Heater 1'
  },
  {
    key: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
    description: 'Heater 2'
  },
  {
    key: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
    description: 'Heater 3'
  },
  {
    key: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
    description: 'Heater 4'
  },
  {
    key: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
    description: 'Clap'
  },
  {
    key: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
    description: 'Open HH'
  },
  {
    key: 'Z',
    id: 'Kick-n-Hat',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
    description: "Kick n' Hat"
  },
  {
    key: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
    description: 'Kick'
  },
  {
    key: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
    description: 'Closed HH'
  }
];

function DrumPad({ sample, onPlay }) {
  const playSound = () => {
    const audio = document.getElementById(sample.key);
    if (audio) {
      audio.currentTime = 0; // Reset to beginning
      audio.play();
      onPlay(sample.description);
    }
  };

  return (
    <div className="col-4 mb-3">
      <div
        className="drum-pad btn btn-primary btn-lg w-100 h-100 d-flex align-items-center justify-content-center"
        id={sample.id}
        onClick={playSound}
        style={{ minHeight: '80px', fontSize: '1.5rem', fontWeight: 'bold' }}
      >
        {sample.key}
        <audio
          className="clip"
          id={sample.key}
          src={sample.url}
          preload="auto"
        />
      </div>
    </div>
  );
}

function App() {
  const [display, setDisplay] = useState('');

  const handlePlay = (description) => {
    setDisplay(description);
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase();
      const sample = audioSamples.find(s => s.key === key);
      
      if (sample) {
        const audio = document.getElementById(key);
        if (audio) {
          audio.currentTime = 0;
          audio.play();
          setDisplay(sample.description);
          
          // Add visual feedback
          const drumPad = document.getElementById(sample.id);
          if (drumPad) {
            drumPad.classList.add('btn-warning');
            drumPad.classList.remove('btn-primary');
            setTimeout(() => {
              drumPad.classList.remove('btn-warning');
              drumPad.classList.add('btn-primary');
            }, 100);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main content */}
      <div className="flex-grow-1">
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold text-primary mt-2">
                Drum Machine
              </h1>
              <p className="lead text-muted">
                <i className="bi bi-lightning-charge text-warning me-2"></i>
                Play with the sounds of a drum machine!
              </p>
              <p className="text-secondary">
                Use the keyboard keys Q, W, E, A, S, D, Z, X, C to play sounds or click the pads below.
              </p>
            </div>
            
            <div className="col-12 col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  {/* Main drum machine container */}
                  <div id="drum-machine">
                    {/* Display element */}
                    <div className="row mb-4">
                      <div className="col-12 text-center">
                        <div 
                          id="display" 
                          className="p-3 bg-dark text-white rounded"
                          style={{ minHeight: '60px', fontSize: '1.2rem', fontWeight: 'bold' }}
                        >
                          {display || 'Press a key or click a pad'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Drum pads */}
                    <div className="row">
                      <div className="col-12 text-center mb-3">
                        <h3 className="text-secondary">Drum Pads</h3>
                      </div>
                      {audioSamples.map((sample) => (
                        <DrumPad
                          key={sample.key}
                          sample={sample}
                          onPlay={handlePlay}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto w-100">
        <div className="container">
          <p className="mb-0">
            Volodymyr Hrehul | React + Bootstrap
            <a href="https://github.com/Premisterio" className="github-text ms-2 text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github align-middle" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
              <span className="align-middle ms-1">GitHub</span>
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);