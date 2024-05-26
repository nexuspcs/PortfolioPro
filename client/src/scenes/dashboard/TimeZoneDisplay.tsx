import React, { useState, useEffect } from "react";

type TimeZoneDisplayProps = {
    timeZone: string;
};

const TimeZoneDisplay = ({ timeZone }: TimeZoneDisplayProps) => {
    const [time, setTime] = useState(
        new Date().toLocaleTimeString("en-US", { timeZone })
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString("en-US", { timeZone }));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeZone]);

    const city = formatTimeZone(timeZone);

    return (
        <div style={{ textAlign: "center" }}>
            <h3>{city}</h3>
            <p>{time}</p>
        </div>
    );
};

const formatTimeZone = (timeZone) => {
    const city = timeZone.split("/")[1].replace("_", " ");
    return city;
};

export default TimeZoneDisplay;
