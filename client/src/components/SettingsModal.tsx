import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap, Settings } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface SettingsModalProps {
  user: UserType;
  selectedGrade: number;
  onGradeChange: (grade: number) => void;
  onClose: () => void;
}

export default function SettingsModal({ user, selectedGrade, onGradeChange, onClose }: SettingsModalProps) {
  const [tempGrade, setTempGrade] = useState(selectedGrade);

  const handleSave = () => {
    onGradeChange(tempGrade);
    onClose();
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