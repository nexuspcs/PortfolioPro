import React from "react";

type TimeZoneDisplayProps = {
  timeZone: string;
};

const TimeZoneDisplay = ({ timeZone }: TimeZoneDisplayProps) => {
  const time = new Date().toLocaleTimeString("en-US", { timeZone });
  return (
    <div>
      <h3>{timeZone}</h3>
      <p>{time}</p>
    </div>
  );
};

export default TimeZoneDisplay;