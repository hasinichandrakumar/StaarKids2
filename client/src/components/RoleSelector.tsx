import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Users, GraduationCap, Heart, Building2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RoleSelectorProps {
  onRoleSelected: (role: string, additionalData?: any) => void;
  currentUser: any;
}

export default function RoleSelector({ onRoleSelected, currentUser }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [organizationData, setOrganizationData] = useState({
    name: "",
    type: "school",
    email: "",
    phone: "",
    address: ""
  });
  const [studentId, setStudentId] = useState("");
  const { toast } = useToast();

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Access practice questions, mock exams, and track your STAAR test preparation progress",
      icon: GraduationCap,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      id: "parent",
      title: "Parent",
      description: "Monitor your child's learning progress, view detailed reports, and receive updates",
      icon: Heart,
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      id: "teacher",
      title: "Teacher/Organization",
      description: "Manage multiple students, track class progress, and access comprehensive analytics",
      icon: Building2,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    }
  ];

  const handleSubmit = async () => {
    try {
      let additionalData = {};

      if (selectedRole === "teacher") {
        // Create organization if teacher role
        additionalData = { organizationData };
      } else if (selectedRole === "parent") {
        // Link to student account
        additionalData = { studentId };
      }

      // Update user role
      await apiRequest("PATCH", "/api/user/role", {
        role: selectedRole,
        ...additionalData
      });

      toast({
        title: "Account setup complete!",
        description: `Welcome to StaarKids as a ${selectedRole}!`,
      });

      onRoleSelected(selectedRole, additionalData);
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const renderRoleSpecificForm = () => {
    if (selectedRole === "teacher") {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                value={organizationData.name}
                onChange={(e) => setOrganizationData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Lincoln Elementary School"
              />
            </div>
            <div>
              <Label htmlFor="orgType">Organization Type *</Label>
              <Select value={organizationData.type} onValueChange={(value) => setOrganizationData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="tutoring_center">Tutoring Center</SelectItem>
                  <SelectItem value="district">School District</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="orgEmail">Contact Email</Label>
              <Input
                id="orgEmail"
                type="email"
                value={organizationData.email}
                onChange={(e) => setOrganizationData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@lincolnelementary.edu"
              />
            </div>
            <div>
              <Label htmlFor="orgPhone">Phone Number</Label>
              <Input
                id="orgPhone"
                value={organizationData.phone}
                onChange={(e) => setOrganizationData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="orgAddress">Address</Label>
              <Textarea
                id="orgAddress"
                value={organizationData.address}
                onChange={(e) => setOrganizationData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Education St, Austin, TX 78701"
              />
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Verification Required:</strong> Teacher and organization accounts require verification. 
                You'll receive access to the full dashboard once verified by our team.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (selectedRole === "parent") {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Link to Student Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="studentId">Student Account ID *</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your child's account ID"
              />
              <p className="text-sm text-gray-600 mt-1">
                Your child can find their account ID in their profile settings.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> A student account must be created before linking a parent account. 
                You'll be able to monitor your child's progress, view reports, and receive updates.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            Welcome to StaarKids!
          </h1>
          <p className="text-lg text-gray-600">Choose your account type to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 ${role.color} ${
                  selectedRole === role.id ? "ring-2 ring-orange-400 shadow-lg" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {renderRoleSpecificForm()}

        {selectedRole && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-3 text-lg"
              disabled={
                (selectedRole === "teacher" && !organizationData.name) ||
                (selectedRole === "parent" && !studentId)
              }
            >
              Complete Setup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}