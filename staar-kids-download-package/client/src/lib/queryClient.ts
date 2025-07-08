import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    let url = queryKey[0] as string;
    
    // Check if demo mode is enabled
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
    
    // Redirect API calls to demo endpoints when in demo mode
    if (isDemo) {
      if (url === '/api/stats') {
        url = '/api/demo/stats';
      } else if (url === '/api/star-power/stats') {
        url = '/api/demo/star-power/stats';
      } else if (url === '/api/accuracy') {
        url = '/api/demo/accuracy';
      } else if (url === '/api/auth/user') {
        // Return demo user data directly
        return {
          id: "demo-user",
          email: "demo@staarkids.org",
          firstName: "Demo",
          lastName: "Student",
          profileImageUrl: null,
          starPower: 1250,
          role: "student",
          grade: 4,
          rank: "Explorer"
        };
      }
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
