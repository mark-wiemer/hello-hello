import { useCounter } from './hooks/useCounter';
import './App.css';

function App() {
    const { count, increment } = useCounter();

    return (
        <>
            <h1>Hello Vite + React + TypeScript!</h1>
            <p>
                <button type="button" onClick={increment}>
                    Count is: {count}
                </button>
            </p>
            <p>
                Edit <code>App.tsx</code> and save to test HMR updates.
            </p>
            <p>
                <a
                    className="App-link"
                    href="https://vite.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Vite docs
                </a>
                {' | '}
                <a
                    className="App-link"
                    href="https://react.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    React docs
                </a>
                {' | '}
                <a
                    className="App-link"
                    href="https://typescriptlang.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    TypeScript docs
                </a>
            </p>
        </>
    );
}

export default App;
