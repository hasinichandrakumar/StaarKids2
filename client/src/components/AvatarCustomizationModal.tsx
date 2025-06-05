import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface AvatarCustomizationModalProps {
  user: User;
  onClose: () => void;
}

export default function AvatarCustomizationModal({ user, onClose }: AvatarCustomizationModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarType || "fox");
  const [selectedColor, setSelectedColor] = useState(user.avatarColor || "#FF5B00");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const avatarOptions = [
    { id: "bunny", emoji: "🐰", name: "Bunny" },
    { id: "fox", emoji: "🦊", name: "Fox" },
    { id: "turtle", emoji: "🐢", name: "Turtle" },
    { id: "starfish", emoji: "⭐", name: "Starfish" },
    { id: "giraffe", emoji: "🦒", name: "Giraffe" },
  ];

  const colorOptions = [
    "#FF5B00", // Primary
    "#FCC201", // Secondary
    "#10B981", // Success
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
  ];

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { avatarType: string; avatarColor: string }) => {
      await apiRequest("PATCH", "/api/user/profile", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Avatar Updated!",
        description: "Your avatar has been successfully customized.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      avatarType: selectedAvatar,
      avatarColor: selectedColor,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">Customize Your Avatar</h3>
          
          {/* Avatar Preview */}
          <div className="flex justify-center mb-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl border-4 border-gray-200"
              style={{ backgroundColor: selectedColor }}
            >
              {avatarOptions.find(a => a.id === selectedAvatar)?.emoji}
            </div>
          </div>
          
          {/* Avatar Options */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`relative p-4 border-2 rounded-xl transition-colors ${
                  selectedAvatar === avatar.id ? "border-primary" : "border-gray-200 hover:border-primary"
                }`}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                  {avatar.emoji}
                </div>
                <p className="text-sm font-medium text-gray-700">{avatar.name}</p>
              </button>
            ))}
          </div>
          
          {/* Color Options */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Choose Color</h4>
            <div className="flex space-x-3 justify-center">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === color ? "border-gray-700 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
