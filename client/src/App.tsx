import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ExamPage from "@/pages/exam";
import Settings from "@/pages/Settings";
import TeacherDashboard from "@/pages/TeacherDashboard";
import ParentDashboard from "@/pages/ParentDashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Check if demo mode is enabled
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/teacher-dashboard">
        <TeacherDashboard />
      </Route>
      <Route path="/teacher">
        <TeacherDashboard />
      </Route>
      <Route path="/parent-dashboard">
        <ParentDashboard />
      </Route>
      <Route path="/parent">
        <ParentDashboard />
      </Route>
      <Route path="/exam/:examId" component={ExamPage} />
      {(isLoading || (!isAuthenticated && !isDemo)) ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Dashboard} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
