import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CreatePlaceholderScreen } from '../screens/match/CreatePlaceholderScreen';
import { MatchListPlaceholderScreen } from '../screens/match/MatchListPlaceholderScreen';
import { ProfilePlaceholderScreen } from '../screens/profile/ProfilePlaceholderScreen';
import { colors, typography } from '../theme';
import type { AppTabsParamList } from './types';

const Tabs = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.bold,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={MatchListPlaceholderScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="football" size={size} />,
        }}
      />
      <Tabs.Screen
        name="Create"
        component={CreatePlaceholderScreen}
        options={{
          title: 'Criar',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="add-circle" size={size} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfilePlaceholderScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person" size={size} />,
        }}
      />
    </Tabs.Navigator>
  );
}
