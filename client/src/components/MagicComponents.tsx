import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Box, Card, Text, Group, Stack, ThemeIcon, Badge } from '@mantine/core';
import { IconSparkles, IconMagicWand, IconStars } from '@tabler/icons-react';

// Magic UI inspired animated gradient background
export function AnimatedGradientBg({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundPosition: "200% 0%",
        duration: 10,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  return (
    <Box
      ref={bgRef}
      className={className}
      style={{
        background: 'linear-gradient(-45deg, #FF5B00, #FCC201, #FF8A00, #FFD700, #FF5B00)',
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 8s ease infinite',
        position: 'relative'
      }}
    >
      {children}
    </Box>
  );
}

// Magic UI inspired shimmer effect
export function ShimmerCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shimmer = shimmerRef.current;
    if (shimmer) {
      gsap.set(shimmer, { x: "-100%" });
      gsap.to(shimmer, {
        x: "100%",
        duration: 2,
        repeat: -1,
        ease: "power2.inOut",
        delay: Math.random() * 2
      });
    }
  }, []);

  return (
    <Card
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 91, 0, 0.2)'
      }}
    >
      <Box
        ref={shimmerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      <Box style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Card>
  );
}

// Magic UI inspired floating particles
export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = Math.random() * 6 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.borderRadius = '50%';
      particle.style.background = `hsl(${30 + Math.random() * 30}, 70%, 60%)`;
      particle.style.opacity = '0.6';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      container.appendChild(particle);

      gsap.to(particle, {
        y: -100,
        x: Math.random() * 50 - 25,
        opacity: 0,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        delay: Math.random() * 2,
        ease: "power2.out"
      });
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
    />
  );
}

// Magic UI inspired morphing button
export function MorphingButton({ 
  children, 
  onClick, 
  variant = "gradient",
  ...props 
}: { 
  children: React.ReactNode, 
  onClick?: () => void,
  variant?: string,
  [key: string]: any 
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        rotate: 2,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)"
      });
    };

    const handleClick = () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      style={{
        background: variant === 'gradient' 
          ? 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
          : 'transparent',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 24px',
        color: 'white',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(255, 91, 0, 0.3)',
        transition: 'all 0.3s ease',
        ...props.style
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Magic UI inspired glowing text
export function GlowingText({ children, color = "#FF5B00" }: { children: React.ReactNode, color?: string }) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }
  }, [color]);

  return (
    <Text
      ref={textRef}
      style={{
        background: `linear-gradient(45deg, ${color}, #FCC201)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700
      }}
    >
      {children}
    </Text>
  );
}

// Magic UI inspired pulsing icon
export function PulsingIcon({ icon: Icon, color = "orange", size = 24 }: { icon: any, color?: string, size?: number }) {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }
  }, []);

  return (
    <ThemeIcon ref={iconRef} size="xl" variant="light" color={color} radius="xl">
      <Icon size={size} />
    </ThemeIcon>
  );
}

// Magic UI inspired progress wave
export function ProgressWave({ progress = 50 }: { progress?: number }) {
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveRef.current) {
      gsap.to(waveRef.current, {
        backgroundPosition: "200% 0%",
        duration: 3,
        repeat: -1,
        ease: "none"
      });
    }
  }, []);

  return (
    <Box style={{ position: 'relative', height: '8px', borderRadius: '4px', background: '#f0f0f0', overflow: 'hidden' }}>
      <Box
        ref={waveRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #FF5B00, #FCC201, #FF8A00, #FF5B00)',
          backgroundSize: '200% 100%',
          borderRadius: '4px'
        }}
      />
    </Box>
  );
}

// Magic UI inspired notification badge
export function MagicBadge({ children, animate = true }: { children: React.ReactNode, animate?: boolean }) {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animate && badgeRef.current) {
      gsap.to(badgeRef.current, {
        y: -5,
        scale: 1.1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }
  }, [animate]);

  return (
    <Badge
      ref={badgeRef}
      variant="gradient"
      gradient={{ from: 'orange', to: 'yellow' }}
      style={{
        boxShadow: '0 4px 12px rgba(255, 91, 0, 0.3)'
      }}
    >
      {children}
    </Badge>
  );
}