const { useState, useEffect } = React;

const defaultMarkdown = ` Heading H1
## Subheading H2
[Link example](https://www.freecodecamp.org)
\`Inline code example\`
\`\`\`
Multi line code example:
const item = 5;
console.log(item);
\`\`\`
- List item
- Another item
> Quote example
![Image](https://placehold.co/50x50)
**Bold text**
*Italic text*
`;
function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  const handleChange = (e) => {
    setMarkdown(e.target.value);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-0 mt-4">
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold text-primary mb-2">
              <i className="bi bi-markdown me-3"></i>
              Markdown Previewer
            </h1>
            <p className="lead text-muted">
              <i className="bi bi-lightning-charge text-warning me-2"></i>
              Real-time markdown to HTML preview
            </p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-pencil-square me-2"></i>
                  Markdown Editor
                </h5>
              </div>
              <div className="card-body p-0">
                <textarea
                  id="editor"
                  className="form-control border-0 rounded-0 h-100"
                  rows="20"
                  value={markdown}
                  onChange={handleChange}
                  placeholder="Enter your markdown here..."
                  style={{ minHeight: '500px', fontFamily: 'monospace', fontSize: '14px' }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-eye me-2"></i>
                  Live Preview
                </h5>
              </div>
              <div className="card-body">
                <div
                  id="preview"
                  className="border-0 p-0"
                  style={{ minHeight: '450px', maxHeight: '450px', overflowY: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: marked.parse(markdown, { breaks: true }) }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 text-center">
            <div className="d-flex justify-content-center flex-wrap gap-2">
              <span className="badge bg-primary fs-6">
                <i className="bi bi-check-circle me-1"></i>
                Live Preview
              </span>
              <span className="badge bg-success fs-6">
                <i className="bi bi-markdown me-1"></i>
                Markdown Support
              </span>
              <span className="badge bg-info fs-6">
                <i className="bi bi-phone me-1"></i>
                Responsive
              </span>
              <span className="badge bg-warning text-dark fs-6">
                <i className="bi bi-code-slash me-1"></i>
                Code Highlighting
              </span>
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
