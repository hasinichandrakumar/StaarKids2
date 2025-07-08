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

export default function DuolingoDashboard() {
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
        { opacity: 0, x: -30, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.6)" },
        "-=0.4"
      );

      // Floating hearts animation
      gsap.to(".floating-heart", {
        y: -10,
        rotation: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        stagger: 0.3
      });

      // XP bar fill animation
      gsap.fromTo(".xp-bar", 
        { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: "power2.out", delay: 1 }
      );

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
      // Duolingo success animation
      gsap.to(".practice-button", {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
      
      // Level up simulation
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      
      notifications.show({
        title: '🎉 Awesome!',
        message: `${data.length} new challenges unlocked! +${data.length * 10} XP`,
        color: 'green',
        style: {
          border: '2px solid #58CC02',
          borderRadius: '15px'
        }
      });
    },
    onError: () => {
      notifications.show({
        title: '😅 Oops!',
        message: "Couldn't load new challenges. Don't worry, try again!",
        color: 'red',
        style: {
          border: '2px solid #FF4B4B',
          borderRadius: '15px'
        }
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
      title: "XP Points",
      value: demoUser.xp,
      icon: IconStar,
      color: "#FFC83D",
      subtitle: "Keep earning!",
      mascot: "⭐"
    },
    {
      title: "Current Level",
      value: demoUser.level,
      icon: IconCrown,
      color: "#CE82FF",
      subtitle: "Math Explorer",
      mascot: "👑"
    },
    {
      title: "Fire Streak",
      value: demoUser.streak,
      icon: IconFlame,
      color: "#FF9600",
      subtitle: "days in a row",
      mascot: "🔥"
    },
    {
      title: "Hearts Left",
      value: demoUser.hearts,
      icon: IconHeart,
      color: "#FF4B4B",
      subtitle: "Be careful!",
      mascot: "❤️"
    }
  ];

  const achievements = [
    { 
      title: "Fire Streak Master", 
      description: "7 days of consistent practice", 
      date: "Today",
      color: "#FF9600",
      mascot: "🔥",
      xp: "+50 XP"
    },
    { 
      title: "Reading Rockstar", 
      description: "Scored 90%+ on reading lesson", 
      date: "Yesterday",
      color: "#1CB0F6",
      mascot: "📚",
      xp: "+25 XP"
    },
    { 
      title: "Math Wizard", 
      description: "Completed 20 math problems perfectly", 
      date: "2 days ago",
      color: "#58CC02",
      mascot: "🧮",
      xp: "+30 XP"
    }
  ];

  return (
    <Box style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5E8 100%)', minHeight: '100vh' }}>
      <Container size="xl" py="md">
        <Stack gap="xl">
          {/* Duolingo-style Header */}
          <Transition mounted={mounted} transition="bounce-down" duration={800}>
            {(styles) => (
              <Paper 
                ref={headerRef}
                p="xl" 
                radius="20" 
                style={{
                  ...styles,
                  background: 'linear-gradient(135deg, #58CC02 0%, #4CAF50 100%)',
                  border: '3px solid #FFC83D',
                  boxShadow: '0 8px 25px rgba(88, 204, 2, 0.3)'
                }}
              >
                <Grid align="center">
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <Group>
                      <Avatar size="xl" radius="xl" style={{ border: '3px solid white' }}>
                        <Text size="2rem">🦉</Text>
                      </Avatar>
                      <Stack gap="xs">
                        <Group gap="sm">
                          <Title order={2} c="white" fw={800}>
                            Welcome back, {demoUser.name}! 
                          </Title>
                          <Text size="2rem" className="floating-heart">🎉</Text>
                        </Group>
                        <Text c="white" opacity={0.9} size="lg" fw={600}>
                          Grade {demoUser.grade} • Ready for today's STAAR adventure?
                        </Text>
                        
                        {/* Weekly Goal Progress */}
                        <Box mt="sm">
                          <Group gap="xs" mb="xs">
                            <Text c="white" size="sm" fw={600}>Weekly Goal Progress</Text>
                            <Badge variant="white" color="green" size="sm" radius="xl">
                              {demoUser.currentWeeklyXP}/{demoUser.weeklyGoal} XP
                            </Badge>
                          </Group>
                          <Progress 
                            value={(demoUser.currentWeeklyXP / demoUser.weeklyGoal) * 100} 
                            color="yellow" 
                            size="lg" 
                            radius="xl"
                            className="xp-bar"
                            style={{ border: '2px solid white' }}
                          />
                        </Box>
                      </Stack>
                    </Group>
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Group justify="flex-end" gap="md">
                      <Button 
                        variant="white" 
                        color="green" 
                        leftSection={<IconSettings size={16} />}
                        size="lg"
                        radius="xl"
                        style={{ 
                          fontWeight: 700,
                          border: '2px solid #58CC02',
                          boxShadow: '0 4px 0 #4CAF50'
                        }}
                      >
                        Settings
                      </Button>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Paper>
            )}
          </Transition>

          {/* Duolingo-style Stats Cards */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" ref={statsRef}>
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="stat-card"
                shadow="lg" 
                padding="lg" 
                radius="20"
                style={{ 
                  background: 'white',
                  border: `3px solid ${stat.color}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: `0 15px 35px ${stat.color}40`,
                    duration: 0.3 
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { 
                    scale: 1, 
                    y: 0,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    duration: 0.3 
                  });
                }}
              >
                <Stack align="center" gap="sm">
                  <Box
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid white',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Text size="1.5rem">{stat.mascot}</Text>
                  </Box>
                  <Text size="2xl" fw={900} ta="center" c="#4B4B4B">
                    {stat.value}
                  </Text>
                  <Stack gap={2} align="center">
                    <Text size="sm" fw={700} ta="center" c="#4B4B4B">
                      {stat.title}
                    </Text>
                    <Text size="xs" c="dimmed" ta="center" fw={500}>
                      {stat.subtitle}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>

          <Grid gutter="xl">
            {/* Quick Practice - Duolingo Style */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card 
                ref={practiceRef}
                shadow="lg" 
                padding="xl" 
                radius="20" 
                h="100%"
                style={{ 
                  background: 'white',
                  border: '3px solid #58CC02'
                }}
              >
                <Stack gap="lg">
                  <Group justify="space-between">
                    <Group>
                      <Box
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: '#58CC02',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                        }}
                      >
                        <Text size="1.2rem">🚀</Text>
                      </Box>
                      <Title order={2} c="#4B4B4B" fw={800}>Start Learning</Title>
                    </Group>
                    <Badge 
                      size="lg" 
                      variant="gradient" 
                      gradient={{ from: '#58CC02', to: '#4CAF50' }}
                      radius="xl"
                      style={{ fontWeight: 700 }}
                    >
                      ⚡ Lightning Fast
                    </Badge>
                  </Group>
                  
                  <Text c="dimmed" size="lg" fw={500} lh={1.6}>
                    Choose your STAAR adventure! Our game engine creates 
                    <strong> 25,000x faster</strong> questions than traditional methods.
                  </Text>

                  <Divider color="#58CC02" size="md" />

                  <Grid gutter="lg">
                    <Grid.Col span={6}>
                      <Select
                        label="Grade Level"
                        placeholder="Select grade"
                        value={selectedGrade}
                        onChange={(value) => setSelectedGrade(value || '4')}
                        size="lg"
                        radius="xl"
                        data={[
                          { value: '3', label: '🎯 Grade 3' },
                          { value: '4', label: '🎯 Grade 4' },
                          { value: '5', label: '🎯 Grade 5' }
                        ]}
                        styles={{
                          input: { 
                            border: '2px solid #58CC02',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Subject"
                        placeholder="Select subject"
                        value={selectedSubject}
                        onChange={(value) => setSelectedSubject(value || 'math')}
                        size="lg"
                        radius="xl"
                        data={[
                          { value: 'math', label: '🧮 Mathematics' },
                          { value: 'reading', label: '📚 Reading' }
                        ]}
                        styles={{
                          input: { 
                            border: '2px solid #1CB0F6',
                            fontWeight: 600
                          }
                        }}
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
                    radius="xl"
                    styles={{
                      input: { 
                        border: '2px solid #FF9600',
                        fontWeight: 600
                      }
                    }}
                  />

                  <Button 
                    className="practice-button"
                    size="xl"
                    variant="gradient"
                    gradient={{ from: '#58CC02', to: '#4CAF50' }}
                    leftSection={<IconPlayerPlay size={24} />}
                    onClick={handleStartPractice}
                    loading={generateQuestionsMutation.isPending}
                    fullWidth
                    radius="xl"
                    style={{ 
                      fontSize: '1.2rem',
                      height: 60,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      border: '3px solid #FFC83D',
                      boxShadow: '0 6px 0 #4CAF50',
                      transition: 'all 0.1s ease'
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'translateY(3px)';
                      e.currentTarget.style.boxShadow = '0 3px 0 #4CAF50';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 0 #4CAF50';
                    }}
                  >
                    {generateQuestionsMutation.isPending ? '⏳ Loading Adventure...' : '🎮 Start Lesson'}
                  </Button>

                  <Text size="sm" c="dimmed" ta="center" fw={500}>
                    ⚡ Powered by our game engine - instant challenges, zero wait time
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>

            {/* Progress Circles - Duolingo Style */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="lg" padding="xl" radius="20" h="100%" style={{ background: 'white', border: '3px solid #1CB0F6' }}>
                <Stack gap="lg">
                  <Group>
                    <Box
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#1CB0F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text size="1rem">📊</Text>
                    </Box>
                    <Title order={3} c="#4B4B4B" fw={800}>Your Progress</Title>
                  </Group>
                  
                  <Stack gap="xl" align="center">
                    <Box ta="center">
                      <RingProgress
                        size={140}
                        thickness={16}
                        sections={[{ value: demoUser.mathProgress, color: '#58CC02' }]}
                        label={
                          <Stack align="center" gap={4}>
                            <Text size="2rem">🧮</Text>
                            <Text size="lg" fw={900} c="#4B4B4B">{demoUser.mathProgress}%</Text>
                          </Stack>
                        }
                        style={{ border: '3px solid #58CC02', borderRadius: '50%' }}
                      />
                      <Text fw={700} mt="sm" c="#4B4B4B">Math Mastery</Text>
                      <Text size="sm" c="dimmed" fw={500}>Keep going, champion!</Text>
                    </Box>

                    <Box ta="center">
                      <RingProgress
                        size={140}
                        thickness={16}
                        sections={[{ value: demoUser.readingProgress, color: '#1CB0F6' }]}
                        label={
                          <Stack align="center" gap={4}>
                            <Text size="2rem">📚</Text>
                            <Text size="lg" fw={900} c="#4B4B4B">{demoUser.readingProgress}%</Text>
                          </Stack>
                        }
                        style={{ border: '3px solid #1CB0F6', borderRadius: '50%' }}
                      />
                      <Text fw={700} mt="sm" c="#4B4B4B">Reading Power</Text>
                      <Text size="sm" c="dimmed" fw={500}>You're on fire! 🔥</Text>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Recent Achievements - Duolingo Style */}
          <Card shadow="lg" padding="xl" radius="20" style={{ background: 'white', border: '3px solid #CE82FF' }}>
            <Stack gap="lg">
              <Group justify="space-between">
                <Group>
                  <Box
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: '#CE82FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text size="1.2rem">🏆</Text>
                  </Box>
                  <Title order={3} c="#4B4B4B" fw={800}>Recent Achievements</Title>
                </Group>
                <Button 
                  variant="outline" 
                  color="violet" 
                  size="sm" 
                  rightSection={<IconChevronRight size={16} />}
                  radius="xl"
                  style={{ fontWeight: 700 }}
                >
                  View All
                </Button>
              </Group>
              
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                {achievements.map((achievement, index) => (
                  <Paper 
                    key={index} 
                    p="lg" 
                    radius="15" 
                    style={{ 
                      background: achievement.color + '15',
                      border: `2px solid ${achievement.color}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
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
                      <Group justify="space-between">
                        <Group gap="sm">
                          <Box
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: achievement.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Text size="1rem">{achievement.mascot}</Text>
                          </Box>
                          <Stack gap={2}>
                            <Text fw={700} size="sm" c="#4B4B4B">{achievement.title}</Text>
                            <Badge size="xs" variant="filled" color="green" radius="xl">
                              {achievement.xp}
                            </Badge>
                          </Stack>
                        </Group>
                      </Group>
                      <Text size="xs" c="dimmed" fw={500}>{achievement.description}</Text>
                      <Text size="xs" c="dimmed" fw={600}>{achievement.date}</Text>
                    </Stack>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>
          </Card>

          {/* Performance Highlight - Duolingo Style */}
          <Paper 
            p="xl" 
            radius="20" 
            style={{ 
              background: 'linear-gradient(135deg, #E8F5FD 0%, #D1ECFC 100%)',
              border: '3px solid #1CB0F6'
            }}
          >
            <Group justify="space-between" align="center">
              <Stack gap="sm">
                <Group gap="sm">
                  <Text size="2rem">🚀</Text>
                  <Title order={3} c="#1976D2" fw={800}>
                    Revolutionary Learning Engine
                  </Title>
                </Group>
                <Text c="#1976D2" size="lg" fw={500} lh={1.6}>
                  Our breakthrough game engine creates authentic STAAR questions 
                  <strong> 25,000x faster</strong> than traditional methods - delivering instant practice 
                  with mathematically verified accuracy. It's like having a superpower! ⚡
                </Text>
              </Stack>
              <Box
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: '#1CB0F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '4px solid white',
                  boxShadow: '0 8px 25px rgba(28, 176, 246, 0.3)'
                }}
                className="floating-heart"
              >
                <Text size="2.5rem">⚡</Text>
              </Box>
            </Group>
          </Paper>
        </Stack>

        {/* Level Up Modal - Duolingo Style */}
        <Modal 
          opened={showLevelUp} 
          onClose={() => setShowLevelUp(false)}
          centered
          size="md"
          withCloseButton={false}
          styles={{
            content: { 
              borderRadius: '20px',
              border: '4px solid #FFC83D',
              background: 'linear-gradient(135deg, #58CC02, #4CAF50)'
            }
          }}
        >
          <Stack align="center" gap="xl" p="xl">
            <Text size="4rem" style={{ animation: 'bounce 1s infinite' }}>🎉</Text>
            <Title order={2} c="white" ta="center" fw={800}>
              Level Up!
            </Title>
            <Text size="xl" c="white" ta="center" fw={600}>
              Congratulations! You've reached Level {demoUser.level + 1}!
            </Text>
            <Button 
              size="lg" 
              variant="white" 
              color="green"
              radius="xl"
              onClick={() => setShowLevelUp(false)}
              style={{ fontWeight: 700 }}
            >
              Continue Learning! 🚀
            </Button>
          </Stack>
        </Modal>
      </Container>
    </Box>
  );
}