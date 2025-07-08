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
  Transition,
  Modal
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
  IconRocket,
  IconHeart,
  IconShield,
  IconCrown,
  IconZap
} from '@tabler/icons-react';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { notifications } from '@mantine/notifications';
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<string>('4');
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [practiceCount, setPracticeCount] = useState(5);
  const [mounted, setMounted] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(7);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const practiceRef = useRef<HTMLDivElement>(null);

  // Check if demo mode is enabled
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';

  // Demo user data - Duolingo style
  const demoUser = {
    name: "Demo Student",
    grade: 4,
    xp: 1250, // XP instead of Star Power
    level: 12,
    streak: streak,
    hearts: hearts,
    accuracy: 85,
    mathProgress: 75,
    readingProgress: 60,
    weeklyGoal: 150,
    currentWeeklyXP: 98
  };

  const currentUser = isDemo ? demoUser : {
    name: user?.firstName + " " + user?.lastName || "Student",
    grade: user?.grade || 4,
    xp: user?.starPower || 0,
    level: Math.floor((user?.starPower || 0) / 100) + 1,
    streak: 7,
    hearts: 5,
    accuracy: 85,
    mathProgress: 75,
    readingProgress: 60,
    weeklyGoal: 150,
    currentWeeklyXP: 98
  };

  useEffect(() => {
    setMounted(true);
    
    const ctx = gsap.context(() => {
      // Duolingo-style bounce animations
      const tl = gsap.timeline();
      
      tl.fromTo(headerRef.current,
        { opacity: 0, scale: 0.8, y: -30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.8)" }
      )
      .fromTo(".stat-card",
        { opacity: 0, scale: 0.8, rotation: -5 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0,
          duration: 0.6, 
          stagger: 0.1,
          ease: "back.out(1.7)" 
        },
        "-=0.4"
      )
      .fromTo(practiceRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
        "-=0.2"
      );

      // Floating heart animation
      gsap.to(".floating-heart", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      // XP bar pulse
      gsap.to(".xp-bar", {
        scale: 1.02,
        duration: 2,
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
      notifications.show({
        title: 'Questions Generated!',
        message: `Created ${data.length} authentic STAAR questions. Let's practice!`,
        color: 'green',
        icon: <IconTrophy size={16} />
      });
      
      // Level up animation chance
      if (Math.random() > 0.7) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
    },
    onError: (error) => {
      notifications.show({
        title: 'Generation Failed',
        message: 'Unable to create questions. Please try again.',
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

  const handleLogout = () => {
    if (isDemo) {
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');
      window.location.href = '/';
    } else {
      logout();
    }
  };

  if (isLoading && !isDemo) {
    return (
      <Container size="xl" py={40}>
        <Group justify="center">
          <Text size="xl">Loading your learning adventure...</Text>
        </Group>
      </Container>
    );
  }

  const weeklyProgress = (currentUser.currentWeeklyXP / currentUser.weeklyGoal) * 100;

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Level Up Modal */}
      <Modal
        opened={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        centered
        withCloseButton={false}
        size="sm"
      >
        <Stack align="center" py="xl">
          <ThemeIcon size={80} radius="xl" color="yellow" variant="gradient">
            <IconCrown size={40} />
          </ThemeIcon>
          <Title order={2} c="yellow">Level Up!</Title>
          <Text ta="center" c="dimmed">
            Amazing work! You've reached Level {currentUser.level + 1}
          </Text>
          <Button onClick={() => setShowLevelUp(false)} size="lg" fullWidth>
            Continue Learning
          </Button>
        </Stack>
      </Modal>

      {/* Header */}
      <Box ref={headerRef} p="md" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group>
              <Avatar size="lg" radius="xl" gradient={{ from: 'orange', to: 'yellow' }}>
                <IconStar size={24} />
              </Avatar>
              <Box>
                <Title order={1} c="white" fw={900}>
                  StaarKids
                </Title>
                <Text c="rgba(255,255,255,0.8)" size="sm" fw={600}>
                  STAAR Test Mastery Platform
                </Text>
              </Box>
            </Group>

            <Group>
              {/* Hearts */}
              <Group gap={2}>
                {[...Array(5)].map((_, i) => (
                  <ThemeIcon 
                    key={i}
                    size="sm" 
                    color={i < currentUser.hearts ? "red" : "gray"} 
                    variant="filled"
                    className={i < currentUser.hearts ? "floating-heart" : ""}
                  >
                    <IconHeart size={12} />
                  </ThemeIcon>
                ))}
              </Group>

              {/* Streak */}
              <Group gap={4}>
                <ThemeIcon size="sm" color="orange" variant="filled">
                  <IconFlame size={12} />
                </ThemeIcon>
                <Text c="white" fw={700} size="sm">
                  {currentUser.streak}
                </Text>
              </Group>

              {/* XP */}
              <Group gap={4}>
                <ThemeIcon size="sm" color="yellow" variant="filled">
                  <IconStar size={12} />
                </ThemeIcon>
                <Text c="white" fw={700} size="sm">
                  {currentUser.xp} XP
                </Text>
              </Group>

              <Button 
                onClick={handleLogout}
                color="rgba(255,255,255,0.1)"
                variant="filled"
                leftSection={<IconUser size={16} />}
              >
                {isDemo ? 'Exit Demo' : 'Sign Out'}
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        {/* Welcome Section */}
        <Card 
          shadow="xl" 
          padding="xl" 
          radius="xl" 
          mb="xl"
          style={{ 
            background: 'linear-gradient(45deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
            backdropFilter: 'blur(20px)'
          }}
        >
          <Group justify="space-between" align="center">
            <Box>
              <Title order={1} c="dark" fw={900} mb={4}>
                Welcome back, {currentUser.name}! 🚀
              </Title>
              <Text size="lg" c="dimmed" mb="md">
                Ready to level up your STAAR skills? Let's make learning fun!
              </Text>
              
              {/* Weekly Goal Progress */}
              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={600} c="dimmed">Weekly Goal</Text>
                  <Text size="sm" fw={600} c="dimmed">
                    {currentUser.currentWeeklyXP}/{currentUser.weeklyGoal} XP
                  </Text>
                </Group>
                <Progress 
                  value={weeklyProgress} 
                  size="lg" 
                  radius="xl" 
                  className="xp-bar"
                  color={weeklyProgress >= 100 ? "green" : "blue"}
                  style={{ background: 'rgba(0,0,0,0.1)' }}
                />
              </Box>
            </Box>
            
            <Box ta="center">
              <RingProgress 
                size={120}
                thickness={8}
                sections={[
                  { value: currentUser.mathProgress, color: 'blue' },
                  { value: currentUser.readingProgress, color: 'green' }
                ]}
                label={
                  <Box ta="center">
                    <Text size="xs" c="dimmed">Level</Text>
                    <Text size="xl" fw={900} c="dark">{currentUser.level}</Text>
                  </Box>
                }
              />
            </Box>
          </Group>
        </Card>

        <Grid>
          {/* Practice Section */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card 
              ref={practiceRef}
              shadow="xl" 
              padding="xl" 
              radius="xl"
              className="stat-card"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
                backdropFilter: 'blur(20px)'
              }}
            >
              <Group mb="lg" justify="space-between">
                <Group>
                  <ThemeIcon size="xl" color="blue" variant="gradient" radius="xl">
                    <IconRocket size={24} />
                  </ThemeIcon>
                  <Box>
                    <Title order={2} c="dark">Quick Practice</Title>
                    <Text c="dimmed">Start your learning journey</Text>
                  </Box>
                </Group>
                <Badge size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                  Lightning Fast ⚡
                </Badge>
              </Group>

              <Stack gap="lg">
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                  <Select
                    label="Grade Level"
                    value={selectedGrade}
                    onChange={(value) => setSelectedGrade(value || '4')}
                    data={[
                      { value: '3', label: 'Grade 3' },
                      { value: '4', label: 'Grade 4' },
                      { value: '5', label: 'Grade 5' }
                    ]}
                    size="lg"
                    radius="md"
                  />
                  
                  <Select
                    label="Subject"
                    value={selectedSubject}
                    onChange={(value) => setSelectedSubject(value || 'math')}
                    data={[
                      { value: 'math', label: '📊 Mathematics' },
                      { value: 'reading', label: '📚 Reading' }
                    ]}
                    size="lg"
                    radius="md"
                  />
                  
                  <NumberInput
                    label="Questions"
                    value={practiceCount}
                    onChange={(value) => setPracticeCount(Number(value))}
                    min={1}
                    max={20}
                    size="lg"
                    radius="md"
                  />
                </SimpleGrid>

                <Button
                  onClick={handleStartPractice}
                  loading={generateQuestionsMutation.isPending}
                  size="xl"
                  radius="xl"
                  fullWidth
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  leftSection={<IconPlayerPlay size={20} />}
                  style={{
                    boxShadow: '0 8px 32px rgba(0,100,200,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {generateQuestionsMutation.isPending ? 'Creating Magic...' : 'Start Practice Session'}
                </Button>

                <Paper p="md" radius="md" style={{ background: 'rgba(0,100,200,0.05)' }}>
                  <Group>
                    <ThemeIcon size="sm" color="blue" variant="light">
                      <IconBolt size={16} />
                    </ThemeIcon>
                    <Text size="sm" c="blue" fw={600}>
                      Our AI creates authentic STAAR questions 25,000x faster than traditional methods!
                    </Text>
                  </Group>
                </Paper>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Stats Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              {/* Stats Cards */}
              <SimpleGrid cols={2} spacing="md">
                <Card 
                  shadow="md" 
                  padding="lg" 
                  radius="xl"
                  className="stat-card"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))',
                    border: '2px solid rgba(76, 175, 80, 0.2)'
                  }}
                >
                  <ThemeIcon size="lg" color="green" variant="light" mb="xs">
                    <IconCalculator size={20} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Math</Text>
                  <Text size="xl" fw={900} c="green">{currentUser.mathProgress}%</Text>
                </Card>

                <Card 
                  shadow="md" 
                  padding="lg" 
                  radius="xl"
                  className="stat-card"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05))',
                    border: '2px solid rgba(33, 150, 243, 0.2)'
                  }}
                >
                  <ThemeIcon size="lg" color="blue" variant="light" mb="xs">
                    <IconBook size={20} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Reading</Text>
                  <Text size="xl" fw={900} c="blue">{currentUser.readingProgress}%</Text>
                </Card>

                <Card 
                  shadow="md" 
                  padding="lg" 
                  radius="xl"
                  className="stat-card"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))',
                    border: '2px solid rgba(255, 193, 7, 0.2)'
                  }}
                >
                  <ThemeIcon size="lg" color="yellow" variant="light" mb="xs">
                    <IconTarget size={20} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Accuracy</Text>
                  <Text size="xl" fw={900} c="yellow">{currentUser.accuracy}%</Text>
                </Card>

                <Card 
                  shadow="md" 
                  padding="lg" 
                  radius="xl"
                  className="stat-card"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))',
                    border: '2px solid rgba(156, 39, 176, 0.2)'
                  }}
                >
                  <ThemeIcon size="lg" color="violet" variant="light" mb="xs">
                    <IconTrophy size={20} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Level</Text>
                  <Text size="xl" fw={900} c="violet">{currentUser.level}</Text>
                </Card>
              </SimpleGrid>

              {/* Recent Achievements */}
              <Card 
                shadow="xl" 
                padding="lg" 
                radius="xl"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <Group mb="md">
                  <ThemeIcon size="md" color="yellow" variant="light">
                    <IconTrophy size={18} />
                  </ThemeIcon>
                  <Text fw={700} c="dark">Recent Achievements</Text>
                </Group>

                <Stack gap="xs">
                  <Paper p="sm" radius="md" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>Math Master</Text>
                      <Badge size="sm" color="green">+50 XP</Badge>
                    </Group>
                  </Paper>
                  
                  <Paper p="sm" radius="md" style={{ background: 'rgba(33, 150, 243, 0.1)' }}>
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>Reading Streak</Text>
                      <Badge size="sm" color="blue">+35 XP</Badge>
                    </Group>
                  </Paper>
                  
                  <Paper p="sm" radius="md" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                    <Group justify="space-between">
                      <Text size="sm" fw={600}>Perfect Score</Text>
                      <Badge size="sm" color="yellow">+100 XP</Badge>
                    </Group>
                  </Paper>
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}