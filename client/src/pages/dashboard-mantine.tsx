import { useState } from "react";
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
  Box,
  SimpleGrid
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
  IconSettings
} from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { notifications } from '@mantine/notifications';

export default function DashboardMantine() {
  const [selectedGrade, setSelectedGrade] = useState<string>('4');
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [practiceCount, setPracticeCount] = useState(5);
  const queryClient = useQueryClient();

  // Demo user data
  const demoUser = {
    name: "Demo Student",
    grade: 4,
    starPower: 850,
    level: 12,
    streak: 7,
    accuracy: 85
  };

  // Fetch questions for practice
  const generateQuestionsMutation = useMutation({
    mutationFn: async ({ grade, subject, count }: { grade: number, subject: string, count: number }) => {
      return apiRequest(`/api/questions/generate-fast`, {
        method: 'POST',
        body: { grade, subject, count, category: 'General' }
      });
    },
    onSuccess: (data) => {
      notifications.show({
        title: 'Practice Questions Ready!',
        message: `Generated ${data.length} questions for practice`,
        color: 'green'
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Generation Failed',
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
      color: "yellow"
    },
    {
      title: "Current Level",
      value: demoUser.level,
      icon: IconTrophy,
      color: "orange"
    },
    {
      title: "Day Streak",
      value: demoUser.streak,
      icon: IconTarget,
      color: "blue"
    },
    {
      title: "Accuracy",
      value: `${demoUser.accuracy}%`,
      icon: IconChartBar,
      color: "green"
    }
  ];

  const subjects = [
    {
      id: 'math',
      title: 'Math Mastery',
      description: 'Practice with authentic STAAR math questions',
      icon: IconCalculator,
      color: 'orange',
      progress: 75
    },
    {
      id: 'reading',
      title: 'Reading Excellence',
      description: 'Master reading comprehension skills',
      icon: IconBook,
      color: 'blue',
      progress: 60
    }
  ];

  const recentAchievements = [
    { title: "Math Streak Master", description: "Completed 7 days in a row", date: "Today" },
    { title: "Reading Champion", description: "Scored 90%+ on reading test", date: "Yesterday" },
    { title: "Problem Solver", description: "Solved 50 math problems", date: "2 days ago" }
  ];

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Welcome Header */}
        <Paper p="xl" radius="md" style={{ background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)' }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Group>
                <Avatar size="lg" color="white" variant="filled">
                  <IconUser size={24} />
                </Avatar>
                <Stack gap={4}>
                  <Title order={2} c="white">
                    Welcome back, {demoUser.name}!
                  </Title>
                  <Text c="white" opacity={0.9}>
                    Grade {demoUser.grade} • Ready to continue your STAAR journey?
                  </Text>
                </Stack>
              </Group>
            </Stack>
            
            <Button variant="white" color="orange" leftSection={<IconSettings size={16} />}>
              Profile Settings
            </Button>
          </Group>
        </Paper>

        {/* Stats Overview */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
          {stats.map((stat, index) => (
            <Card key={index} shadow="sm" padding="lg" radius="md">
              <Group gap="sm">
                <ThemeIcon size="xl" variant="light" color={stat.color}>
                  <stat.icon size={24} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Text size="xl" fw={700} c={`${stat.color}.6`}>
                    {stat.value}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {stat.title}
                  </Text>
                </Stack>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        <Grid gutter="lg">
          {/* Quick Practice */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card shadow="sm" padding="lg" radius="md" h="100%">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>Quick Practice</Title>
                  <Badge color="orange" variant="light">New Questions Daily</Badge>
                </Group>
                
                <Text c="dimmed">
                  Start practicing with authentic STAAR questions. Our efficient generation system 
                  creates questions instantly with verified mathematical accuracy.
                </Text>

                <Divider />

                <Grid gutter="md">
                  <Grid.Col span={6}>
                    <Select
                      label="Grade Level"
                      placeholder="Select grade"
                      value={selectedGrade}
                      onChange={(value) => setSelectedGrade(value || '4')}
                      data={[
                        { value: '3', label: 'Grade 3' },
                        { value: '4', label: 'Grade 4' },
                        { value: '5', label: 'Grade 5' }
                      ]}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Subject"
                      placeholder="Select subject"
                      value={selectedSubject}
                      onChange={(value) => setSelectedSubject(value || 'math')}
                      data={[
                        { value: 'math', label: 'Mathematics' },
                        { value: 'reading', label: 'Reading' }
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
                />

                <Button 
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'orange', to: 'yellow' }}
                  leftSection={<IconPlayerPlay size={20} />}
                  onClick={handleStartPractice}
                  loading={generateQuestionsMutation.isPending}
                  fullWidth
                >
                  Start Practice Session
                </Button>

                <Text size="xs" c="dimmed" ta="center">
                  ⚡ Powered by our efficient template system - instant generation, zero wait time
                </Text>
              </Stack>
            </Card>
          </Grid.Col>

          {/* Subject Progress */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" h="100%">
              <Stack gap="md">
                <Title order={3}>Subject Progress</Title>
                
                {subjects.map((subject) => (
                  <Paper key={subject.id} p="md" radius="md" withBorder>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Group gap="xs">
                          <ThemeIcon size="sm" variant="light" color={subject.color}>
                            <subject.icon size={16} />
                          </ThemeIcon>
                          <Text fw={500}>{subject.title}</Text>
                        </Group>
                        <IconChevronRight size={16} />
                      </Group>
                      
                      <Text size="sm" c="dimmed">
                        {subject.description}
                      </Text>
                      
                      <Progress 
                        value={subject.progress} 
                        color={subject.color} 
                        size="sm" 
                        radius="xl" 
                      />
                      
                      <Text size="xs" c="dimmed">
                        {subject.progress}% Complete
                      </Text>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Recent Achievements */}
        <Card shadow="sm" padding="lg" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Recent Achievements</Title>
              <Button variant="subtle" size="sm" rightSection={<IconChevronRight size={16} />}>
                View All
              </Button>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              {recentAchievements.map((achievement, index) => (
                <Paper key={index} p="md" radius="md" withBorder>
                  <Stack gap="xs">
                    <Group gap="xs">
                      <ThemeIcon size="sm" variant="light" color="yellow">
                        <IconTrophy size={16} />
                      </ThemeIcon>
                      <Text fw={500} size="sm">{achievement.title}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">{achievement.description}</Text>
                    <Badge size="xs" variant="outline">{achievement.date}</Badge>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Performance Highlight */}
        <Paper p="lg" radius="md" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Title order={4} c="blue.8">
                🚀 System Performance Highlight
              </Title>
              <Text c="blue.7">
                Our new efficient generation system creates questions 25,000x faster than AI calls - 
                giving you instant practice with mathematically verified STAAR questions.
              </Text>
            </Stack>
            <ThemeIcon size="xl" variant="light" color="blue">
              <IconChartBar size={24} />
            </ThemeIcon>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}