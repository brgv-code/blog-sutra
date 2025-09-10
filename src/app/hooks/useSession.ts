import { useSessionStore } from "@/store/session";
import { useQuery } from "@tanstack/react-query";
export function useSession() {
  const { user, setUser, clear } = useSessionStore();

  const query = useQuery({
    queryKey: ["session"],
    queryFn: getCurrentUser,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { user, ...query };
}
