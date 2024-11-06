export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Set session to a non-null value to simulate a logged-in state
  const [session, setSession] = useState<string | null>("bypassed-session");
  const [isLoading, setIsLoading] = useState(false); // Set isLoading to false by default

  // Comment out the useEffect that listens for authentication state changes
  /*
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        console.log("user:", user?.displayName);
        setSession(user ? user.displayName : null);
        setIsLoading(false);
      });
    }, []);
    */

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential | void> => {
    try {
      setIsLoading(true); // Set loading before attempting sign-in
      const userCredential = await authApi.signIn(email, password);
      if (userCredential) {
        setSession(userCredential.user.email); // Update session with user email after sign-in
        return userCredential;
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsLoading(false); // Set loading back to false after attempt
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: async () => {
          await authApi.signOut();
          setSession(null);
        },
        session,
        isLoading,
        setIsLoading: (value) => setIsLoading(value),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
