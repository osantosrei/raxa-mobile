import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../store/authStore';
import { colors } from '../theme';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { linkingConfig } from './linking';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner label="Abrindo o Raxa" />;
  }

  return (
    <NavigationContainer<RootStackParamList> linking={linkingConfig}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShown: false,
        }}
      >
        {token ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
