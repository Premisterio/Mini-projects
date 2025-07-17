const { useState, useEffect, useReducer } = React;

const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
}

// Formatting numbers for display
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return integer
  return `${integer}.${decimal}`
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  
  if (isNaN(prev) || isNaN(current)) return ""
  
  let computation = ""
  
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "−":
      computation = prev - current
      break
    case "×":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
    default:
      return
  }
  
  return computation.toString()
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      // Remove leading zeros
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }

      // Handle decimal point logic
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      // If no input at all and the user tries any op other than minus, ignore
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      // Handle negative sign at the start
      if (state.currentOperand == null && payload.operation === "−") {
        return {
          ...state,
          currentOperand: "-",
        }
      }

      // If currentOperand is just "-", and another operator is pressed, treat as operator replacement
      if (state.currentOperand === "-" && payload.operation !== "−") {
        return {
          ...state,
          currentOperand: null,
          operation: payload.operation,
        }
      }

      // Replace operation if currentOperand is null (i.e., user is entering multiple operators)
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      // If previous is null, shift current to previous and set operation
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      // If we have both operands and currentOperand isn't just a minus sign
      if (state.currentOperand !== "-") {
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        }
      }

      return state

    case ACTIONS.CLEAR:
      return {}
      
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      
      if (state.currentOperand == null) return state
      
      // If only one digit, clear current operand
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
      
    case ACTIONS.EVALUATE:
      // Eval only if all operands and operation are present
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
      
    default:
      return state
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )

  // Keyboard input
  useEffect(() => {
    function handleKeydown(event) {
      // Prevent default
      if ('0123456789+-*/.='.includes(event.key) || event.key === 'Enter' || event.key === 'Escape' || event.key === 'Backspace') {
        event.preventDefault()
      }

      // Handle number keys
      if (event.key >= '0' && event.key <= '9') {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: event.key } })
      }
      
      // Handle operator keys
      if (event.key === '+') {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '+' } })
      }
      if (event.key === '-') {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '−' } })
      }
      if (event.key === '*') {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '×' } })
      }
      if (event.key === '/') {
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '/' } })
      }
      
      if (event.key === '.') {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '.' } })
      }
      
      if (event.key === '=' || event.key === 'Enter') {
        dispatch({ type: ACTIONS.EVALUATE })
      }
      
      if (event.key === 'Escape') {
        dispatch({ type: ACTIONS.CLEAR })
      }
      
      if (event.key === 'Backspace') {
        dispatch({ type: ACTIONS.DELETE_DIGIT })
      }
    }

    document.addEventListener('keydown', handleKeydown)
    
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [dispatch])

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="calculator-container">
        <div className="calculator-grid">
          <div className="calculator-header">
            <h1 className="text-primary mb-0">React Calculator</h1>
          </div>

          <div id="display" className="calculator-output">
            <div className="previous-operand">
              {formatOperand(previousOperand)} {operation}
            </div>
            <div className="current-operand">
              {formatOperand(currentOperand) || "0"}
            </div>
          </div>

          <button 
            id="clear" 
            className="calculator-button btn-ac btn-function"
            onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          >
            AC
          </button>
          
          <button 
            className="calculator-button btn-del btn-function"
            onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
          >
            DEL
          </button>
          
          <button 
            id="divide" 
            className="calculator-button btn-operator"
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "/" } })}
          >
            /
          </button>
          
          <button 
            id="seven" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "7" } })}
          >
            7
          </button>

          <button 
            id="eight" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "8" } })}
          >
            8
          </button>

          <button 
            id="nine" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "9" } })}
          >
            9
          </button>

          <button 
            id="multiply" 
            className="calculator-button btn-operator"
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "×" } })}
          >
            ×
          </button>

          <button 
            id="four" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "4" } })}
          >
            4
          </button>

          <button 
            id="five" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "5" } })}
          >
            5
          </button>

          <button 
            id="six" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "6" } })}
          >
            6
          </button>

          <button 
            id="add" 
            className="calculator-button btn-operator"
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "+" } })}
          >
            +
          </button>

          <button 
            id="one" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "1" } })}
          >
            1
          </button>

          <button 
            id="two" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "2" } })}
          >
            2
          </button>

          <button 
            id="three" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "3" } })}
          >
            3
          </button>

          <button 
            id="subtract" 
            className="calculator-button btn-operator"
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "−" } })}
          >
            −
          </button>

          <button 
            id="decimal" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "." } })}
          >
            .
          </button>

          <button 
            id="zero" 
            className="calculator-button btn-number"
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "0" } })}
          >
            0
          </button>
          
          <button 
            id="equals" 
            className="calculator-button btn-equals btn-equals-special"
            onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          >
            =
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text- text-center py-3 mt-auto w-100">
        <div className="container">
          <p className="mb-0">
            Volodymyr Hrehul | React + Bootstrap
            <a href="https://github.com/Premisterio" className="github-text ms-2 text-decoration-none">
              <span>View on GitHub </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github mb-1" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);