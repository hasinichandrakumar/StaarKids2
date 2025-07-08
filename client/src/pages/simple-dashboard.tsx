import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Stack, 
  Grid, 
  Paper,
  Group
} from '@mantine/core';
import { 
  IconCalculator, 
  IconBook
} from '@tabler/icons-react';

export default function SimpleDashboard() {
  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Welcome Header */}
        <Paper p="xl" radius="md" style={{ background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)' }}>
          <Title order={2} c="white">
            Welcome to STAAR Kids!
          </Title>
          <Text c="white" opacity={0.9}>
            Your personalized learning journey starts here
          </Text>
        </Paper>

        {/* Quick Practice */}
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" h="100%">
              <Stack gap="md">
                <Group>
                  <IconCalculator size={24} color="#FF5B00" />
                  <Title order={3}>Math Practice</Title>
                </Group>
                <Text c="dimmed">
                  Practice with authentic STAAR math questions
                </Text>
                <Button 
                  variant="gradient"
                  gradient={{ from: 'orange', to: 'yellow' }}
                  fullWidth
                >
                  Start Math Practice
                </Button>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" h="100%">
              <Stack gap="md">
                <Group>
                  <IconBook size={24} color="#FF5B00" />
                  <Title order={3}>Reading Practice</Title>
                </Group>
                <Text c="dimmed">
                  Master reading comprehension skills
                </Text>
                <Button 
                  variant="gradient"
                  gradient={{ from: 'orange', to: 'yellow' }}
                  fullWidth
                >
                  Start Reading Practice
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Performance Note */}
        <Paper p="lg" radius="md" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
          <Title order={4} c="blue.8">
            🚀 System Performance Highlight
          </Title>
          <Text c="blue.7">
            Our efficient generation system creates questions 25,000x faster than AI calls - 
            giving you instant practice with mathematically verified STAAR questions.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}