import React, { useRef, useEffect } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ResponsiveOrthographicCameraProps {
  viewSize?: number; // Optional prop to control zoom level
}

const SimCamera: React.FC<ResponsiveOrthographicCameraProps> = ({ viewSize = 3 }) => {
  const cameraRef = useRef<THREE.OrthographicCamera>(null);

  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current) {
        const aspect = window.innerWidth / window.innerHeight;

        // Update the camera's frustum dimensions based on the aspect ratio
        cameraRef.current.left = -viewSize * aspect;
        cameraRef.current.right = viewSize * aspect;
        cameraRef.current.top = viewSize;
        cameraRef.current.bottom = -viewSize;

        // Apply the changes to the projection matrix
        cameraRef.current.updateProjectionMatrix();
      }
    };

    // Set initial dimensions
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [viewSize]);

  return <OrthographicCamera ref={cameraRef} makeDefault />;
};

export default SimCamera;
