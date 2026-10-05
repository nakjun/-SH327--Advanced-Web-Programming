import { useState } from 'react';
import Timer from './Timer';

export default function App() {
  const [showTimer, setShowTimer] = useState(true);

  function handleToggleTimer() {
    setShowTimer(previous => !previous);
  }

  return (
    <main>
      <h1>Timer</h1>
      <button type="button" onClick={handleToggleTimer}>
        {showTimer ? 'Timer 숨기기' : 'Timer 표시'}
      </button>
      {showTimer && <Timer />}
    </main>
  );
}
