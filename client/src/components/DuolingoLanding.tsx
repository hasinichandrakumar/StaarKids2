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
  Badge,
  Avatar,
  Progress
} from '@mantine/core';
import { 
  IconStar,
  IconCalculator, 
  IconBook, 
  IconTrophy,
  IconRocket,
  IconTarget,
  IconBrain,
  IconFlame,
  IconHeart,
  IconZap,
  IconShield,
  IconCrown
} from '@tabler/icons-react';

gsap.registerPlugin(ScrollTrigger);

export default function DuolingoLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero bounce-in animation
      gsap.fromTo(heroRef.current, 
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "elastic.out(1, 0.8)" }
      );

      // Floating mascot animation
      gsap.to(".mascot-float", {
        y: -15,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      // Feature cards stagger animation
      gsap.fromTo(".feature-card", 
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stats counter with bounce
      gsap.fromTo(".stat-number", 
        { scale: 0 },
        {
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: IconCalculator,
      title: "Math Adventures",
      description: "Turn STAAR math into fun quests with instant rewards",
      color: "#58CC02", // Duolingo green
      mascot: "🧮"
    },
    {
      icon: IconBook,
      title: "Reading Journeys", 
      description: "Explore stories while mastering comprehension skills",
      color: "#1CB0F6", // Duolingo blue
      mascot: "📚"
    },
    {
      icon: IconFlame,
      title: "Learning Streaks",
      description: "Build habits with daily challenges and streak rewards",
      color: "#FF9600", // Duolingo orange
      mascot: "🔥"
    },
    {
      icon: IconTrophy,
      title: "Achievements",
      description: "Unlock badges and climb the leaderboard",
      color: "#CE82FF", // Duolingo purple
      mascot: "🏆"
    },
    {
      icon: IconHeart,
      title: "Lives System",
      description: "Learn from mistakes with our gentle hearts system",
      color: "#FF4B4B", // Duolingo red
      mascot: "❤️"
    },
    {
      icon: IconShield,
      title: "Progress Shield",
      description: "Protect your streak and stay motivated daily",
      color: "#00CD9C", // Duolingo teal
      mascot: "🛡️"
    }
  ];

  const stats = [
    { value: "25K+", label: "Practice Questions", mascot: "📝" },
    { value: "99%", label: "Success Rate", mascot: "🎯" },
    { value: "50", label: "Learning Levels", mascot: "🎮" },
    { value: "1000+", label: "Happy Students", mascot: "😊" }
  ];

  const handleStartDemo = () => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', 'student');
    window.location.href = '/dashboard';
  };

  return (
    <Box style={{ background: 'linear-gradient(135deg, #58CC02 0%, #1CB0F6 100%)', minHeight: '100vh' }}>
      {/* Hero Section - Duolingo Style */}
      <Container size="xl" py={100}>
        <div ref={heroRef}>
          <Grid align="center" gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="xl">
                <Box>
                  <Text size="lg" c="white" opacity={0.9} fw={600} mb="sm">
                    🌟 The fun way to master STAAR tests
                  </Text>
                  <Title 
                    order={1} 
                    size="4rem" 
                    fw={800}
                    c="white"
                    style={{ lineHeight: 1.1 }}
                  >
                    Learn Texas STAAR
                  </Title>
                  <Title 
                    order={1} 
                    size="4rem" 
                    fw={800}
                    c="#FFC83D"
                    style={{ lineHeight: 1.1 }}
                  >
                    Like a Game!
                  </Title>
                </Box>

                <Text size="xl" c="white" opacity={0.95} maw={500}>
                  Master Grade 3-5 Math and Reading through bite-sized lessons, 
                  daily challenges, and rewards that make learning addictive.
                </Text>

                <Group gap="md">
                  <Button 
                    size="xl" 
                    variant="white"
                    color="green"
                    onClick={handleStartDemo}
                    radius="xl"
                    style={{ 
                      fontSize: '1.2rem',
                      padding: '16px 32px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      border: '3px solid #58CC02',
                      boxShadow: '0 4px 0 #4CAF50',
                      transition: 'all 0.1s ease'
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateY(2px)';
                      e.currentTarget.style.boxShadow = '0 2px 0 #4CAF50';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 0 #4CAF50';
                    }}
                  >
                    🚀 Start Learning
                  </Button>
                  
                  <Button 
                    size="xl" 
                    variant="outline" 
                    color="white"
                    radius="xl"
                    style={{ 
                      fontSize: '1.1rem', 
                      padding: '16px 24px',
                      fontWeight: 600,
                      borderWidth: '2px'
                    }}
                  >
                    👁️ Watch Demo
                  </Button>
                </Group>

                <Group gap="sm">
                  <Badge 
                    size="lg" 
                    variant="white" 
                    color="green" 
                    radius="xl"
                    style={{ fontWeight: 700 }}
                  >
                    ⭐ Free Forever
                  </Badge>
                  <Badge 
                    size="lg" 
                    variant="white" 
                    color="blue" 
                    radius="xl"
                    style={{ fontWeight: 700 }}
                  >
                    🎯 Grades 3-5
                  </Badge>
                  <Badge 
                    size="lg" 
                    variant="white" 
                    color="orange" 
                    radius="xl"
                    style={{ fontWeight: 700 }}
                  >
                    🔥 25K+ Questions
                  </Badge>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box ta="center">
                {/* Duolingo-style mascot */}
                <Box 
                  className="mascot-float"
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'linear-gradient(145deg, #4CAF50, #66BB6A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    border: '5px solid white'
                  }}
                >
                  <Text size="8rem">🦉</Text>
                </Box>
                <Text size="xl" c="white" fw={700} mt="md">
                  Meet STAAR Owl - Your Learning Buddy!
                </Text>
              </Box>
            </Grid.Col>
          </Grid>
        </div>
      </Container>

      {/* Features Section - Duolingo Card Style */}
      <Box style={{ background: '#F7F7F7' }} py={80}>
        <Container size="xl">
          <div ref={featuresRef}>
            <Stack align="center" gap="xl" mb={60}>
              <Title order={2} ta="center" size="3rem" c="#4B4B4B" fw={800}>
                Why Kids Love STAAR Owl 🦉
              </Title>
              <Text size="xl" ta="center" maw={600} c="dimmed" fw={500}>
                We make STAAR test prep feel like your favorite mobile game
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="feature-card"
                  shadow="lg" 
                  padding="xl" 
                  radius="20"
                  style={{ 
                    border: `3px solid ${feature.color}`,
                    background: 'white',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: `0 15px 35px ${feature.color}40`,
                      duration: 0.3 
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { 
                      y: 0, 
                      scale: 1,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      duration: 0.3 
                    });
                  }}
                >
                  <Stack align="center" gap="md" ta="center">
                    <Box
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: feature.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid white',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Text size="2rem">{feature.mascot}</Text>
                    </Box>
                    <Title order={3} size="1.5rem" c="#4B4B4B" fw={700}>
                      {feature.title}
                    </Title>
                    <Text c="dimmed" size="md" fw={500} lh={1.5}>
                      {feature.description}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </div>
        </Container>
      </Box>

      {/* Stats Section - Duolingo Style */}
      <Box style={{ background: 'linear-gradient(135deg, #1CB0F6 0%, #58CC02 100%)' }} py={80}>
        <Container size="xl">
          <div ref={statsRef}>
            <Stack align="center" gap="xl" mb={60}>
              <Title order={2} c="white" ta="center" size="3rem" fw={800}>
                🎉 Join the STAAR Success Story
              </Title>
              <Text size="xl" c="white" ta="center" opacity={0.95} fw={500} maw={600}>
                Thousands of Texas students are already crushing their STAAR tests
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
              {stats.map((stat, index) => (
                <Stack key={index} align="center" gap="md">
                  <Box
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '4px solid #FFC83D',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Text size="3rem">{stat.mascot}</Text>
                  </Box>
                  <Text 
                    className="stat-number"
                    size="3rem" 
                    fw={900} 
                    c="white"
                    ta="center"
                    style={{ lineHeight: 1 }}
                  >
                    {stat.value}
                  </Text>
                  <Text size="lg" c="white" ta="center" fw={600} opacity={0.9}>
                    {stat.label}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </div>
        </Container>
      </Box>

      {/* CTA Section - Duolingo Style */}
      <Box style={{ background: '#F7F7F7' }} py={100}>
        <Container size="xl">
          <Paper p={60} radius="30" style={{ 
            background: 'linear-gradient(145deg, #58CC02, #4CAF50)',
            border: '4px solid #FFC83D',
            boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
          }}>
            <Stack align="center" gap="xl" ta="center">
              <Box 
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: '#FFC83D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '5px solid white',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                }}
                className="mascot-float"
              >
                <Text size="4rem">🎓</Text>
              </Box>
              
              <Title order={2} size="3rem" c="white" fw={800}>
                Ready to Ace Your STAAR Test?
              </Title>
              
              <Text size="xl" maw={700} c="white" opacity={0.95} fw={500} lh={1.6}>
                Join thousands of Texas students who transformed their test scores with our 
                game-based learning platform. Start your STAAR journey today!
              </Text>
              
              <Button 
                size="xl" 
                variant="white"
                color="green"
                onClick={handleStartDemo}
                radius="xl"
                style={{ 
                  fontSize: '1.3rem',
                  padding: '20px 40px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: '3px solid white',
                  boxShadow: '0 6px 0 #E0E0E0',
                  transition: 'all 0.1s ease'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(3px)';
                  e.currentTarget.style.boxShadow = '0 3px 0 #E0E0E0';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 0 #E0E0E0';
                }}
              >
                🚀 Start Free Demo Now
              </Button>
              
              <Text size="sm" c="white" opacity={0.8} fw={500}>
                No registration required • Instant access • 100% free forever
              </Text>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}