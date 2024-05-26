import React, { useState, useEffect } from "react";

type TimeZoneDisplayProps = {
    timeZone: string;
};

const TimeZoneDisplay = ({ timeZone }: TimeZoneDisplayProps) => {
    const [dateTime, setDateTime] = useState(
        getFormattedDateTime(timeZone)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(getFormattedDateTime(timeZone));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeZone]);

    const city = formatTimeZone(timeZone);

    return (
        <div style={{ textAlign: "center", color: "#D1D3D9" }}>
            <h3>{city}</h3>
            <p>{dateTime}</p>
        </div>
    );
};

const getFormattedDateTime = (timeZone) => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { timeZone, weekday: 'long' });
    const time = now.toLocaleTimeString("en-US", { timeZone });
    return `${day}, ${time}`;
};

const formatTimeZone = (timeZone) => {
    const city = timeZone.split("/")[1].replace("_", " ");
    return city;
};

export default TimeZoneDisplay;