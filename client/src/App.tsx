import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppShell, Burger, Group, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useAuth } from "@/hooks/useAuth";
import LandingMantine from "@/pages/landing-mantine";
import SimpleDashboard from "@/pages/simple-dashboard";
import ExamPage from "@/pages/exam";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  
  // Check if demo mode is enabled
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';

  const shouldShowAppShell = (isAuthenticated || isDemo) && !isLoading;

  if (!shouldShowAppShell) {
    return (
      <Switch>
        <Route path="/" component={LandingMantine} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group>
            <img src="/staarkids-logo.svg" alt="STAAR Kids" style={{ height: '32px' }} />
            <Text size="lg" fw={700} c="brand.6">
              STAAR Kids
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="sm" c="dimmed">Navigation</Text>
        {/* Navigation items will be added here */}
      </AppShell.Navbar>

      <AppShell.Main>
        <Switch>
          <Route path="/dashboard" component={SimpleDashboard} />
          <Route path="/exam/:examId" component={ExamPage} />
          <Route path="/" component={SimpleDashboard} />
          <Route component={NotFound} />
        </Switch>
      </AppShell.Main>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
