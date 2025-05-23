import React, { useCallback } from 'react';
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";

interface ParticleBackgroundProps {
  variant?: 'default' | 'dense' | 'minimal';
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ variant = 'default' }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const getParticlesConfig = () => {
    const baseConfig = {
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            lineLinked: {
              opacity: 0.5,
            },
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.2,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    };

    switch (variant) {
      case 'dense':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            number: {
              ...baseConfig.particles.number,
              value: 160,
            },
            opacity: {
              value: 0.3,
            },
          },
        };
      case 'minimal':
        return {
          ...baseConfig,
          particles: {
            ...baseConfig.particles,
            number: {
              ...baseConfig.particles.number,
              value: 40,
            },
            opacity: {
              value: 0.1,
            },
            move: {
              ...baseConfig.particles.move,
              speed: 0.5,
            },
          },
        };
      default:
        return baseConfig;
    }
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={getParticlesConfig() as any}
      className="absolute inset-0"
    />
  );
};

export default ParticleBackground;