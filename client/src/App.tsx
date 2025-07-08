import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ExamPage from "@/pages/exam";
import NotFound from "@/pages/not-found";

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check if demo mode is enabled
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';

  if (!isAuthenticated && !isDemo && !isLoading) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/exam/:examId" component={ExamPage} />
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications position="top-right" />
        <Router />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;