import * as THREE from 'three';
import { Line } from '@react-three/drei';

const AsteroidOrbit = ({ semiMajorAxis, eccentricity, inclination, color }) => {
    const points = [];
    const segments = 128;
  
    // Generate points for the elliptical orbit
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(theta));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta) * Math.sin(inclination); 
      const z = r * Math.sin(theta) * Math.cos(inclination);
  
      points.push(new THREE.Vector3(x, y, z));
    }
  
    return (
      <Line
        points={points}        // Array of Vector3 points for the orbit
        color={color}          // Line color
        lineWidth={1}          // Width of the line
        dashed={true}         // Solid line (set to true for a dashed line)
        dashSize={0.1}  // Shorter dash size
        gapSize={0.05}  // Shorter gap between dashes
      />
    );
  };

  export default AsteroidOrbit