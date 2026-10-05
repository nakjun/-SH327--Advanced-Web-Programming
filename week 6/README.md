# 두 번째 예제: Timer

## App.jsx: 조건부 렌더링

```jsx
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
```

`showTimer`가 `true`일 때만 `<Timer />`가 렌더링됩니다. 표시하면 Timer가 Mount되어 State와 Effect가 시작되고, 숨기면 Unmount되어 두 Effect의 Cleanup Function이 실행됩니다. 실행 중 숨겨도 `clearInterval()`이 호출되어 interval이 남지 않습니다. 다시 표시하면 새 Timer가 Mount되어 0초, Paused 상태로 시작합니다.

## Timer.jsx

```jsx
import { useEffect, useState } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [targetInput, setTargetInput] = useState('');

  const targetSeconds = Number(targetInput);
  const hasTarget = targetInput !== '' && Number.isFinite(targetSeconds) && targetSeconds > 0;
  const goalReached = hasTarget && seconds >= targetSeconds;

  // 컴포넌트의 Mount/Unmount만 관찰합니다.
  useEffect(() => {
    console.log('Timer Mounted');

    return () => console.log('Timer Unmounted');
  }, []);

  // 실행 상태에 맞춰 interval을 생성하거나 정리합니다.
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setSeconds(prev => Math.round((prev + 0.1) * 10) / 10);
    }, 100);

    // 실행 상태가 바뀌거나 컴포넌트가 사라질 때 기존 Timer를 정리합니다.
    return () => clearInterval(intervalId);
  }, [isRunning]);

  // 경과 시간이 목표에 도달하면 실행을 멈춥니다.
  useEffect(() => {
    if (isRunning && goalReached) {
      setIsRunning(false);
    }
  }, [isRunning, goalReached]);

  function handleStart() {
    if (!goalReached) setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setSeconds(0);
  }

  function handleLap() {
    setLaps(previous => [...previous, seconds]);
  }

  // State가 바뀌면 React가 Timer를 다시 렌더링해 새 JSX를 계산하므로 상태 표시가 갱신됩니다.
  return (
    <section>
      <p>현재 시간: {seconds.toFixed(1)}초</p>
      <p>상태: {isRunning ? 'Running' : 'Paused'}</p>
      <button type="button" onClick={handleStart}>Start</button>
      <button type="button" onClick={handlePause}>Pause</button>
      <button type="button" onClick={handleReset}>Reset</button>
      <button type="button" onClick={handleLap}>Lap</button>
      <div>
        <label htmlFor="target-seconds">목표 시간 (초): </label>
        <input
          id="target-seconds"
          type="number"
          min="0.1"
          step="0.1"
          value={targetInput}
          onChange={(event) => setTargetInput(event.target.value)}
        />
      </div>
      {goalReached && <p role="status">목표 시간 도달</p>}
      <h2>Lap 기록</h2>
      <ol>
        {laps.map((lap, index) => <li key={index}>{lap.toFixed(1)}초</li>)}
      </ol>
    </section>
  );
}
```

`seconds`는 시간이 흐르면 값이 바뀌고, 바뀐 값을 화면에 다시 표시해야 하므로 State입니다. Start를 누르면 0.1초마다 0.1씩 증가하고, Pause를 누르면 멈춥니다. 실수 연산의 오차가 누적되지 않도록 증가할 때 소수 첫째 자리로 반올림하며, 화면에도 한 자리까지 표시합니다.

`seconds`는 화면에 표시할 경과 시간이고, `isRunning`은 시간이 증가하는 중인지 나타내는 실행 상태입니다. Reset은 `seconds`만 0으로 바꾸므로 실행 중에 눌러도 `isRunning`은 그대로 유지되고 다음 1초부터 다시 증가합니다.

Reset은 버튼 클릭이라는 사용자 이벤트에 바로 반응하는 동작이므로 `handleReset`에서 처리합니다. Effect는 `isRunning`에 따라 interval을 만들고 정리하는 역할입니다. Reset을 Effect에 넣으면 클릭과 무관한 Effect 실행 시점에 시간이 초기화될 수 있습니다.

Dependency Array가 `[isRunning]`인 이유는 interval의 생성과 정리가 실행 상태에만 달려 있기 때문입니다. `isRunning`이 바뀌면 이전 Effect의 Cleanup Function이 기존 interval을 해제한 뒤 새 Effect가 실행됩니다. `seconds`는 Functional Update로 최신 값을 받아 증가시키므로 의존성에 넣을 필요가 없습니다.

Mount/Unmount 관찰용 Effect는 `[]`를 사용해 컴포넌트가 마운트될 때 로그를 남기고 언마운트될 때 Cleanup 로그를 남깁니다. Timer Effect는 `[isRunning]`에 따라 interval의 시작과 정리를 담당합니다. Pause는 컴포넌트를 언마운트하지 않으므로 `Timer Unmounted`를 출력하지 않습니다. 개발 모드의 `StrictMode`에서는 React가 Effect의 정리 과정을 확인하기 위해 처음에 Mounted → Unmounted → Mounted 로그를 출력할 수 있습니다.

Lap 버튼은 클릭 당시의 `seconds`를 `laps` 배열 State에 추가하며, 기록을 소수 첫째 자리까지 순서대로 보여 줍니다. 목표 시간은 0보다 큰 실수(초)를 입력할 수 있으며 입력 단위는 0.1초입니다. 시간이 목표 이상에 도달하면 `목표 시간 도달`을 표시하고 `isRunning`을 `false`로 바꿔 자동으로 멈춥니다. Reset은 기존 동작처럼 `seconds`만 0으로 바꾸며 Lap 기록과 목표 입력은 유지합니다.

실행하려면 이 폴더에서 `npm install` 후 `npm run dev`를 입력하세요.
