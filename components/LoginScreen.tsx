const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const { signIn, isLoading, setIsLoading, session } = useAuth();

  /*
    if (session) {
      return <Redirect href="/" />;
    }
    */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUpMode ? "Sign Up" : "Login"}</Text>
      {/* Rest of the component remains unchanged */}
    </View>
  );
};
