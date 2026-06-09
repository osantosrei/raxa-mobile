import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CreateMatchScreen } from '../screens/match/CreateMatchScreen';
import { MatchListScreen } from '../screens/match/MatchListScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
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
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="Home"
        component={MatchListScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="football" size={size} />,
        }}
      />
      <Tabs.Screen
        name="Create"
        component={CreateMatchScreen}
        options={{
          title: 'Criar',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="add-circle" size={size} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person" size={size} />,
        }}
      />
    </Tabs.Navigator>
  );
}
