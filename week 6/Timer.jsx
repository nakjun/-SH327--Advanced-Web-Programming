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
