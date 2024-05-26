import React, { useState, useEffect } from "react";

type TimeZoneDisplayProps = {
  timeZone: string;
};

const TimeZoneDisplay = ({ timeZone }: TimeZoneDisplayProps) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-US", { timeZone }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { timeZone }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeZone]);

  return (
    <div style={{ padding: '10px', textAlign: 'center', border: '1px solid #333', borderRadius: '5px' }}>
      <h3>{timeZone}</h3>
      <p>{time}</p>
    </div>
  );
};

export default TimeZoneDisplay;