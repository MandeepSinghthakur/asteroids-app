import React, { useRef } from 'react';
import { Text} from '@react-three/drei';
import {  useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Asteroid = ({ position, data, color, setHoveredAsteroid }) => {
    const meshRef = useRef();
    const textRef = useRef();
  
    useFrame(() => {
      if (meshRef.current && textRef.current) {
        meshRef.current.position.copy(position);
        // Smoothly update the text position along with the asteroid
        textRef.current.position.copy(position).add(new THREE.Vector3(0.1, 0.1, 0));  // Offset from asteroid
      }
    });
  
    return (
      <>
      <mesh 
            ref={meshRef}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredAsteroid(data);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setHoveredAsteroid(data);
            }}
            onPointerOut={() => setHoveredAsteroid(null)}
            onTouchStart={(e) => {
              e.stopPropagation();
              setHoveredAsteroid(data);
            }}
            onTouchEnd={() => setHoveredAsteroid(null)}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        {/* Display asteroid name, updating position along with the asteroid */}
        <Text
          ref={textRef}
          color="white"
          fontSize={0.1}
          anchorX="left"
          anchorY="middle"
        >
          {data.name}
        </Text>
      </>
    );
}

export default Asteroid