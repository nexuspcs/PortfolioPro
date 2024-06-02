import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const defaultCities = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
];

const TimeInCities = () => {
  const [cities, setCities] = useState(() => {
    const savedCities = localStorage.getItem('cities');
    return savedCities ? JSON.parse(savedCities) : defaultCities;
  });

  const [times, setTimes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCityIndex, setSelectedCityIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const formatTimezone = (timezone) => {
    if (timezone.startsWith('Etc/')) {
      return timezone.replace('Etc/', '');
    }
    const parts = timezone.split('/');
    if (parts.length === 2) {
      return `${parts[1].replace('_', ' ')}, ${parts[0]}`;
    } else if (parts.length > 2) {
      const city = parts.slice(2).join(' ').replace('_', ' ');
      return `${city}, ${parts[1]}, ${parts[0]}`;
    }
    return timezone.replace('_', ' ');
  };

  const updateTimes = () => {
    const newTimes = {};
    cities.forEach(city => {
      newTimes[city.timezone] = moment().tz(city.timezone).format('Do MMMM YYYY, hh:mm:ss A');
    });
    setTimes(newTimes);
  };

  useEffect(() => {
    updateTimes();
    const intervalId = setInterval(updateTimes, 1000);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  useEffect(() => {
    localStorage.setItem('cities', JSON.stringify(cities));
  }, [cities]);

  const openModal = (index = null) => {
    setSelectedCityIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearch('');
    setSuggestions([]);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      const filteredSuggestions = moment.tz.names().filter(tz =>
        tz.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleCityChange = (timezone) => {
    const newCities = [...cities];
    if (selectedCityIndex !== null) {
      newCities[selectedCityIndex] = { name: formatTimezone(timezone), timezone: timezone };
    } else {
      newCities.push({ name: formatTimezone(timezone), timezone: timezone });
    }
    setCities(newCities);
    closeModal();
  };

  const removeCity = (index) => {
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
  };

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
      justifyContent: 'space-between',
      flexDirection: 'column',
      position: 'relative',
      cursor: 'pointer',
      width: '250px', // Ensure consistent width for all time containers
    },
    header: {
      margin: 0,
    },
    paragraph: {
      margin: 0,
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      background: '#fff',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    input: {
      display: 'block',
      margin: '15px 0',
      padding: '15px',
      width: '100%',
      boxSizing: 'border-box',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
    },
    button: {
      margin: '15px',
      padding: '15px 30px',
      cursor: 'pointer',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'background-color 0.3s ease',
      fontFamily: "'Inter', sans-serif",
    },
    addButton: {
      backgroundColor: '#4CAF50',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#fff',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      transition: 'background-color 0.3s ease',
      marginTop: '20px',
    },
    removeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#fff',
      fontSize: '20px',
      cursor: 'pointer',
    },
    suggestionList: {
      listStyleType: 'none',
      padding: 0,
      margin: '10px 0 0 0',
      maxHeight: '200px',
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: '#000',
    },
    suggestionItem: {
      padding: '10px',
      cursor: 'pointer',
    },
    suggestionItemHovered: {
      backgroundColor: '#f0f0f0',
    },
  };

  return (
    <div style={styles.container}>
      <h2>World Clock</h2>
      {cities.map((city, index) => (
        <div key={city.name} style={styles.timeContainer} onClick={() => openModal(index)}>
          <button
            style={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation();
              removeCity(index);
            }}
          >
            &times;
          </button>
          <h3 style={styles.header}>{city.name}</h3>
          <p style={styles.paragraph}>{times[city.timezone]}</p>
        </div>
      ))}
      <div style={styles.addButton} onClick={() => openModal()}>
        +
      </div>
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{selectedCityIndex !== null ? 'Change City' : 'Add City'}</h3>
            <input
              type="text"
              placeholder="Enter city name or timezone"
              value={search}
              onChange={handleSearchChange}
              style={styles.input}
            />
            <ul style={styles.suggestionList}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  style={styles.suggestionItem}
                  onMouseDown={() => handleCityChange(suggestion)}
                >
                  {formatTimezone(suggestion)}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} style={styles.button}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInCities;
