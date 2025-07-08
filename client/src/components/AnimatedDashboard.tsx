import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Badge, 
  Group, 
  Stack, 
  Grid, 
  Paper,
  Select,
  NumberInput,
  Progress,
  Avatar,
  ThemeIcon,
  Divider,
  SimpleGrid,
  Box,
  RingProgress,
  Transition
} from '@mantine/core';
import { 
  IconCalculator, 
  IconBook, 
  IconTrophy, 
  IconStar, 
  IconTarget,
  IconChevronRight,
  IconPlayerPlay,
  IconChartBar,
  IconUser,
  IconSettings,
  IconFlame,
  IconBolt,
  IconRocket
} from '@tabler/icons-react';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { notifications } from '@mantine/notifications';
import { 
  ShimmerCard, 
  MorphingButton, 
  GlowingText, 
  PulsingIcon,
  MagicBadge,
  ProgressWave,
  FloatingParticles
} from './MagicComponents';

export default function AnimatedDashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string>('4');
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [practiceCount, setPracticeCount] = useState(5);
  const [mounted, setMounted] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);

  // Demo user data
  const demoUser = {
    name: "Demo Student",
    grade: 4,
    starPower: 850,
    level: 12,
    streak: 7,
    accuracy: 85,
    mathProgress: 75,
    readingProgress: 60
  };

  useEffect(() => {
    setMounted(true);
    
    const ctx = gsap.context(() => {
      // Initial page load animation
      const tl = gsap.timeline();
      
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(".stat-card",
        { opacity: 0, scale: 0.8, y: 30 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "back.out(1.7)" 
        },
        "-=0.4"
      )
      .fromTo(practiceRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(".achievement-card",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out" 
        },
        "-=0.6"
      );

      // Floating animations for icons
      gsap.to(".floating-icon", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.3
      });

      // Progress bar animations
      gsap.to(".progress-bar", {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.out",
        delay: 1
      });

      // Pulsing effect for Star Power
      gsap.to(".star-power", {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

    });

    return () => ctx.revert();
  }, []);

  // Generate questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: async ({ grade, subject, count }: { grade: number, subject: string, count: number }) => {
      return apiRequest(`/api/questions/generate-fast`, {
        method: 'POST',
        body: { grade, subject, count, category: 'General' }
      });
    },
    onSuccess: (data) => {
      // Success animation
      gsap.to(".practice-button", {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      
      notifications.show({
        title: '🎉 Practice Questions Ready!',
        message: `Generated ${data.length} questions for practice`,
        color: 'green'
      });
    },
    onError: () => {
      notifications.show({
        title: '❌ Generation Failed',
        message: 'Could not generate practice questions. Please try again.',
        color: 'red'
      });
    }
  });

  const handleStartPractice = () => {
    generateQuestionsMutation.mutate({
      grade: parseInt(selectedGrade),
      subject: selectedSubject,
      count: practiceCount
    });
  };

  const stats = [
    {
      title: "Star Power",
      value: demoUser.starPower,
      icon: IconStar,
      color: "yellow",
      subtitle: "Keep collecting!"
    },
    {
      title: "Current Level",
      value: demoUser.level,
      icon: IconTrophy,
      color: "orange",
      subtitle: "Learning Explorer"
    },
    {
      title: "Day Streak",
      value: demoUser.streak,
      icon: IconFlame,
      color: "red",
      subtitle: "days in a row"
    },
    {
      title: "Accuracy",
      value: `${demoUser.accuracy}%`,
      icon: IconTarget,
      color: "green",
      subtitle: "Great progress!"
    }
  ];

  const recentAchievements = [
    { 
      title: "Math Streak Master", 
      description: "Completed 7 days in a row", 
      date: "Today",
      icon: IconFlame,
      color: "orange"
    },
    { 
      title: "Reading Champion", 
      description: "Scored 90%+ on reading test", 
      date: "Yesterday",
      icon: IconBook,
      color: "blue"
    },
    { 
      title: "Problem Solver", 
      description: "Solved 50 math problems", 
      date: "2 days ago",
      icon: IconBolt,
      color: "yellow"
    }
  ];

  return (
    <Container size="xl" py="md">
      <Stack gap="xl">
        {/* Animated Welcome Header */}
        <Transition mounted={mounted} transition="slide-down" duration={800}>
          {(styles) => (
            <Paper 
              ref={headerRef}
              p="xl" 
              radius="xl" 
              style={{
                ...styles,
                background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Animated background circles */}
              <Box style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'float 6s ease-in-out infinite'
              }} />
              
              <Group justify="space-between" align="flex-start" style={{ position: 'relative', zIndex: 1 }}>
                <Stack gap="xs">
                  <Group>
                    <Avatar size="xl" color="white" variant="filled" radius="xl">
                      <IconUser size={32} />
                    </Avatar>
                    <Stack gap={4}>
                      <Title order={1} c="white" size="2.5rem">
                        Welcome back, {demoUser.name}! 
                        <IconStar className="floating-icon star-power" size={32} style={{ marginLeft: 10, color: '#FCC201' }} />
                      </Title>
                      <Text c="white" opacity={0.9} size="lg">
                        Grade {demoUser.grade} • Ready for your STAAR adventure?
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
                
                <Button 
                  variant="white" 
                  color="orange" 
                  leftSection={<IconSettings size={16} />}
                  size="lg"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                >
                  Profile Settings
                </Button>
              </Group>
            </Paper>
          )}
        </Transition>

        {/* Animated Stats Overview */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" ref={statsRef}>
          {stats.map((stat, index) => (
            <ShimmerCard 
              key={index}
              className="stat-card magic-card animate-bounce-in"
            >
              <Stack align="center" gap="sm">
                <ThemeIcon 
                  size="xl" 
                  variant="gradient" 
                  gradient={{ from: stat.color, to: `${stat.color}.4` }}
                  radius="xl"
                  className="floating-icon"
                >
                  <stat.icon size={28} />
                </ThemeIcon>
                <Text size="2xl" fw={900} ta="center" c={`${stat.color}.6`}>
                  {stat.value}
                </Text>
                <Stack gap={2} align="center">
                  <Text size="sm" fw={600} ta="center">
                    {stat.title}
                  </Text>
                  <Text size="xs" c="dimmed" ta="center">
                    {stat.subtitle}
                  </Text>
                </Stack>
              </Stack>
            </ShimmerCard>
          ))}
        </SimpleGrid>

        <Grid gutter="xl">
          {/* Quick Practice Section */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card 
              ref={practiceRef}
              shadow="lg" 
              padding="xl" 
              radius="xl" 
              h="100%"
              style={{ 
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
                border: '1px solid rgba(255, 91, 0, 0.1)'
              }}
            >
              <Stack gap="lg">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }} radius="xl">
                      <IconRocket className="floating-icon" size={24} />
                    </ThemeIcon>
                    <Title order={2}>Quick Practice</Title>
                  </Group>
                  <Badge variant="gradient" gradient={{ from: 'orange', to: 'yellow' }} size="lg">
                    ⚡ Lightning Fast
                  </Badge>
                </Group>
                
                <Text c="dimmed" size="lg">
                  Start practicing with authentic STAAR questions. Our efficient generation system 
                  creates questions <strong>25,000x faster</strong> than traditional AI methods.
                </Text>

                <Divider />

                <Grid gutter="lg">
                  <Grid.Col span={6}>
                    <Select
                      label="Grade Level"
                      placeholder="Select grade"
                      value={selectedGrade}
                      onChange={(value) => setSelectedGrade(value || '4')}
                      size="lg"
                      data={[
                        { value: '3', label: '🎯 Grade 3' },
                        { value: '4', label: '🎯 Grade 4' },
                        { value: '5', label: '🎯 Grade 5' }
                      ]}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Subject"
                      placeholder="Select subject"
                      value={selectedSubject}
                      onChange={(value) => setSelectedSubject(value || 'math')}
                      size="lg"
                      data={[
                        { value: 'math', label: '📊 Mathematics' },
                        { value: 'reading', label: '📚 Reading' }
                      ]}
                    />
                  </Grid.Col>
                </Grid>

                <NumberInput
                  label="Number of Questions"
                  placeholder="5"
                  value={practiceCount}
                  onChange={(value) => setPracticeCount(value as number)}
                  min={1}
                  max={20}
                  step={1}
                  size="lg"
                />

                <MorphingButton 
                  className="practice-button magic-button animate-pulse-glow"
                  onClick={handleStartPractice}
                  style={{ 
                    fontSize: '1.2rem',
                    height: 60,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  disabled={generateQuestionsMutation.isPending}
                >
                  <IconPlayerPlay size={24} />
                  {generateQuestionsMutation.isPending ? '✨ Generating Questions...' : '🚀 Start Practice Session'}
                </MorphingButton>

                <Text size="sm" c="dimmed" ta="center">
                  ⚡ Powered by our efficient template system - instant generation, zero wait time
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Progress Rings */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="lg" padding="xl" radius="xl" h="100%">
              <Stack gap="lg">
                <Title order={3} ta="center">Subject Progress</Title>
                
                <Stack gap="xl" align="center">
                  <Box ta="center">
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[{ value: demoUser.mathProgress, color: 'orange' }]}
                      label={
                        <Stack align="center" gap={2}>
                          <IconCalculator size={24} color="#FF5B00" />
                          <Text size="sm" fw={700}>{demoUser.mathProgress}%</Text>
                        </Stack>
                      }
                    />
                    <Text fw={600} mt="xs">Math Mastery</Text>
                    <Text size="sm" c="dimmed">Algebra & Geometry</Text>
                  </Box>

                  <Box ta="center">
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[{ value: demoUser.readingProgress, color: 'blue' }]}
                      label={
                        <Stack align="center" gap={2}>
                          <IconBook size={24} color="#339AF0" />
                          <Text size="sm" fw={700}>{demoUser.readingProgress}%</Text>
                        </Stack>
                      }
                    />
                    <Text fw={600} mt="xs">Reading Excellence</Text>
                    <Text size="sm" c="dimmed">Comprehension & Analysis</Text>
                  </Box>
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Recent Achievements */}
        <Card shadow="lg" padding="xl" radius="xl" ref={achievementsRef}>
          <Stack gap="lg">
            <Group justify="space-between">
              <Group>
                <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'yellow', to: 'orange' }} radius="xl">
                  <IconTrophy size={24} />
                </ThemeIcon>
                <Title order={3}>Recent Achievements</Title>
              </Group>
              <Button variant="subtle" size="sm" rightSection={<IconChevronRight size={16} />}>
                View All
              </Button>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
              {recentAchievements.map((achievement, index) => (
                <Paper 
                  key={index} 
                  className="achievement-card"
                  p="lg" 
                  radius="lg" 
                  withBorder
                  style={{ 
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { 
                      scale: 1.02, 
                      y: -3,
                      duration: 0.3 
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { 
                      scale: 1, 
                      y: 0,
                      duration: 0.3 
                    });
                  }}
                >
                  <Stack gap="sm">
                    <Group gap="sm">
                      <ThemeIcon size="md" variant="light" color={achievement.color} radius="lg">
                        <achievement.icon size={18} />
                      </ThemeIcon>
                      <Text fw={600} size="sm">{achievement.title}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">{achievement.description}</Text>
                    <Badge size="xs" variant="outline" color={achievement.color}>
                      {achievement.date}
                    </Badge>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Performance Highlight */}
        <Paper 
          p="xl" 
          radius="xl" 
          style={{ 
            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            border: '1px solid rgba(51, 154, 240, 0.2)'
          }}
        >
          <Group justify="space-between" align="center">
            <Stack gap="sm">
              <Title order={3} c="blue.8">
                🚀 Revolutionary Performance
              </Title>
              <Text c="blue.7" size="lg">
                Our breakthrough efficient generation system creates authentic STAAR questions 
                <strong> 25,000x faster</strong> than traditional AI methods - delivering instant practice 
                with mathematically verified accuracy.
              </Text>
            </Stack>
            <ThemeIcon size={80} variant="light" color="blue" radius="xl">
              <IconChartBar className="floating-icon" size={40} />
            </ThemeIcon>
          </Group>
        </Paper>
      </Stack>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Container>
  );
}