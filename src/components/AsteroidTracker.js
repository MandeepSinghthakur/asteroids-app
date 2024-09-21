import React, { useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars} from '@react-three/drei';
import * as THREE from 'three';
import { differenceInSeconds } from 'date-fns';
import { fetchAsteroidData } from '../api/nasaApi';
import Earth from './Earth';  
import AsteroidOrbit from './AsteriodOrbit';
import Asteroid from './Asteriod';

const Scene = ({ asteroids, setHoveredAsteroid, isMoving, showOrbits}) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 10);
  }, [camera]);

  useFrame(({ clock }) => {
    if (isMoving) {
      asteroids.forEach((asteroid) => {
        const time = clock.getElapsedTime() * 0.01;  // Scale down time to slow the asteroid
        const theta = time + asteroid.orbitOffset;
        const r = asteroid.orbit.semiMajorAxis * (1 - asteroid.orbit.eccentricity * asteroid.orbit.eccentricity) / 
                  (1 + asteroid.orbit.eccentricity * Math.cos(theta));
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta) * Math.sin(asteroid.orbit.inclination);
        const z = r * Math.sin(theta) * Math.cos(asteroid.orbit.inclination);
        asteroid.position.set(x, y, z);
      });
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1} />
      <Earth />
      {asteroids.map((asteroid, index) => (
        <React.Fragment key={asteroid.id}>
          <Asteroid 
            position={asteroid.position} 
            data={asteroid}
            setHoveredAsteroid={setHoveredAsteroid}
            color={asteroid.color}  // Use random color for asteroid
          />
        {showOrbits && (  <AsteroidOrbit 
            color={`hsl(${index * 36}, 100%, 50%)`}
            semiMajorAxis={asteroid.orbit.semiMajorAxis}
            eccentricity={asteroid.orbit.eccentricity}
            inclination={asteroid.orbit.inclination}
            />
       ) }
        </React.Fragment>
      ))}
      <Stars />
      <OrbitControls />
    </>
  );
};

const AsteroidTracker = () => {
 const [showOrbits, setShowOrbits] = useState(true);
  const [asteroids, setAsteroids] = useState([]);
  const [hoveredAsteroid, setHoveredAsteroid] = useState(null);
  const [error, setError] = useState(null);
  const [isMoving, setIsMoving] = useState(true); // State to control motion

  useEffect(() => {
    const getAsteroidData = async () => {
      try {
        const data = await fetchAsteroidData();
        const earthCircumference = 40075; // in kilometers
        const processedData = data.map((asteroid) => {
          const velocityKms = parseFloat(asteroid.velocity);
          const velocityRelativeToEarthOrbit = (velocityKms / earthCircumference).toFixed(6);

          return {
            ...asteroid,
            position: new THREE.Vector3(),
            orbit: {
              semiMajorAxis: parseFloat(asteroid.orbitData.semiMajorAxis) || (2 + Math.random() * 3),
              eccentricity: parseFloat(asteroid.orbitData.eccentricity) || (Math.random() * 0.5),
              inclination: (Math.random() - 0.5) * Math.PI / 6, // Random inclination between -15 and 15 degrees
            },
            orbitOffset: Math.random() * Math.PI * 2, // Random starting position in orbit
            velocity: velocityRelativeToEarthOrbit,  // Adjusted velocity for Earth's orbit
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,  // Random color for each asteroid
          };
        });
        setAsteroids(processedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching asteroid data:', error);
        setError('Failed to fetch asteroid data. Please try again later.');
      }
    };

    getAsteroidData();
    const interval = setInterval(getAsteroidData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const toggleMotion = () => {
    setIsMoving((prev) => !prev);
  };

  const getTimeUntilOrbit = (asteroid) => {
    if (!asteroid) return 'N/A';
    const orbitDate = new Date(asteroid.closeApproachDate);
    const seconds = differenceInSeconds(orbitDate, new Date());
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
    <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1,
        display: 'flex',
        gap: '5px' 
        }}>
  <button 
    onClick={toggleMotion}
    style={{
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}
  >
    {isMoving ? 'Stop Motion' : 'Start Motion'}
  </button>

  <button 
    onClick={() => setShowOrbits(!showOrbits)}
    style={{
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}
  >
    {showOrbits ? 'Hide Orbits' : 'Show Orbits'}
  </button>
</div>

      
      <Canvas style={{ background: '#000' }}>
        <Scene asteroids={asteroids} setHoveredAsteroid={setHoveredAsteroid} isMoving={isMoving} showOrbits={showOrbits} />
      </Canvas>

      {hoveredAsteroid && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '10px',
          borderRadius: '5px',
          maxWidth: '300px'
        }}>
          <h2 style={{ margin: '0 0 10px 0' }}>{hoveredAsteroid.name}</h2>
          <p>Velocity: {hoveredAsteroid.velocity} km/s</p> {/* Adjusted unit */}
          <p>Distance: {hoveredAsteroid.distance} km</p>
          <p>Estimated Diameter: {
            hoveredAsteroid.estimatedDiameter.min.toFixed(2)} - {
            hoveredAsteroid.estimatedDiameter.max.toFixed(2)} km
          </p>
          <p>Potentially Hazardous: {hoveredAsteroid.isPotentiallyHazardous ? 'Yes' : 'No'}</p>
          <p>Time Until Closest Approach: {getTimeUntilOrbit(hoveredAsteroid)}</p>
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px'
        }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AsteroidTracker;
