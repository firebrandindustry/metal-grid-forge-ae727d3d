
import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
};

const ParticleEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  // Define colors that match our metal theme
  const colors = ['#C0C0C0', '#FFD700', '#E5E4E2', '#B87333'];
  
  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Create initial particles
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 40; i++) {
        addParticle();
      }
    };
    
    // Add a single particle
    const addParticle = () => {
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: Math.random() * 100 + 100,
      };
      particlesRef.current.push(particle);
    };
    
    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life += 1;
        
        // Remove particles that are out of bounds or expired
        if (
          particle.x < 0 || 
          particle.x > canvas.width || 
          particle.y < 0 || 
          particle.y > canvas.height ||
          particle.life > particle.maxLife
        ) {
          particlesRef.current.splice(index, 1);
          addParticle();
          return;
        }
        
        // Calculate fade based on life
        const fade = 
          particle.life < 20 
            ? particle.life / 20 
            : particle.life > particle.maxLife - 20 
              ? (particle.maxLife - particle.life) / 20 
              : 1;
        
        // Draw particle
        ctx.globalAlpha = particle.opacity * fade;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Ensure we maintain around 40 particles
      while (particlesRef.current.length < 40) {
        addParticle();
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="particles fixed inset-0 pointer-events-none opacity-50"
    />
  );
};

export default ParticleEffect;
