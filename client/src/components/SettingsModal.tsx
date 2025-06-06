import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, Settings, TestTube, Heart, Building2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType } from "@shared/schema";

interface SettingsModalProps {
  user: UserType;
  selectedGrade: number;
  onGradeChange: (grade: number) => void;
  onClose: () => void;
}

export default function SettingsModal({ user, selectedGrade, onGradeChange, onClose }: SettingsModalProps) {
  const [tempGrade, setTempGrade] = useState(selectedGrade);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onGradeChange(tempGrade);
    onClose();
  };

  const handleRoleChange = async (newRole: string) => {
    setIsChangingRole(true);
    try {
      await apiRequest("POST", "/api/test/role", { role: newRole });
      toast({
        title: "Role Changed",
        description: `Successfully switched to ${newRole} account. Refreshing...`,
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChangingRole(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Profile Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-600">Name</Label>
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Email</Label>
                <p className="text-sm text-gray-700">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Grade Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Grade Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="grade-select" className="text-xs font-medium text-gray-600">
                  Select your current grade
                </Label>
                <Select value={tempGrade.toString()} onValueChange={(value) => setTempGrade(parseInt(value))}>
                  <SelectTrigger id="grade-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3rd Grade</SelectItem>
                    <SelectItem value="4">4th Grade</SelectItem>
                    <SelectItem value="5">5th Grade</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  This affects the questions and content you'll see across all practice areas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Role Testing Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Role Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">Current Role:</span>
                  <Badge variant="outline">{user.role || 'student'}</Badge>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600">Switch to test role:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange('student')}
                      disabled={isChangingRole || user.role === 'student'}
                      className="justify-start"
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Student Dashboard
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange('parent')}
                      disabled={isChangingRole || user.role === 'parent'}
                      className="justify-start"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Parent Dashboard
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange('teacher')}
                      disabled={isChangingRole || user.role === 'teacher'}
                      className="justify-start"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Teacher Dashboard
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Test different account types to see role-based dashboards and features.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}