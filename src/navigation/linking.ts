import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'raxa://', 'https://raxa.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      App: {
        screens: {
          Home: '',
          Create: 'create',
          Profile: 'profile',
        },
      },
      MatchDetail: 'matches/:matchId',
      InvitePreview: 'invite/:code',
    },
  },
};
