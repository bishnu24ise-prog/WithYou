import {
  CameraControls,
  ContactShadows,
  Environment,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";

const Dots = (props) => {
  const { loading } = useChat();
  const groupRef = useRef();

  useFrame((state) => {
    if (loading && groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = 1.76 + Math.sin(t * 3.5) * 0.02;
    }
  });

  if (!loading) return null;
  return (
    <group ref={groupRef} {...props}>
      <mesh position={[-0.04, 0, 0]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.04, 0, 0]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();

  const updateCameraPosition = (smooth = true) => {
    if (!cameraControls.current) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (cameraZoomed) {
      if (isMobile) {
        cameraControls.current.setLookAt(0, 1.42, 2.1, 0, 1.42, 0, smooth);
      } else {
        cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, smooth);
      }
    } else {
      if (isMobile) {
        cameraControls.current.setLookAt(0, 2.0, 5.8, 0, 1.1, 0, smooth);
      } else {
        cameraControls.current.setLookAt(0, 2.2, 5.0, 0, 1.0, 0, smooth);
      }
    }
  };

  useEffect(() => {
    updateCameraPosition(false);
  }, []);

  useEffect(() => {
    updateCameraPosition(true);
  }, [cameraZoomed]);

  useEffect(() => {
    const handleResize = () => updateCameraPosition(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cameraZoomed]);
  return (
    <>
      <CameraControls ref={cameraControls} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={1.8} castShadow />
      <directionalLight position={[5, 5, -5]} intensity={1.0} />
      <directionalLight position={[0, -2, 2]} intensity={0.5} />
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>
      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense fallback={null}>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
      <Suspense fallback={null}>
        <Avatar />
      </Suspense>
      <ContactShadows opacity={0.7} />
    </>
  );
};
