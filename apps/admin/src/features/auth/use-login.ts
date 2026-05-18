import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authService, type LoginCredentials } from "@workspace/api-client";
import { toast } from "sonner";
import { useAuthStore } from "./stores/auth-store";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data, variables) => {
      // Decode token or use response data to get user ID if available
      // For now, mapping response to store structure
      setAuth(
        {
          id: 0, // Placeholder, usually extracted from token
          userName: variables.userName,
          email: "", // Placeholder
          role: data.role,
        },
        data.accessToken,
      );
      toast.success("Logged in successfully");
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to login");
    },
  });
};
