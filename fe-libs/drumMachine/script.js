const { useState, useEffect } = React;

function App() {

  return (
    <div className="row justify-content-center mb-4">
        <div className="col-12 text-center">
            <h1 className="display-4 fw-bold text-primary mb-2">
                Drum Machine
            </h1>
            <p className="lead text-muted">
              <i className="bi bi-lightning-charge text-warning me-2"></i>
              Play with the sounds of a drum machine!
            </p>
        </div>
        
        <div className="col-12 col-md-8">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 text-center mb-4">
                            <h2 className="text-secondary">Drum Pads</h2>
                        </div>
                        {/* Drum pads will be rendered here */}
                    </div>
                </div>
            </div>
        </div>

        <footer className="bg-dark text-white text-center py-3 mt-5">
            <div className="container">
                <p className="mb-0">
                    Volodymyr Hrehul | React + Bootstrap 
                    <a href="https://github.com/Premisterio" className="github-text ms-2 text-decoration-none ">
                    GitHub
                    </a>
                </p>
            </div>
        </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
