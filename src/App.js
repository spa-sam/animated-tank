import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import "./App.css";

function App() {
  const [fillLevel, setFillLevel] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [isFilling, setIsFilling] = useState(false);
  const [isDraining, setIsDraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const waterProps = useSpring({
    height: `${fillLevel}%`,
    config: { tension: 300, friction: 20 },
  });

  useEffect(() => {
    let interval;
    if ((isFilling || isDraining) && !isPaused) {
      interval = setInterval(() => {
        setFillLevel((prevLevel) => {
          if (isFilling && prevLevel < 100) {
            const newLevel = prevLevel + 1;
            if (newLevel % 5 === 0) {
              setBubbles((prevBubbles) => [...prevBubbles, createBubble()]);
            }
            return newLevel;
          } else if (isDraining && prevLevel > 0) {
            return prevLevel - 1;
          }
          setIsFilling(false);
          setIsDraining(false);
          return prevLevel;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isFilling, isDraining, isPaused]);

  const createBubble = () => {
    const size = 3 + Math.random() * 7;
    return {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${15 + Math.random() * 20}s`,
      width: `${size}px`,
      height: `${size}px`,
    };
  };

  const handleFill = () => {
    setIsFilling(true);
    setIsDraining(false);
  };

  const handleDrain = () => {
    setIsDraining(true);
    setIsFilling(false);
  };

  const handleRandomFill = () => {
    const randomLevel = Math.floor(Math.random() * 101);
    setFillLevel(randomLevel);
    setBubbles(
      Array.from({ length: Math.floor(randomLevel / 5) }, createBubble)
    );
  };

  return (
    <div className="App">
      <div className="tank">
        <animated.div className="water" style={waterProps}>
          {bubbles.map((bubble, index) => (
            <div key={index} className="bubble" style={bubble}></div>
          ))}
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </animated.div>
      </div>
      <p>Рівень заповнення: {fillLevel}%</p>
      <div className="controls">
        <button onClick={handleFill} disabled={isFilling || isPaused}>
          Заповнити
        </button>
        <button onClick={handleDrain} disabled={isDraining || isPaused}>
          Злити
        </button>
        <button onClick={handleRandomFill}>Випадкове заповнення</button>
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Відновити" : "Пауза"}
        </button>
      </div>
    </div>
  );
}

export default App;
