import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Star, GraduationCap, Users, Heart } from 'lucide-react';

const roleSelectionSchema = z.object({
  role: z.enum(['student', 'parent', 'teacher'], {
    required_error: 'Please select your role',
  }),
  grade: z.string().optional(),
}).refine((data) => {
  if (data.role === 'student' && !data.grade) {
    return false;
  }
  return true;
}, {
  message: "Grade is required for students",
  path: ["grade"],
});

type RoleSelectionForm = z.infer<typeof roleSelectionSchema>;

export default function RoleSelection() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState('');

  const form = useForm<RoleSelectionForm>({
    resolver: zodResolver(roleSelectionSchema),
    defaultValues: {
      role: undefined,
      grade: undefined,
    },
  });

  const selectedRole = form.watch('role');

  const completeRegistrationMutation = useMutation({
    mutationFn: async (data: RoleSelectionForm) => {
      const response = await apiRequest('/api/auth/complete-google-registration', 'POST', {
        ...data,
        grade: data.role === 'student' ? parseInt(data.grade || '4') : undefined,
      });
      return response;
    },
    onSuccess: (data: any) => {
      if (data.success) {
        toast({
          title: 'Account Created!',
          description: `Welcome to StaarKids, ${data.user.firstName}!`,
        });
        
        // Redirect based on user role
        if (data.user.role === 'teacher') {
          setLocation('/teacher-dashboard');
        } else if (data.user.role === 'parent') {
          setLocation('/parent-dashboard');
        } else {
          setLocation('/dashboard');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    },
    onError: (error: any) => {
      setError(error.message || 'Registration failed');
    },
  });

  const onSubmit = (data: RoleSelectionForm) => {
    setError('');
    completeRegistrationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Star className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us your role to personalize your StaarKids experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="parent">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            Parent
                          </div>
                        </SelectItem>
                        <SelectItem value="teacher">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Teacher
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Grade Selection for Students */}
              {selectedRole === 'student' && (
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="3">3rd Grade</SelectItem>
                          <SelectItem value="4">4th Grade</SelectItem>
                          <SelectItem value="5">5th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={completeRegistrationMutation.isPending}
              >
                {completeRegistrationMutation.isPending ? (
                  'Creating Account...'
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}