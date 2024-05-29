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

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px',
      color: '#fff',
       
      boxSizing: 'border-box',
    },
    timeContainer: {
      backgroundColor: '#28282D',
      borderRadius: '8px',
      padding: '20px',
      color: 'white',
      margin: '10px 0',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    header: {
      margin: 0,
    },
    paragraph: {
      margin: 0,
    },
  };

  return (
    <div style={styles.container}>
      {cities.map(city => (
        <div key={city.name} style={styles.timeContainer}>
          <h3 style={styles.header}>{city.name}</h3>
          <p style={styles.paragraph}>{times[city.name]}</p>
        </div>
      ))}
    </div>
  );
};

export default TimeInCities;