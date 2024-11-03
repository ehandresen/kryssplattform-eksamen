import { useAuth } from '@/hooks/useAuth';
import { Redirect, Stack } from 'expo-router';
import { View, Text } from 'react-native';

const AppLayout = () => {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
};

export default AppLayout;
