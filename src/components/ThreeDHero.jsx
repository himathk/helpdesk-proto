
import { Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, OrbitControls, Float } from '@react-three/drei';

const AnimatedBoy = (props) => {
  const { scene, animations } = useGLTF('/boy-character-1.glb');
  const { actions } = useAnimations(animations, scene);
  
  // Play the first animation found
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
        // Play the first animation key
        const firstAction = Object.keys(actions)[0];
        console.log("Playing animation:", firstAction);
        actions[firstAction].reset().fadeIn(0.5).play();
    } else {
        console.log("No animations found in boy-character-1.glb");
    }
  }, [actions]);

  return <primitive object={scene} {...props} />;
}

const HouseModel = (props) => {
  const { scene } = useGLTF('/house-insurance-icon.glb');
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clone} {...props} />;
}

const OrbitingHouses = ({ position = [0, 0, 0] }) => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.5; // Speed
    const radius = 1.3;

    // Calculate positions manually so objects don't rotate with the group (Ferris Wheel effect)
    if (ref1.current) {
        ref1.current.position.x = Math.cos(t) * radius;
        ref1.current.position.z = Math.sin(t) * radius;
    }
    if (ref2.current) {
        // Offset by 1/3 circle (2 * PI / 3 approx 2.09)
        ref2.current.position.x = Math.cos(t + 2.09) * radius;
        ref2.current.position.z = Math.sin(t + 2.09) * radius;
    }
    if (ref3.current) {
         // Offset by 2/3 circle (4 * PI / 3 approx 4.18)
        ref3.current.position.x = Math.cos(t + 4.18) * radius;
        ref3.current.position.z = Math.sin(t + 4.18) * radius;
    }
  });

  return (
    <group position={position}>
      <group ref={ref1}>
         <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <HouseModel scale={0.8} />
         </Float>
      </group>
      <group ref={ref2}>
         <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <HouseModel scale={0.8} />
         </Float>
      </group>
      <group ref={ref3}>
         <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <HouseModel scale={0.8} />
         </Float>
      </group>
    </group>
  );
};

const ThreeDHero = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        Main Ambient Light
        <ambientLight intensity={1.5} />

        {/* Key Light (Front Right) */}
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.5} 
          penumbra={1} 
          intensity={3} 
          castShadow 
        />

        {/* Fill Light (Front Left) */}
        <pointLight position={[-5, 5, 5]} intensity={2} />

        {/* Rim Light (Back) */}
        <spotLight position={[0, 10, -10]} intensity={1} color="#ffffff" />
        
        <Suspense fallback={null}>
            <AnimatedBoy position={[0, -7, 0]} scale={5} />
            
            {/* Orbiting Houses around the head position (lowered to y=0.5) */}
            <OrbitingHouses position={[0, 0.5, 0]} />

            <Environment preset="city" />
        </Suspense>
        
         <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
};

// Preload the models
useGLTF.preload('/boy-character-1.glb');
useGLTF.preload('/house-insurance-icon.glb');

export default ThreeDHero;
