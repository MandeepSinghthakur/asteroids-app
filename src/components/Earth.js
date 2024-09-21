import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// Earth texture SVG
const earthTextureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512">
  <rect width="1024" height="512" fill="#2B65EC" />
  <!-- Simplified continents -->
  <path d="M240,50 Q300,100 350,60 T450,80 T550,40 T650,90 T750,50 V250 Q690,220 650,260 T550,230 T450,270 T350,220 T250,260 V50 Z" fill="#228B22" />
  <path d="M100,280 Q150,250 200,290 T300,260 T400,300 T500,270 T600,310 V450 Q550,420 500,450 T400,420 T300,460 T200,430 T100,460 V280 Z" fill="#228B22" />
  <!-- Simplified ice caps -->
  <path d="M0,0 H1024 V100 Q950,120 900,80 T750,110 T600,70 T450,100 T300,60 T150,90 T0,50 Z" fill="#FFFFFF" />
  <path d="M0,512 H1024 V412 Q950,392 900,432 T750,402 T600,442 T450,412 T300,452 T150,422 T0,462 Z" fill="#FFFFFF" />
</svg>
`;

// Convert SVG to data URL
const svgToDataURL = (svg) => {
  const encodedSVG = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSVG}`;
};

const Earth = () => {
  const texture = useLoader(THREE.TextureLoader, svgToDataURL(earthTextureSvg));
  const meshRef = useRef();

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Earth;