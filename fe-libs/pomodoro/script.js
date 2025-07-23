const { useState, useEffect, useRef } = React;

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Session"); // or "Break"
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          // Play beep sound when timer reaches 00:00
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
          
          const nextMode = mode === "Session" ? "Break" : "Session";
          const nextTime = nextMode === "Session" ? sessionLength * 60 : breakLength * 60;
          setMode(nextMode);
          return nextTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, breakLength, sessionLength, mode]);

  // Reset handler
  const handleReset = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setMode("Session");
    
    // Stop and rewind audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Button click handlers with limits (1-60)
  const increaseSession = () => {
    if (sessionLength < 60) {
      const newLen = sessionLength + 1;
      setSessionLength(newLen);
      if (!isRunning && mode === "Session") setTimeLeft(newLen * 60);
    }
  };

  const decreaseSession = () => {
    if (sessionLength > 1) {
      const newLen = sessionLength - 1;
      setSessionLength(newLen);
      if (!isRunning && mode === "Session") setTimeLeft(newLen * 60);
    }
  };

  const increaseBreak = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decreaseBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="main-title">Pomodoro Timer</h1>
      </div>

      {/* Main Container */}
      <div className="d-flex align-items-center justify-content-center px-3">
        <div className="main-container">
          <h2 id="timer-label" className="session-label text-center mb-4">{mode === "Session" ? "Current Session" : "Current Break"}</h2>

          {/* Timer Controls Section */}
          <div className="d-flex align-items-center justify-content-center mb-4">
            {/* Play Button */}
            <button id="start_stop" className="control-btn me-3" onClick={() => setIsRunning(!isRunning)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                className="bi bi-play-fill"
                viewBox="0 0 16 16"
              >
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
              </svg>
            </button>

            {/* Timer Display */}
            <div className="timer-display">
              <span id="time-left" className="timer-text">{formatTime(timeLeft)}</span>
            </div>

            {/* Pause and Reset Buttons */}
            <div className="d-flex align-items-center ms-3">
              <button className="control-btn me-2" onClick={() => setIsRunning(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill="currentColor"
                  className="bi bi-pause"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5" />
                </svg>
              </button>
              <button id="reset" className="control-btn control-btn-reset" onClick={() => {
                setIsRunning(false);
                setMode("Session");
                setSessionLength(25);
                setBreakLength(5);
                setTimeLeft(25 * 60);
                const audio = document.getElementById("beep");
                if (audio) {
                  audio.pause();
                  audio.currentTime = 0;
                }
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill="currentColor"
                  className="bi bi-arrow-repeat"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                  <path
                    fillRule="evenodd"
                    d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Break and Session Controls */}
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="text-center">
                <h3 id="break-label" className="control-title mb-3">Break Length</h3>
                <div className="length-control">
                  <button id="break-decrement" className="btn btn-outline-primary control-btn-small" onClick={decreaseBreak}>
                    −
                  </button>
                  <span id="break-length" className="length-display">{breakLength}</span>
                  <button id="break-increment" className="btn btn-outline-primary control-btn-small" onClick={increaseBreak}>
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="text-center">
                <h3 id="session-label" className="control-title mb-3">Session Length</h3>
                <div className="length-control">
                  <button id="session-decrement" className="btn btn-outline-primary control-btn-small" onClick={decreaseSession}>
                    −
                  </button>
                  <span id="session-length" className="length-display">{sessionLength}</span>
                  <button id="session-increment" className="btn btn-outline-primary control-btn-small" onClick={increaseSession}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto w-100 footer">
        <span>
          Volodymyr Hrehul | React + Bootstrap
          <a href="https://github.com/Premisterio" className="github-text ms-2 text-decoration-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-github align-middle"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
            <span className="align-middle ms-1">GitHub</span>
          </a>
        </span>
      </footer>
      
      <audio 
        id="beep" 
        ref={audioRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" 
        preload="auto"
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
