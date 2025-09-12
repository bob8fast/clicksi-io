// Mock session for removed authentication
export const useSession = () => ({
  data: null,
  status: 'unauthenticated' as const,
  update: async () => null,
});

export const getSession = () => Promise.resolve(null);
export const signIn = () => Promise.resolve();
export const signOut = () => Promise.resolve();