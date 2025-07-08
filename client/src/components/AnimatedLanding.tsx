import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Group, 
  Stack, 
  Grid, 
  Paper,
  Box,
  SimpleGrid,
  ThemeIcon,
  Badge
} from '@mantine/core';
import { 
  IconStar,
  IconCalculator, 
  IconBook, 
  IconTrophy,
  IconRocket,
  IconTarget,
  IconBrain
} from '@tabler/icons-react';
import { 
  AnimatedGradientBg, 
  ShimmerCard, 
  FloatingParticles, 
  MorphingButton, 
  GlowingText, 
  PulsingIcon,
  MagicBadge 
} from './MagicComponents';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      // Floating star animation
      gsap.to(".floating-star", {
        y: -20,
        rotation: 360,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.2
      });

      // Features scroll animation
      gsap.fromTo(".feature-card", 
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stats counter animation
      gsap.fromTo(".stat-number", 
        { innerText: 0 },
        {
          innerText: (i, target) => target.getAttribute('data-value'),
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // CTA section animation
      gsap.fromTo(ctaRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax effect for background elements
      gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: IconCalculator,
      title: "Math Mastery",
      description: "25,000+ authentic STAAR math questions with instant generation",
      color: "orange"
    },
    {
      icon: IconBook,
      title: "Reading Excellence", 
      description: "Comprehensive reading comprehension with adaptive difficulty",
      color: "blue"
    },
    {
      icon: IconBrain,
      title: "AI-Powered Learning",
      description: "Personalized learning paths powered by advanced AI",
      color: "purple"
    },
    {
      icon: IconTarget,
      title: "Precision Practice",
      description: "Target specific skills with mathematically verified questions",
      color: "green"
    },
    {
      icon: IconTrophy,
      title: "Achievement System",
      description: "Earn stars, unlock achievements, and track progress",
      color: "yellow"
    },
    {
      icon: IconRocket,
      title: "Instant Results",
      description: "Lightning-fast question generation - 25,000x faster than AI",
      color: "red"
    }
  ];

  const stats = [
    { value: 25000, label: "Practice Questions", suffix: "+" },
    { value: 99, label: "Math Accuracy", suffix: "%" },
    { value: 50, label: "Learning Chapters", suffix: "" },
    { value: 1000, label: "Happy Students", suffix: "+" }
  ];

  const handleStartDemo = () => {
    // Set demo mode and redirect to dashboard
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', 'student');
    window.location.href = '/dashboard';
  };

  return (
    <Box style={{ overflow: 'hidden', position: 'relative' }}>
      {/* Animated background elements */}
      <Box className="parallax-bg" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '120%',
        background: 'radial-gradient(circle at 20% 20%, rgba(255, 91, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(252, 194, 1, 0.1) 0%, transparent 50%)',
        zIndex: -1 
      }} />

      {/* Hero Section */}
      <Container size="xl" py={100}>
        <div ref={heroRef}>
          <Stack align="center" gap="xl" ta="center">
            <Group gap="md" justify="center">
              <ThemeIcon size={80} radius="xl" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }}>
                <IconStar size={40} className="floating-star" />
              </ThemeIcon>
              <Box>
                <Title 
                  order={1} 
                  size="4rem" 
                  fw={900}
                  variant="gradient" 
                  gradient={{ from: 'orange', to: 'yellow' }}
                  style={{ lineHeight: 1.1 }}
                >
                  STAAR Kids
                </Title>
                <Text size="lg" c="dimmed" mt="xs">
                  Master Texas STAAR Tests with Confidence
                </Text>
              </Box>
            </Group>

            <Text size="xl" maw={600} c="dimmed">
              Transform STAAR preparation into an engaging adventure with authentic questions, 
              AI-powered learning, and instant feedback designed for Texas students.
            </Text>

            <Group gap="md">
              <MorphingButton 
                onClick={handleStartDemo}
                className="magic-button"
                style={{ 
                  fontSize: '1.2rem',
                  padding: '16px 32px'
                }}
              >
                ✨ Start Learning Journey
              </MorphingButton>
              
              <Button 
                size="xl" 
                variant="outline" 
                color="orange"
                style={{ fontSize: '1.2rem', padding: '16px 32px' }}
              >
                Watch Demo
              </Button>
            </Group>

            <Group gap="xs" mt="md">
              <MagicBadge>⭐ Free Forever</MagicBadge>
              <MagicBadge>🎯 Grades 3-5</MagicBadge>
              <MagicBadge>🚀 25,000+ Questions</MagicBadge>
            </Group>
          </Stack>
        </div>
      </Container>

      {/* Features Section */}
      <Container size="xl" py={80}>
        <div ref={featuresRef}>
          <Stack align="center" gap="xl" mb={60}>
            <Badge variant="light" color="orange" size="xl">Features</Badge>
            <Title order={2} ta="center" size="3rem">
              Everything You Need to Ace STAAR
            </Title>
            <Text size="lg" ta="center" maw={600} c="dimmed">
              Our comprehensive platform combines authentic test content with cutting-edge technology 
              to deliver the most effective STAAR preparation experience.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {features.map((feature, index) => (
              <ShimmerCard 
                key={index}
                className="feature-card magic-card animate-shimmer"
              >
                <Stack align="center" gap="md" ta="center" p="xl">
                  <PulsingIcon 
                    icon={feature.icon}
                    color={feature.color}
                    size={30}
                  />
                  <GlowingText>{feature.title}</GlowingText>
                  <Text c="dimmed" size="md">{feature.description}</Text>
                </Stack>
              </ShimmerCard>
            ))}
          </SimpleGrid>
        </div>
      </Container>

      {/* Stats Section */}
      <AnimatedGradientBg>
        <Container size="xl" py={80}>
          <FloatingParticles />
          <div ref={statsRef}>
            <Stack align="center" gap="xl" mb={60}>
              <Title order={2} c="white" ta="center" size="3rem" className="magic-text-glow">
                ⭐ Trusted by Thousands
              </Title>
              <Text size="lg" c="white" ta="center" opacity={0.9} maw={600}>
                Join the growing community of students achieving STAAR success
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
              {stats.map((stat, index) => (
                <Stack key={index} align="center" gap="xs">
                  <Text 
                    className="stat-number"
                    data-value={stat.value}
                    size="4rem" 
                    fw={900} 
                    c="white"
                    style={{ lineHeight: 1 }}
                  >
                    0
                  </Text>
                  <Text size="sm" c="white" opacity={0.9} fw={500}>
                    {stat.suffix}
                  </Text>
                  <Text size="lg" c="white" ta="center" fw={500}>
                    {stat.label}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </div>
        </Container>
      </AnimatedGradientBg>

      {/* CTA Section */}
      <Container size="xl" py={100}>
        <div ref={ctaRef}>
          <Paper p={60} radius="xl" style={{ 
            background: 'linear-gradient(145deg, rgba(255, 91, 0, 0.05) 0%, rgba(252, 194, 1, 0.05) 100%)',
            border: '1px solid rgba(255, 91, 0, 0.1)'
          }}>
            <Stack align="center" gap="xl" ta="center">
              <ThemeIcon size={100} radius="xl" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }}>
                <IconRocket size={50} className="floating-star" />
              </ThemeIcon>
              
              <Title order={2} size="3rem">
                Ready to Begin Your STAAR Journey?
              </Title>
              
              <Text size="xl" maw={700} c="dimmed">
                Join thousands of Texas students who have transformed their STAAR performance with our 
                innovative learning platform. Start your free journey today!
              </Text>
              
              <Button 
                size="xl" 
                variant="gradient" 
                gradient={{ from: 'orange', to: 'yellow' }}
                onClick={handleStartDemo}
                style={{ 
                  fontSize: '1.3rem',
                  padding: '20px 40px',
                  boxShadow: '0 12px 40px rgba(255, 91, 0, 0.3)'
                }}
              >
                Start Free Demo Now
              </Button>
              
              <Text size="sm" c="dimmed">
                No registration required • Instant access • 100% free
              </Text>
            </Stack>
          </Paper>
        </div>
      </Container>
    </Box>
  );
}