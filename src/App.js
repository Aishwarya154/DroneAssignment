import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const DroneSimulator = () => {
  // State variables for user's input values
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [time, setTime] = useState('');
  const [drones, setDrones] = useState([{ lat: 0, lng: 0 }]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState(null);
  const [progress, setProgress] = useState(0); // Track the simulation progress

  // interval when the component unmounts
  useEffect(() => {
    return () => {
      clearInterval(simulationInterval);
    };
  }, [simulationInterval]);

  // Function to add a new drone
  const addNewDrone = () => {
    setDrones([...drones, { lat: 0, lng: 0 }]);
  };

  // Function to remove a drone 
  const removeDrone = (index) => {
    const updatedDrones = [...drones];
    updatedDrones.splice(index, 1);
    setDrones(updatedDrones);
  };

  // Function to start the simulation
  const startSimulation = () => {
    setIsSimulating(true);
    const totalTime = parseInt(time, 10);
    let elapsedTime = 0;

    // Clear any existing simulation interval
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }

    // Set an interval to simulate drone movement
    setSimulationInterval(
      setInterval(() => {
        elapsedTime += 1;
        setProgress((elapsedTime / totalTime) * 100); // Update progress bar

        // Update drone positions
        setDrones((prevDrones) =>
          prevDrones.map((drone) => ({
            lat: drone.lat + (parseFloat(latitude) - drone.lat) / totalTime,
            lng: drone.lng + (parseFloat(longitude) - drone.lng) / totalTime,
          }))
        );

        // Stop the simulation when the total time has been reached
        if (elapsedTime >= totalTime) {
          clearInterval(simulationInterval);
          setIsSimulating(false);
        }
      }, 1000)
    );
  };

  // Function to pause the simulation
  const pauseSimulation = () => {
    clearInterval(simulationInterval);
    setSimulationInterval(null);
    setIsSimulating(false);
  };

  // Function to resume the simulation
  const resumeSimulation = () => {
    startSimulation();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Drone Simulator</h2>
      
      {/* Google Map component for displaying drones */}
      <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCG4zwE25wb_WbFv30nwOw6UrF7A8AC4vU' }}
          defaultCenter={{ lat: 0, lng: 0 }}
          defaultZoom={2}
        >
          {drones.map((drone, index) => (
            <div key={index} lat={drone.lat} lng={drone.lng}>
              {/* Drone icon  */}
              🛸
            </div>
          ))}
        </GoogleMapReact>
      </div>

      {/* Progress bar to show simulation progress */}
      <div style={{ marginBottom: '10px' }}>
        <progress value={progress} max="100" style={{ width: '100%' }}></progress>
      </div>

      {/* Input fields for simulation parameters */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude"
          style={{ width: '30%', marginRight: '10px', padding: '8px' }}
        />
        <input
          type="text"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude"
          style={{ width: '30%', marginRight: '10px', padding: '8px' }}
        />
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time (in seconds)"
          style={{ width: '30%', padding: '8px' }}
        />
      </div>

      {/* Control buttons for simulation */}
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={startSimulation}
          disabled={isSimulating || !latitude || !longitude || !time}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: 'green', color: 'white' }}
        >
          Start Simulation
        </button>
        
        {/* Pause and Resume buttons when simulation is active */}
        {isSimulating && (
          <>
            <button
              onClick={pauseSimulation}
              style={{ marginRight: '10px', padding: '10px', backgroundColor: 'orange', color: 'white' }}
            >
              Pause
            </button>
            <button
              onClick={resumeSimulation}
              style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}
            >
              Resume
            </button>
          </>
        )}
      </div>

      {/* Drone management buttons */}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={addNewDrone}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: 'purple', color: 'white' }}
        >
          Add Drone
          </button>
        {drones.length > 1 && (
          <button
            onClick={() => removeDrone(drones.length - 1)}
            style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}
          >
            Remove Drone
          </button>
        )}
      </div>
    </div>
  );
};

export default DroneSimulator;

