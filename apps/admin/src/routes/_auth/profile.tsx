import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Media } from "@workspace/api-client";
import { userService } from "@workspace/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaLibraryModal } from "@/components/MediaLibrary/MediaLibraryModal";

export const Route = createFileRoute("/_auth/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { avatarId?: number }) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleAvatarSelect = (media: Media[]) => {
    if (media.length > 0 && media[0]) {
      updateProfileMutation.mutate({ avatarId: media[0].id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  // Handle case where user data might be missing or error occurred
  if (!user) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile photo and personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative group">
              <Avatar
                className="h-24 w-24 border-2 border-muted cursor-pointer"
                onClick={() => setIsMediaModalOpen(true)}
              >
                <AvatarImage src={user?.avatar?.url} alt={user?.userName} />
                <AvatarFallback className="text-xl">
                  {user?.userName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </Avatar>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-medium">{user.userName}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Button variant="outline" size="sm" onClick={() => setIsMediaModalOpen(true)}>
                Change Avatar
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Username</Label>
            <div className="p-2 border rounded-md bg-muted/50 text-sm">{user.userName}</div>
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <div className="p-2 border rounded-md bg-muted/50 text-sm">{user.email}</div>
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <div className="p-2 border rounded-md bg-muted/50 text-sm capitalize">{user.role}</div>
          </div>
        </CardContent>
      </Card>

      <MediaLibraryModal
        open={isMediaModalOpen}
        onOpenChange={setIsMediaModalOpen}
        onSelect={(media) => {
          handleAvatarSelect(media);
          setIsMediaModalOpen(false);
        }}
        maxSelect={1}
      />
    </div>
  );
}
