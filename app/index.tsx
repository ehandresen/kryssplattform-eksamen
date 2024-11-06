// import React, { useEffect } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";

// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//     // Redirect to the authentication screen after 3 seconds
//     const timer = setTimeout(() => {
//       router.push("./login");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [router]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.welcomeText}>Welcome to ArtVista</Text>
//       <Text style={styles.subText}>Redirecting to login...</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   welcomeText: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   subText: {
//     fontSize: 16,
//     color: "gray",
//   },
// });
import { View, Text } from "react-native";
import React from "react";
import LoginScreen from "@/components/LoginScreen";

const Login = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <LoginScreen />
    </View>
  );
};

export default Login;
