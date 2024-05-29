import React, { useState, useEffect } from 'react';

const TimeInCities = () => {
  const cities = [
    { name: 'New York', timezone: 'America/New_York' },
    { name: 'London', timezone: 'Europe/London' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo' },
    { name: 'Sydney', timezone: 'Australia/Sydney' },
  ];

  const [times, setTimes] = useState({});

  const updateTimes = () => {
    const newTimes = {};
    cities.forEach(city => {
      newTimes[city.name] = new Date().toLocaleString('en-US', { timeZone: city.timezone });
    });
    setTimes(newTimes);
  };

  useEffect(() => {
    updateTimes();
    const intervalId = setInterval(updateTimes, 1000);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      {cities.map(city => (
        <div key={city.name}>
          <h3>{city.name}</h3>
          <p>{times[city.name]}</p>
        </div>
      ))}
    </div>
  );
};

export default TimeInCities;
