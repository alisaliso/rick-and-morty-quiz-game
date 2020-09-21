import React, { useState, useEffect } from "react";

// Add zero before number, if number less then 10, for correct time display.
const addZero = (number) => (number < 10 ? `0${number}` : number);

// Display timer
const Timer = ({ dispatch, initialTimeMs }) => {
  const [time, setTime] = useState(initialTimeMs);
  const [whenStartedTime, setWhenStartedTime] = useState(Date.now());

  useEffect(() => {
    const timerTimeout = setTimeout(() => {
      let currentMs = Date.now(); // Time of current inerval

      // Set time state (extract time difference between started time and interval current time from previous time state)
      setTime(initialTimeMs - (currentMs - whenStartedTime));
    }, 10);

    return () => {
      clearTimeout(timerTimeout);
    };
  });

  // Return timer
  if (time <= 0) {
    dispatch({ type: "END_GAME" });
    return <h1>time is up</h1>;
  } else {
    let res = time / 1000;
    return (
      <h1>
        {addZero(Math.floor(res.toPrecision() / 60))}:
        {addZero(Math.floor(res.toPrecision()) % 60)}
      </h1>
    );
  }
};

export default Timer;
