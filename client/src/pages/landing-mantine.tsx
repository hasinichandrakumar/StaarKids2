import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  Center,
  Paper,
  Flex,
  List,
  ThemeIcon,
  Box,
  Space,
  Divider
} from '@mantine/core';
import { 
  IconStar, 
  IconBook, 
  IconCalculator, 
  IconTrophy, 
  IconTarget, 
  IconBolt, 
  IconArrowRight, 
  IconCheck, 
  IconUsers, 
  IconAward, 
  IconPlayerPlay, 
  IconBrain, 
  IconBulb, 
  IconTrendingUp,
  IconEye,
  IconBrandGoogle
} from '@tabler/icons-react';
import { useLocation } from "wouter";
import { notifications } from '@mantine/notifications';

export default function LandingMantine() {
  const { login, loginWithGoogle } = useAuth();
  const [_, setLocation] = useLocation();
  const [animatedCount, setAnimatedCount] = useState(0);

  const processGoogleOAuth = async (code: string) => {
    try {
      localStorage.setItem('oauthCode', code);
      window.history.replaceState({}, document.title, '/');
      window.location.href = `/auth-process?code=${encodeURIComponent(code)}`;
    } catch (error) {
      console.error("OAuth processing error:", error);
      notifications.show({
        title: 'Authentication Error',
        message: 'Failed to process login. Please try again.',
        color: 'red'
      });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callback = urlParams.get('callback');
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (callback === 'google' && code) {
      console.log('Processing Google OAuth callback...');
      processGoogleOAuth(code);
    } else if (callback === 'google' && error) {
      console.error('OAuth error:', error);
      notifications.show({
        title: 'Login Failed',
        message: 'Google authentication was cancelled or failed.',
        color: 'red'
      });
    }

    // Animate student count
    const timer = setTimeout(() => {
      let count = 0;
      const target = 15000;
      const increment = target / 100;
      const interval = setInterval(() => {
        count += increment;
        if (count >= target) {
          setAnimatedCount(target);
          clearInterval(interval);
        } else {
          setAnimatedCount(Math.floor(count));
        }
      }, 20);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    window.location.href = "/auth/google/login";
  };

  const handleDemoMode = () => {
    localStorage.setItem('demoMode', 'true');
    window.location.href = '/dashboard';
  };

  const stats = [
    { value: "15,000+", label: "Students Served" },
    { value: "95%", label: "Test Score Improvement" },
    { value: "2013-2025", label: "Authentic STAAR Questions" }
  ];

  const features = [
    {
      icon: IconCalculator,
      title: "Math Mastery",
      description: "Practice authentic STAAR Math questions from grades 3-5 with step-by-step solutions and TEKS alignment.",
      color: "orange"
    },
    {
      icon: IconBook,
      title: "Reading Excellence", 
      description: "Master reading comprehension with real STAAR passages and questions designed to build critical thinking skills.",
      color: "yellow"
    },
    {
      icon: IconTarget,
      title: "Mock Exams",
      description: "Take full-length practice tests that mirror the actual STAAR format and timing for complete preparation.",
      color: "orange"
    },
    {
      icon: IconTrendingUp,
      title: "Progress Tracking",
      description: "Monitor improvement with detailed analytics, performance insights, and personalized learning recommendations.",
      color: "blue"
    },
    {
      icon: IconTrophy,
      title: "StarPower Rewards",
      description: "Earn points and achievements as you master concepts, making learning engaging and motivational.",
      color: "orange"
    },
    {
      icon: IconBrain,
      title: "AI-Powered Learning",
      description: "Get personalized question recommendations and adaptive learning paths powered by advanced AI technology.",
      color: "yellow"
    }
  ];

  return (
    <Box style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fff8e1, #fffde7)' }}>
      {/* Header Navigation */}
      <Paper shadow="sm" p="md">
        <Container size="xl">
          <Group justify="space-between">
            <Group>
              <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }}>
                <IconStar size={20} />
              </ThemeIcon>
              <Title order={2} c="orange.6">STAAR Kids</Title>
            </Group>
            
            <Group>
              <Button variant="outline" color="orange" onClick={handleDemoMode}>
                Try Dashboard
              </Button>
              <Button variant="subtle" color="gray" onClick={handleLogin}>
                Sign In
              </Button>
              <Button 
                variant="gradient" 
                gradient={{ from: 'orange', to: 'yellow' }}
                onClick={handleLogin}
              >
                Sign Up Free
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Container size="xl" py={80}>
        <Stack align="center" gap="xl">
          <Center>
            <ThemeIcon size={80} variant="gradient" gradient={{ from: 'orange', to: 'yellow' }} radius="xl">
              <IconStar size={40} />
            </ThemeIcon>
          </Center>
          
          <Stack align="center" gap="md">
            <Title 
              order={1} 
              size={48} 
              ta="center"
              variant="gradient"
              gradient={{ from: 'orange', to: 'yellow' }}
            >
              Master STAAR Tests with Confidence
            </Title>
            
            <Text size="xl" ta="center" c="dimmed" maw={600}>
              The ultimate educational platform for Texas students in grades 3-5. 
              Practice with authentic STAAR questions, track progress, and achieve excellence.
            </Text>
          </Stack>

          <Group gap="lg">
            <Button 
              size="lg"
              variant="gradient" 
              gradient={{ from: 'orange', to: 'yellow' }}
              leftSection={<IconPlayerPlay size={20} />}
              onClick={handleLogin}
            >
              Start Learning Free
            </Button>
            
            <Button 
              size="lg"
              variant="outline" 
              color="orange"
              leftSection={<IconEye size={20} />}
              onClick={handleDemoMode}
            >
              View Demo
            </Button>
          </Group>

          {/* Stats */}
          <Grid mt="xl" gutter="xl">
            {stats.map((stat, index) => (
              <Grid.Col span={4} key={index}>
                <Paper p="lg" radius="md" ta="center" shadow="sm">
                  <Text size="xl" fw={700} c="orange.6">
                    {index === 0 ? animatedCount.toLocaleString() + '+' : stat.value}
                  </Text>
                  <Text c="dimmed">{stat.label}</Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>

      <Divider />

      {/* Features Section */}
      <Container size="xl" py={80}>
        <Stack align="center" gap="xl">
          <Title order={2} ta="center" c="dark">
            Everything You Need to Excel
          </Title>
          
          <Grid gutter="lg">
            {features.map((feature, index) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={index}>
                <Card shadow="sm" padding="lg" radius="md" h="100%">
                  <Stack gap="md" h="100%">
                    <ThemeIcon size="xl" variant="light" color={feature.color}>
                      <feature.icon size={24} />
                    </ThemeIcon>
                    
                    <Title order={4}>{feature.title}</Title>
                    <Text c="dimmed" size="sm">
                      {feature.description}
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>

      <Divider />

      {/* CTA Section */}
      <Container size="xl" py={80}>
        <Paper 
          p="xl" 
          radius="lg" 
          style={{ 
            background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)',
            color: 'white'
          }}
        >
          <Stack align="center" gap="lg">
            <Title order={2} ta="center" c="white">
              Ready to Boost Your STAAR Scores?
            </Title>
            
            <Text size="lg" ta="center" c="white" opacity={0.9}>
              Join thousands of students who have improved their test scores with STAAR Kids.
            </Text>
            
            <Group gap="lg">
              <Button 
                size="lg"
                variant="white"
                color="orange"
                leftSection={<IconBrandGoogle size={20} />}
                onClick={handleLogin}
              >
                Sign Up with Google
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                style={{ borderColor: 'white', color: 'white' }}
                onClick={handleDemoMode}
              >
                Try Demo First
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>

      <Space h={40} />
    </Box>
  );
}