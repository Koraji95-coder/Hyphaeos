import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { extend, Canvas, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

interface MyceliumBackgroundProps {
  cursorPosition: { x: number; y: number };
}

const MyceliumMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uPulse: 0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uPulse;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    #define NUM_LAYERS 10.0
    #define SPORE_COUNT 32.0

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.0;
      
      for (float i = 0.0; i < NUM_LAYERS; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    float spores(vec2 st) {
      float cells = SPORE_COUNT;
      vec2 fpos = fract(st * cells);
      float d = distance(fpos, vec2(0.5));
      float t = uTime * 0.5;
      
      float spore = smoothstep(0.2 + sin(t) * 0.1, 0.0, d);
      float movement = sin(st.x * 10.0 + t) * cos(st.y * 10.0 + t) * 0.2;
      
      return spore * movement;
    }

    void main() {
      vec2 st = vUv;
      vec2 mousePos = uMouse;
      
      // Distance from center for brain pulse
      vec2 center = vec2(0.5);
      float distFromCenter = length(st - center);
      float brainPulse = sin(uTime * 0.5) * 0.5 + 0.5;
      float brainGlow = smoothstep(0.8, 0.0, distFromCenter) * brainPulse;
      
      // Mouse interaction
      float dist = length(st - mousePos);
      float strength = smoothstep(0.3, 0.0, dist);
      
      // Mycelium growth
      vec2 q = vec2(0.0);
      q.x = fbm(st + 0.15 * uTime);
      q.y = fbm(st + vec2(1.0));
      
      vec2 r = vec2(0.0);
      r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime);
      r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);
      
      float f = fbm(st + r);
      
      // Spore system
      float sporePattern = spores(st + vec2(uTime * 0.1));
      
      // Color mixing
      vec3 baseColor = mix(
        vec3(0.35, 0.2, 0.5),    // Dark purple
        vec3(0.42, 0.94, 0.0),   // Bright green
        clamp(f * f * 4.0, 0.0, 1.0)
      );
      
      baseColor = mix(
        baseColor,
        vec3(0.55, 0.31, 0.98),  // Bright purple
        clamp(length(q), 0.0, 1.0)
      );
      
      baseColor = mix(
        baseColor,
        vec3(0.0, 0.0, 0.0),     // Dark background
        clamp(length(r.x), 0.0, 1.0)
      );
      
      // Add effects
      baseColor += strength * vec3(0.42, 0.94, 0.0) * 0.4;  // Cursor glow
      baseColor += brainGlow * vec3(0.55, 0.31, 0.98) * 0.3;  // Brain pulse
      baseColor += sporePattern * vec3(0.42, 0.94, 0.0) * 0.2;  // Floating spores
      
      gl_FragColor = vec4(baseColor, 1.0);
    }
  `
);

extend({ MyceliumMaterial });

const MyceliumPlane: React.FC<{ cursorPosition: { x: number; y: number } }> = ({ cursorPosition }) => {
  const materialRef = useRef<any>();
  const pulseRef = useRef(0);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uMouse.set(cursorPosition.x, 1 - cursorPosition.y);
      
      // Smooth pulse animation
      pulseRef.current = Math.sin(state.clock.elapsedTime * 0.5) * 0.5 + 0.5;
      materialRef.current.uPulse = pulseRef.current;
    }
  });

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      {/* @ts-ignore */}
      <myceliumMaterial ref={materialRef} />
    </mesh>
  );
};

const MyceliumBackground: React.FC<MyceliumBackgroundProps> = ({ cursorPosition }) => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas>
        <MyceliumPlane cursorPosition={cursorPosition} />
      </Canvas>
    </div>
  );
};

export default MyceliumBackground;